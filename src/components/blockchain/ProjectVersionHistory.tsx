import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecordHistory } from "@/hooks/useBlockchain";
import { shortHash, txUrl, getNetwork } from "@/lib/blockchain/networks";
import { displayVerificationId } from "@/lib/blockchain/hash";

interface Props {
  entityTable: string;
  entityId?: string | null;
}

/**
 * Immutable version history for one entity: every registered version with its
 * content hash, verification timestamp and PolygonScan transaction link.
 */
const ProjectVersionHistory = ({ entityTable, entityId }: Props) => {
  const { history } = useRecordHistory(entityTable, entityId);
  const confirmed = history.filter((r) => r.tx_hash);

  if (confirmed.length === 0) return null;

  return (
    <div className="mt-5 rounded-xl border border-border/40 bg-secondary/20 p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
        Version History · {confirmed.length} on-chain {confirmed.length === 1 ? "version" : "versions"}
      </p>

      <ol className="relative space-y-3">
        {confirmed.map((record, i) => {
          const network = getNetwork(record.network);
          return (
            <motion.li
              key={record.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative pl-5"
            >
              <span
                className={`absolute left-0 top-2 w-2 h-2 rounded-full ${
                  i === 0 ? "bg-emerald-400" : "bg-blue-primary/60"
                }`}
              />
              {i < confirmed.length - 1 && (
                <span className="absolute left-[3.5px] top-5 bottom-[-12px] w-px bg-border/50" />
              )}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm font-semibold">
                  v{record.version}
                  {i === 0 && <span className="ml-2 text-[10px] uppercase tracking-widest text-emerald-400">current</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {record.registered_at ? new Date(record.registered_at).toLocaleString() : "—"}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {displayVerificationId(record.verification_id)}
                </span>
              </div>
              <p className="text-xs font-mono text-muted-foreground break-all mt-0.5">
                hash {shortHash(record.content_hash, 10)}
              </p>
              <div className="flex flex-wrap gap-4 mt-1">
                <a
                  href={txUrl(record.network, record.tx_hash!)}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-bright hover:underline"
                >
                  {network.explorerName} →
                </a>
                <Link
                  to={`/verify/${record.verification_id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-bright hover:underline"
                >
                  Verification report →
                </Link>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProjectVersionHistory;
