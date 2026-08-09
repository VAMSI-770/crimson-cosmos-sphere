import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { buildContentProof, RECORD_TYPE_LABEL, type VerifiableType } from "@/lib/blockchain/content";
import { verifyHashOnChain, readOnChainRecord } from "@/lib/blockchain/registry";
import { getNetwork, shortHash, txUrl, addressUrl } from "@/lib/blockchain/networks";
import CopyButton from "./CopyButton";
import { displayVerificationId } from "@/lib/blockchain/hash";
import type { BlockchainConfig, BlockchainRecord } from "@/hooks/useBlockchain";

type Result = "checking" | "verified" | "modified" | "unregistered" | "pending" | "syncerror" | "error";

interface Props {
  open: boolean;
  onClose: () => void;
  type: VerifiableType;
  entity: Record<string, unknown>;
  record: BlockchainRecord | null;
  config: BlockchainConfig | null;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/40 last:border-0">
    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground shrink-0">{label}</span>
    <span className="text-sm text-right break-all">{children}</span>
  </div>
);

const VerificationModal = ({ open, onClose, type, entity, record, config }: Props) => {
  const [result, setResult] = useState<Result>("checking");
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [chainTimestamp, setChainTimestamp] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const networkKey = record?.network ?? config?.network;
  const network = getNetwork(networkKey);
  const contractAddress = record?.contract_address ?? config?.contract_address ?? null;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const run = async () => {
      setResult("checking");
      setComputedHash(null);
      setChainTimestamp(null);
      setMessage("");

      if (!record || !contractAddress) {
        if (!cancelled) {
          setResult("unregistered");
          setMessage("This item has not been registered on the blockchain yet.");
        }
        return;
      }

      try {
        const proof = await buildContentProof(type, entity);
        if (cancelled) return;
        setComputedHash(proof.hash);

        const onChain = await readOnChainRecord(contractAddress, networkKey, record.verification_id);
        if (cancelled) return;
        if (onChain) setChainTimestamp(onChain.timestamp);

        const ok = await verifyHashOnChain(
          contractAddress,
          networkKey,
          record.verification_id,
          `0x${proof.hash}`,
        );
        if (cancelled) return;

        if (ok) {
          setResult("verified");
          setMessage("The current content hash matches the proof stored on-chain.");
        } else if (!onChain) {
          setResult("unregistered");
          setMessage("No proof found on-chain for this verification ID.");
        } else {
          setResult("modified");
          setMessage("The current content does not match the on-chain proof.");
        }
      } catch (error) {
        if (cancelled) return;
        setResult("error");
        setMessage(error instanceof Error ? error.message : "Verification failed.");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [open, record, contractAddress, networkKey, type, entity]);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  const statusColour =
    result === "verified"
      ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
      : result === "checking"
        ? "text-blue-bright border-blue-primary/30 bg-blue-primary/10"
        : result === "unregistered"
          ? "text-muted-foreground border-border/50 bg-secondary/40"
          : "text-red-400 border-red-400/30 bg-red-400/10";

  const statusLabel = {
    checking: "Verifying…",
    verified: "Verified",
    modified: "Modified or Invalid",
    unregistered: "Not Registered",
    error: "Verification Error",
  }[result];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg cinema-card border-border/60">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Blockchain Verification
            <span className="block text-xs font-normal tracking-[0.25em] uppercase text-muted-foreground mt-1">
              {RECORD_TYPE_LABEL[type]}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className={`rounded-xl border px-4 py-3 mb-2 ${statusColour}`}>
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {result === "checking" ? (
                <motion.span
                  key="spin"
                  className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <motion.span
                  key="dot"
                  className="w-2.5 h-2.5 rounded-full bg-current"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                />
              )}
            </AnimatePresence>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{statusLabel}</p>
              {message && <p className="text-xs opacity-80 mt-0.5">{message}</p>}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <Row label="Network">
            {network.name}
            {network.isTestnet && <span className="ml-2 text-xs text-muted-foreground">testnet</span>}
          </Row>
          <Row label="Verification ID">
            <span className="inline-flex items-center gap-2">
              {record ? displayVerificationId(record.verification_id) : "—"}
              <CopyButton value={record?.verification_id} label="Copy" />
            </span>
          </Row>

          <Row label="Owner Wallet">
            {record?.owner_wallet || config?.owner_wallet ? (
              <a
                className="text-blue-bright hover:underline"
                href={addressUrl(networkKey, (record?.owner_wallet ?? config?.owner_wallet)!)}
                target="_blank"
                rel="noreferrer noopener"
              >
                {shortHash(record?.owner_wallet ?? config?.owner_wallet)}
              </a>
            ) : (
              "—"
            )}
          </Row>
          <Row label="Timestamp">
            {chainTimestamp
              ? new Date(chainTimestamp * 1000).toLocaleString()
              : record?.registered_at
                ? new Date(record.registered_at).toLocaleString()
                : "—"}
          </Row>
          <Row label="Current Hash">
            <span className="font-mono text-xs">{computedHash ? shortHash(computedHash, 8) : "—"}</span>
          </Row>
          <Row label="On-Chain Hash">
            <span className="font-mono text-xs">{record ? shortHash(record.content_hash, 8) : "—"}</span>
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
        </div>

        {record?.tx_hash && (
          <a
            href={txUrl(networkKey, record.tx_hash)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 block text-center text-sm font-semibold rounded-xl border border-blue-primary/30 bg-blue-primary/10 text-blue-bright px-4 py-2.5 hover:bg-blue-primary/20 transition-colors"
          >
            View on {network.explorerName}
          </a>
        )}

        {record && (
          <Link
            to={`/verify/${record.verification_id}`}
            onClick={onClose}
            className="mt-2 block text-center text-sm font-semibold rounded-xl border border-border/50 bg-secondary/40 px-4 py-2.5 hover:bg-secondary transition-colors"
          >
            Open full verification report
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
