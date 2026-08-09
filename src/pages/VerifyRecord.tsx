import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBlockchainConfig, type BlockchainRecord } from "@/hooks/useBlockchain";
import { buildContentProof, RECORD_TYPE_LABEL, type VerifiableType } from "@/lib/blockchain/content";
import { readOnChainRecord, verifyHashOnChain, type OnChainRecord } from "@/lib/blockchain/registry";
import { addressUrl, getNetwork, shortHash, txUrl } from "@/lib/blockchain/networks";
import { displayVerificationId } from "@/lib/blockchain/hash";
import ProjectVersionHistory from "@/components/blockchain/ProjectVersionHistory";
import CopyButton from "@/components/blockchain/CopyButton";
import { useVerificationRealtime } from "@/hooks/useChainEvents";
import { generateVerificationReport } from "@/lib/blockchain/report";
import ReportVerifier from "@/components/blockchain/ReportVerifier";

type Status =
  | "loading"
  | "verified"
  | "modified"
  | "unregistered"
  | "notfound"
  | "pending"
  | "syncerror"
  | "error";


const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 py-3 border-b border-border/40 last:border-0">
    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">{label}</span>
    <span className="text-sm text-right break-all min-w-0">{children}</span>
  </div>
);

/** Loads the record, either by full verification id or by short VRF-XXXX-XXXX form. */
const loadRecord = async (id: string): Promise<BlockchainRecord | null> => {
  const { data } = await supabase
    .from("blockchain_records")
    .select("*")
    .eq("verification_id", id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data) return data as unknown as BlockchainRecord;

  const short = id.toUpperCase();
  const { data: all } = await supabase.from("blockchain_records").select("*");
  const list = (all as unknown as BlockchainRecord[]) ?? [];
  return list.find((r) => displayVerificationId(r.verification_id) === short) ?? null;
};

/** Rebuilds the exact entity payload that was hashed at registration time. */
const loadEntity = async (record: BlockchainRecord): Promise<Record<string, unknown> | null> => {
  if (record.record_type === "resume") {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("section", "hero")
      .eq("key", "resume_url")
      .maybeSingle();
    const url = (data as { value?: string } | null)?.value;
    return url ? { id: "resume", url } : null;
  }
  if (!record.entity_table || !record.entity_id) return null;
  const { data } = await supabase
    .from(record.entity_table as "projects")
    .select("*")
    .eq("id", record.entity_id)
    .maybeSingle();
  return (data as Record<string, unknown> | null) ?? null;
};

