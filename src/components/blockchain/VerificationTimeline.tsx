import { motion } from "framer-motion";
import { getNetwork, shortHash, txUrl } from "@/lib/blockchain/networks";
import { displayVerificationId } from "@/lib/blockchain/hash";
import { TIMELINE_EVENT_LABEL, type VerifiableType } from "@/lib/blockchain/content";
import type { BlockchainRecord } from "@/hooks/useBlockchain";

interface Props {
  records: BlockchainRecord[];
  limit?: number;
}

const VerificationTimeline = ({ records, limit }: Props) => {
  const items = (limit ? records.slice(0, limit) : records).filter((r) => r.status !== "failed");

  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No blockchain events recorded yet.
      </p>
    );
  }

  return (
    <ol className="relative border-l border-border/50 pl-6 space-y-6">
      {items.map((record, i) => {
        const network = getNetwork(record.network);
        const when = record.registered_at ?? record.created_at;
        return (
          <motion.li
            key={record.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.4 }}
            className="relative"
          >
            <span
              className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-background ${
                record.tx_hash ? "bg-emerald-400" : "bg-muted-foreground"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-sm font-semibold">
                {TIMELINE_EVENT_LABEL[record.record_type as VerifiableType] ?? "Record Registered"}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(when).toLocaleDateString()} · {new Date(when).toLocaleTimeString()}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
                  record.tx_hash ? "text-emerald-400" : "text-muted-foreground"
                }`}
              >
                {record.tx_hash ? "Verified" : record.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 break-words">
              {record.title || "Untitled"}
              {record.version > 1 && (
                <span className="ml-2 text-xs text-blue-bright/80">v{record.version}</span>
              )}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="font-mono text-muted-foreground">
                {displayVerificationId(record.verification_id)}
              </span>
              {record.tx_hash && (
                <a
                  href={txUrl(record.network, record.tx_hash)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-blue-bright hover:underline font-mono"
                >
                  {shortHash(record.tx_hash)} ↗
                </a>
              )}
              <span className="text-muted-foreground">{network.shortName}</span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
};

export default VerificationTimeline;
