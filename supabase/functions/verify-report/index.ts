import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const PREFIX = "LVR1:";

interface ReportPayload {
  v: number;
  rows: [string, string][];
  fingerprint: string;
  verificationId: string;
  shortId: string;
  contentHash: string;
}

const sha256 = async (text: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: ReportPayload;
  try {
    const body = await req.json();
    const encoded = typeof body?.payload === "string" ? body.payload : "";
    if (!encoded.startsWith(PREFIX) || encoded.length > 200_000) {
      return json({ error: "Missing or malformed report payload." }, 400);
    }
    payload = JSON.parse(atob(encoded.slice(PREFIX.length)));
    if (
      !Array.isArray(payload.rows) ||
      typeof payload.fingerprint !== "string" ||
      typeof payload.verificationId !== "string"
    ) {
      return json({ error: "Report payload is incomplete." }, 400);
    }
  } catch {
    return json({ error: "Report payload could not be decoded." }, 400);
  }

  // 1. Recompute the tamper-evident fingerprint from the printed field list.
  const computed = await sha256(payload.rows.map(([k, v]) => `${k}=${v}`).join("|"));
  const fingerprintValid = computed === payload.fingerprint;

  // 2. Cross-check the report against the live verification record.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );
  const { data } = await supabase
    .from("blockchain_records")
    .select("record_type,title,version,content_hash,tx_hash,block_number,status,network,contract_address")
    .eq("verification_id", payload.verificationId)
    .maybeSingle();

  const recordFound = Boolean(data);
  const hashMatchesRecord = recordFound
    ? (payload.contentHash || "").toLowerCase() === String(data!.content_hash).toLowerCase()
    : false;

  const authentic = fingerprintValid && recordFound && hashMatchesRecord;

  return json({
    authentic,
    fingerprintValid,
    recordFound,
    hashMatchesRecord,
    computedFingerprint: computed,
    reportFingerprint: payload.fingerprint,
    shortId: payload.shortId,
    verificationId: payload.verificationId,
    record: data ?? null,
    reason: authentic
      ? "The report fingerprint matches its printed field list and the live on-chain record."
      : !fingerprintValid
        ? "The fingerprint does not match the report contents — this PDF has been altered."
        : !recordFound
          ? "No verification record exists for the ID printed in this report."
          : "The hash in this report does not match the live verification record.",
  });
});