const VerifyRecord = () => {
  const { id = "" } = useParams();
  const { data: config } = useBlockchainConfig();

  const [record, setRecord] = useState<BlockchainRecord | null>(null);
  const [onChain, setOnChain] = useState<OnChainRecord | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const networkKey = record?.network ?? config?.network;
  const network = getNetwork(networkKey);
  const contractAddress = record?.contract_address ?? config?.contract_address ?? null;

  const run = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    setComputedHash(null);
    setOnChain(null);
    try {
      const found = await loadRecord(id);
      setRecord(found);
      if (!found) {
        setStatus("notfound");
        setMessage("No verification record exists for this ID.");
        return;
      }

      const address = found.contract_address ?? config?.contract_address ?? null;
      if (!address) {
        setStatus("unregistered");
        setMessage("No registry contract is associated with this record yet.");
        return;
      }

      const chainRecord = await readOnChainRecord(address, found.network, found.verification_id);
      setOnChain(chainRecord);
      if (!chainRecord || !chainRecord.timestamp) {
        if (found.status === "pending") {
          setStatus("pending");
          setMessage("The registration transaction has not been confirmed on-chain yet. Check back shortly.");
        } else if (found.status === "failed") {
          setStatus("unregistered");
          setMessage("The registration transaction for this record did not succeed, so no proof exists on-chain.");
        } else {
          setStatus("unregistered");
          setMessage("This verification ID was not found on the blockchain.");
        }
        return;
      }

      // Database ↔ blockchain consistency. The chain is always the source of
      // truth; any drift is surfaced instead of being reported as verified.
      const chainHash = (chainRecord.contentHash || "").replace(/^0x/, "").toLowerCase();
      const dbHash = (found.content_hash || "").replace(/^0x/, "").toLowerCase();
      if (chainHash && dbHash && chainHash !== dbHash) {
        setStatus("syncerror");
        setMessage(
          "The stored proof for this record does not match the proof on the blockchain. Verification is withheld until this is resolved.",
        );
        return;
      }
      if (chainRecord.version && found.version && chainRecord.version !== found.version) {
        setStatus("syncerror");
        setMessage(
          "The record version on the blockchain differs from the stored version. Verification is withheld until this is resolved.",
        );
        return;
      }

      const entity = await loadEntity(found);
      if (!entity) {
        setStatus("modified");
        setMessage("The original content is no longer available, so it cannot be re-hashed and matched.");
        return;
      }

      const proof = await buildContentProof(found.record_type as VerifiableType, entity);
      setComputedHash(proof.hash);

      const ok = await verifyHashOnChain(address, found.network, found.verification_id, `0x${proof.hash}`);
      if (ok) {
        setStatus("verified");
        setMessage("The live content was re-hashed in your browser and matches the proof stored on-chain.");
      } else {
        setStatus("modified");
        setMessage("The live content hash does not match the proof stored on-chain — it has been modified.");
      }
    } catch {
      // Never surface raw database/RPC errors to the public page.
      setStatus("error");
      setMessage("We could not complete the verification right now. Please retry in a moment.");
    }

  }, [id, config?.contract_address]);

  useEffect(() => {
    void run();
  }, [run]);

  // Live refresh: any registration or status change re-runs the proof check.
  useVerificationRealtime(run);

  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!record) return;
    setExporting(true);
    try {
      await generateVerificationReport({
        status: label,
        statusNote: message || "Verification result for this portfolio record.",
        recordType: RECORD_TYPE_LABEL[record.record_type as VerifiableType],
        title: record.title,
        version: record.version,
        owner: "Bollepalli Vamsi",
        verificationId: record.verification_id,
        shortId: displayVerificationId(record.verification_id),
        network: networkKey,
        contractAddress,
        ownerWallet: record.owner_wallet,
        verifiedAt: onChain?.timestamp
          ? new Date(onChain.timestamp * 1000).toISOString()
          : record.registered_at,
        blockNumber: onChain?.blockNumber || record.block_number,
        onChainHash: onChain?.contentHash ?? (record.content_hash ? `0x${record.content_hash}` : null),
        computedHash: computedHash ? `0x${computedHash}` : null,
        txHash: record.tx_hash,
        verifyUrl: `${window.location.origin}/verify/${displayVerificationId(record.verification_id)}`,
      });
      toast.success("Verification report downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate report");
    } finally {
      setExporting(false);
    }
  };


  const tone = useMemo(() => {
    if (status === "verified") return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    if (status === "loading") return "text-blue-bright border-blue-primary/30 bg-blue-primary/10";
    if (status === "unregistered" || status === "notfound") return "text-muted-foreground border-border/50 bg-secondary/40";
    return "text-red-400 border-red-400/30 bg-red-400/10";
  }, [status]);

  const label = {
    loading: "Verifying…",
    verified: "Verified",
    modified: "Modified or Invalid",
    unregistered: "Not Registered On-Chain",
    notfound: "Unknown Verification ID",
    error: "Verification Error",
  }[status];

  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${what} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground tracking-[0.2em] uppercase">
          ← Back to portfolio
        </Link>

        <h1 className="mt-6 text-2xl sm:text-3xl font-display font-bold">
          Blockchain <span className="gradient-text">Verification</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 mb-8">
          Independent, wallet-free proof check. The content is re-hashed in your browser and compared with the
          hash anchored on {network.name}.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border px-5 py-4 mb-6 ${tone}`}
        >
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <motion.span
                className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
            )}
            <div className="min-w-0">
              <p className="text-base font-display font-semibold">{label}</p>
              {message && <p className="text-xs opacity-80 mt-0.5">{message}</p>}
            </div>
          </div>
        </motion.div>

        <div className="cinema-card rounded-2xl p-5 sm:p-7">
          <Row label="Record Type">{record ? RECORD_TYPE_LABEL[record.record_type as VerifiableType] : "—"}</Row>
          <Row label="Title">{record?.title ?? "—"}</Row>
          <Row label="Version">{record ? `v${record.version}` : "—"}</Row>
          <Row label="Portfolio Owner">Bollepalli Vamsi</Row>
          <Row label="Verification ID">
            <span className="inline-flex items-center gap-2">
              <span className="font-mono text-xs">
                {record ? displayVerificationId(record.verification_id) : id}
              </span>
              <CopyButton value={record?.verification_id ?? id} label="Copy" />
            </span>
          </Row>
          <Row label="Network">
            {network.name}
            {network.isTestnet && <span className="ml-2 text-xs text-muted-foreground">testnet</span>}
          </Row>
          <Row label="Contract">
            {contractAddress ? (
              <a
                className="text-blue-bright hover:underline font-mono text-xs"
                href={addressUrl(networkKey, contractAddress)}
                target="_blank"
                rel="noreferrer noopener"
              >
                {shortHash(contractAddress, 8)}
              </a>
            ) : (
              "—"
            )}
            <CopyButton value={contractAddress} label="Copy" className="ml-2" />
          </Row>
          <Row label="Owner Wallet">
            {record?.owner_wallet ? (
              <a
                className="text-blue-bright hover:underline font-mono text-xs"
                href={addressUrl(networkKey, record.owner_wallet)}
                target="_blank"
                rel="noreferrer noopener"
              >
                {shortHash(record.owner_wallet, 8)}
              </a>
            ) : (
              "—"
            )}
          </Row>
          <Row label="Verified At">
            {onChain?.timestamp
              ? new Date(onChain.timestamp * 1000).toLocaleString()
              : record?.registered_at
                ? new Date(record.registered_at).toLocaleString()
                : "—"}
          </Row>
          <Row label="Block">{onChain?.blockNumber || record?.block_number || "—"}</Row>
          <Row label="On-Chain Hash">
            <span className="inline-flex items-center gap-2">
              <span className="font-mono text-xs">
                {shortHash(onChain?.contentHash ?? record?.content_hash, 10)}
              </span>
              <CopyButton value={onChain?.contentHash ?? record?.content_hash} label="Copy" />
            </span>
          </Row>
          <Row label="Re-Computed Hash">
            <span className="font-mono text-xs">{computedHash ? shortHash(computedHash, 10) : "—"}</span>
          </Row>
          <Row label="Transaction">
            {record?.tx_hash ? (
              <span className="inline-flex items-center gap-2">
                <span className="font-mono text-xs">{shortHash(record.tx_hash)}</span>
                <button
                  type="button"
                  onClick={() => copy(record.tx_hash!, "Transaction hash")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Copy
                </button>
              </span>
            ) : (
              "—"
            )}
          </Row>

          <div className="flex flex-wrap gap-3 mt-5">
            {record?.tx_hash && (
              <a
                href={txUrl(networkKey, record.tx_hash)}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 min-w-[180px] text-center text-sm font-semibold rounded-xl border border-blue-primary/30 bg-blue-primary/10 text-blue-bright px-4 py-2.5 hover:bg-blue-primary/20 transition-colors"
              >
                View on {network.explorerName}
              </a>
            )}
            <button
              type="button"
              onClick={() => void run()}
              className="flex-1 min-w-[140px] text-sm font-semibold rounded-xl border border-border/50 bg-secondary/40 px-4 py-2.5 hover:bg-secondary transition-colors"
            >
              Re-verify
            </button>
            <button
              type="button"
              onClick={() => void handleExportPdf()}
              disabled={!record || exporting}
              className="flex-1 min-w-[160px] text-sm font-semibold rounded-xl border border-border/50 bg-secondary/40 px-4 py-2.5 hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {exporting ? "Preparing…" : "Export PDF Report"}
            </button>
          </div>
          {record && (
            <p className="text-[11px] text-muted-foreground mt-2">
              The report includes both hashes, timestamps, transaction details and {network.explorerName}{" "}
              links, plus a SHA-256 fingerprint of its own contents.
            </p>
          )}

          {record?.entity_table && record.entity_id && (
            <ProjectVersionHistory entityTable={record.entity_table} entityId={record.entity_id} />
          )}
        </div>

        <ReportVerifier />
      </div>
    </main>
  );
};

export default VerifyRecord;
