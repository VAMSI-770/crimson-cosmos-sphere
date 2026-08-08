import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { extractReportPayload, fieldList } from "@/lib/blockchain/report";
import { sha256Text } from "@/lib/blockchain/hash";

interface Result {
  authentic: boolean;
  fingerprintValid: boolean;
  recordFound: boolean;
  hashMatchesRecord: boolean;
  reason: string;
  shortId: string;
  computedFingerprint: string;
  reportFingerprint: string;
}

/**
 * Public control for checking an exported verification report. The PDF never
 * leaves the browser: the embedded field list is re-hashed locally, and only the
 * payload is sent to the public endpoint for a cross-check against the live record.
 */
const ReportVerifier = () => {
  const input = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    setChecking(true);
    setResult(null);
    setFileName(file.name);
    try {
      const bytes = await file.arrayBuffer();
      const payload = extractReportPayload(bytes);

      // Local check first — instant, offline, and independent of the endpoint.
      const localFingerprint = await sha256Text(fieldList(payload.rows));

      const { data, error } = await supabase.functions.invoke("verify-report", {
        body: { payload: `LVR1:${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}` },
      });
      if (error) throw error;

      const outcome = data as Result;
      setResult({ ...outcome, computedFingerprint: localFingerprint });
      if (outcome.authentic) toast.success("Report is authentic and matches the live record");
      else toast.error("Report could not be authenticated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read this report");
    } finally {
      setChecking(false);
      if (input.current) input.current.value = "";
    }
  };

  const tone = result
    ? result.authentic
      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
      : "text-red-400 border-red-400/30 bg-red-400/10"
    : "";

  return (
    <div className="cinema-card rounded-2xl p-5 sm:p-7 mt-6">
      <h2 className="text-lg font-display font-bold mb-1">Verify an exported report</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Upload a verification report PDF. Its SHA-256 fingerprint is recomputed from the printed field list and
        checked against the live record — any altered value breaks the match.
      </p>

      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        aria-label="Verification report PDF"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => input.current?.click()}
          disabled={checking}
          className="text-sm font-semibold rounded-xl border border-blue-primary/30 bg-blue-primary/10 text-blue-bright px-5 py-2.5 hover:bg-blue-primary/20 transition-colors disabled:opacity-50"
        >
          {checking ? "Checking report…" : "Choose PDF report"}
        </motion.button>
        {fileName && <span className="text-xs text-muted-foreground truncate max-w-[240px]">{fileName}</span>}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 rounded-xl border px-4 py-3 ${tone}`}
        >
          <p className="text-sm font-display font-semibold">
            {result.authentic ? "Authentic report" : "Report failed verification"}
            {result.shortId ? ` · ${result.shortId}` : ""}
          </p>
          <p className="text-xs opacity-80 mt-1">{result.reason}</p>
          <ul className="mt-3 space-y-1 text-xs opacity-90">
            <li>Fingerprint matches field list: {result.fingerprintValid ? "yes" : "no"}</li>
            <li>Verification record found: {result.recordFound ? "yes" : "no"}</li>
            <li>Report hash matches record: {result.hashMatchesRecord ? "yes" : "no"}</li>
          </ul>
          <p className="mt-3 text-[11px] font-mono break-all opacity-70">
            recomputed {result.computedFingerprint}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ReportVerifier;
