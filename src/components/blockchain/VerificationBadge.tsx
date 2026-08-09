import { useState } from "react";
import { motion } from "framer-motion";
import { displayVerificationId } from "@/lib/blockchain/hash";
import type { VerifiableType } from "@/lib/blockchain/content";
import type { BlockchainConfig, BlockchainRecord } from "@/hooks/useBlockchain";
import VerificationModal from "./VerificationModal";

interface Props {
  type: VerifiableType;
  entity: Record<string, unknown>;
  record: BlockchainRecord | null;
  config: BlockchainConfig | null;
  /** Compact mode drops the verification id line (used on dense cards). */
  compact?: boolean;
  className?: string;
}

/**
 * Small trust chip appended to existing cards. Opens the verification modal;
 * never blocks or alters the surrounding layout.
 */
const VerificationBadge = ({ type, entity, record, config, compact, className = "" }: Props) => {
  const [open, setOpen] = useState(false);

  // "Verified" is only ever claimed for a confirmed transaction. Pending,
  // failed and sync-error records fall back to a neutral/amber chip so the
  // portfolio never shows a proof that the chain has not accepted.
  const state: "verified" | "pending" | "attention" | "none" = !record
    ? "none"
    : record.status === "confirmed" && record.tx_hash
      ? "verified"
      : record.status === "pending"
        ? "pending"
        : record.status === "failed" || record.status === "sync_error"
          ? "attention"
          : "none";

  const isVerified = state === "verified";
  const label =
    state === "verified"
      ? "Verified on Blockchain"
      : state === "pending"
        ? "Confirming On-Chain"
        : state === "attention"
          ? "Verification Pending Review"
          : "Unverified";
  const chipTone =
    state === "verified"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
      : state === "pending" || state === "attention"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
        : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground";
  const dotTone =
    state === "verified" ? "bg-emerald-400" : state === "none" ? "bg-muted-foreground" : "bg-amber-400";

  return (
    <>
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${chipTone} ${className}`}
        title={isVerified ? "Verify this record on the blockchain" : "Open verification details"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotTone}`} />
        {label}
        {isVerified && !compact && record && (
          <span className="font-mono normal-case tracking-normal opacity-70">
            {displayVerificationId(record.verification_id)}
          </span>
        )}
      </motion.button>


      <VerificationModal
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        entity={entity}
        record={record ?? null}
        config={config}
      />
    </>
  );
};

export default VerificationBadge;
