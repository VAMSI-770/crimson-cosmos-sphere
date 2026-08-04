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
  const isRegistered = Boolean(record?.tx_hash);

  return (
    <>
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
          isRegistered
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
            : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
        } ${className}`}
        title={isRegistered ? "Verify this record on the blockchain" : "Not yet registered on-chain"}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isRegistered ? "bg-emerald-400" : "bg-muted-foreground"}`} />
        {isRegistered ? "Verified on Blockchain" : "Unverified"}
        {isRegistered && !compact && record && (
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
