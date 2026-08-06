import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BlockchainConfig, BlockchainRecord } from "@/hooks/useBlockchain";
import {
  readContractOwner,
  readGasPriceGwei,
  readLatestBlock,
  readOnChainRecord,
  readTotalRecords,
  verifyBatchOnChain,
} from "@/lib/blockchain/registry";
import { getNetwork } from "@/lib/blockchain/networks";

export interface HealthCheck {
  key: string;
  label: string;
  status: "ok" | "warn" | "fail" | "unknown";
  detail: string;
}

export interface HealthResult {
  checks: HealthCheck[];
  latestBlock: number | null;
  gasGwei: number | null;
  onChainCount: number | null;
  pending: number;
  failed: number;
  missing: number;
  checkedAt: string | null;
}

const EMPTY: HealthResult = {
  checks: [],
  latestBlock: null,
  gasGwei: null,
  onChainCount: null,
  pending: 0,
  failed: 0,
  missing: 0,
  checkedAt: null,
};

/**
 * Read-only diagnostics for the admin Blockchain Health panel: RPC reachability,
 * contract + owner, database/chain sync drift, pending & failed transactions,
 * gas conditions and explorer availability. No wallet or signature required.
 */
export const useBlockchainHealth = (
  config: BlockchainConfig | null | undefined,
  records: BlockchainRecord[],
  walletAddress: string | null,
) => {
  const [result, setResult] = useState<HealthResult>(EMPTY);
  const [running, setRunning] = useState(false);

  const run = useCallback(async () => {
    setRunning(true);
    const network = getNetwork(config?.network);
    const checks: HealthCheck[] = [];

    const latestBlock = await readLatestBlock(config?.network);
    checks.push({
      key: "rpc",
      label: "RPC Connectivity",
      status: latestBlock ? "ok" : "fail",
      detail: latestBlock ? `${network.name} · block ${latestBlock.toLocaleString()}` : "No RPC response",
    });

    checks.push({
      key: "wallet",
      label: "Wallet",
      status: walletAddress ? "ok" : "warn",
      detail: walletAddress ? "Connected — ready to sign" : "Not connected (reads still work)",
    });

    let onChainCount: number | null = null;
    if (config?.contract_address) {
      const [owner, total] = await Promise.all([
        readContractOwner(config.contract_address, config.network),
        readTotalRecords(config.contract_address, config.network),
      ]);
      onChainCount = total;
      checks.push({
        key: "contract",
        label: "Contract",
        status: owner ? "ok" : "fail",
        detail: owner ? `Live · owner ${owner.slice(0, 10)}…` : "Contract unreachable",
      });
      const ownerMatches =
        !config.owner_wallet || !owner || owner.toLowerCase() === config.owner_wallet.toLowerCase();
      checks.push({
        key: "owner",
        label: "Owner Authority",
        status: ownerMatches ? "ok" : "warn",
        detail: ownerMatches ? "On-chain owner matches registry config" : "Owner wallet mismatch",
      });
    } else {
      checks.push({ key: "contract", label: "Contract", status: "warn", detail: "Not deployed yet" });
    }

    const confirmed = records.filter((r) => Boolean(r.tx_hash));
    const pending = records.filter((r) => r.status === "pending" && !r.tx_hash).length;
    const failed = records.filter((r) => r.status === "failed").length;

    let missing = 0;
    if (config?.contract_address && confirmed.length) {
      const results = await verifyBatchOnChain(
        config.contract_address,
        config.network,
        confirmed.map((r) => r.verification_id),
        confirmed.map((r) => `0x${r.content_hash}`),
      ).catch(() => [] as boolean[]);
      missing = results.length ? results.filter((ok) => !ok).length : 0;
      checks.push({
        key: "events",
        label: "Proof Integrity",
        status: results.length === 0 ? "unknown" : missing === 0 ? "ok" : "fail",
        detail:
          results.length === 0
            ? "Batch check unavailable"
            : `${results.length - missing}/${results.length} proofs match on-chain`,
      });
    }

    checks.push({
      key: "sync",
      label: "Database Sync",
      status:
        onChainCount === null
          ? "unknown"
          : onChainCount === confirmed.length
            ? "ok"
            : "warn",
      detail:
        onChainCount === null
          ? "Run a sync to compare"
          : `${confirmed.length} local · ${onChainCount} on-chain`,
    });

    checks.push({
      key: "pending",
      label: "Pending Registrations",
      status: pending === 0 ? "ok" : "warn",
      detail: pending === 0 ? "None waiting" : `${pending} awaiting confirmation`,
    });

    checks.push({
      key: "failed",
      label: "Failed Transactions",
      status: failed === 0 ? "ok" : "warn",
      detail: failed === 0 ? "None" : `${failed} need re-registration`,
    });

    const gasGwei = await readGasPriceGwei(config?.network);
    checks.push({
      key: "gas",
      label: "Gas Estimation",
      status: gasGwei ? "ok" : "warn",
      detail: gasGwei ? `${gasGwei.toFixed(2)} gwei` : "Fee data unavailable",
    });

    let explorerOk = true;
    try {
      await fetch(network.explorer, { mode: "no-cors", cache: "no-store" });
    } catch {
      explorerOk = false;
    }
    checks.push({
      key: "explorer",
      label: "Explorer Availability",
      status: explorerOk ? "ok" : "warn",
      detail: `${network.explorerName}${explorerOk ? " reachable" : " unreachable"}`,
    });

    setResult({
      checks,
      latestBlock,
      gasGwei,
      onChainCount,
      pending,
      failed,
      missing,
      checkedAt: new Date().toISOString(),
    });
    setRunning(false);
  }, [config, records, walletAddress]);

  return { ...result, running, run };
};

/**
 * Background reconciliation: any record stuck in "pending" is re-checked
 * against the chain and promoted to "confirmed" when the proof is present
 * (recovers interrupted or lost transaction confirmations).
 */
export const useBackgroundSync = (
  config: BlockchainConfig | null | undefined,
  records: BlockchainRecord[],
  onChanged: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled || !config?.contract_address) return;
    const stuck = records.filter((r) => r.status !== "confirmed" && !r.tx_hash);
    if (!stuck.length) return;

    let cancelled = false;
    const reconcile = async () => {
      let changed = false;
      for (const record of stuck) {
        const onChain = await readOnChainRecord(
          config.contract_address!,
          record.network,
          record.verification_id,
        );
        if (cancelled) return;
        if (onChain && onChain.contentHash?.replace(/^0x/, "") === record.content_hash) {
          await supabase
            .from("blockchain_records")
            .update({
              status: "confirmed",
              block_number: onChain.blockNumber || null,
              registered_at: onChain.timestamp
                ? new Date(onChain.timestamp * 1000).toISOString()
                : new Date().toISOString(),
            })
            .eq("id", record.id);
          changed = true;
        }
      }
      if (changed && !cancelled) onChanged();
    };

    void reconcile();
    const timer = setInterval(() => void reconcile(), 90_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, config?.contract_address, config?.network, records.length]);
};
