import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlockchainConfig {
  id: string;
  portfolio_id: string;
  owner_wallet: string | null;
  network: string;
  chain_id: number;
  contract_address: string | null;
  deployment_tx: string | null;
  deployed_at: string | null;
  last_sync_at: string | null;
  is_active: boolean;
}

export interface BlockchainRecord {
  id: string;
  record_type: "certificate" | "resume" | "achievement" | "project";
  entity_table: string | null;
  entity_id: string | null;
  title: string;
  verification_id: string;
  content_hash: string;
  version: number;
  metadata: Record<string, unknown>;
  network: string;
  chain_id: number;
  contract_address: string | null;
  tx_hash: string | null;
  block_number: number | null;
  owner_wallet: string | null;
  status: string;
  registered_at: string | null;
  created_at: string;
}

export const useBlockchainConfig = () =>
  useQuery({
    queryKey: ["blockchain_config"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blockchain_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as BlockchainConfig | null) ?? null;
    },
  });

export const useBlockchainRecords = () =>
  useQuery({
    queryKey: ["blockchain_records"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blockchain_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as BlockchainRecord[]) ?? [];
    },
  });

/** Latest confirmed record per entity, keyed as `${table}:${id}`. */
export const useRecordIndex = () => {
  const query = useBlockchainRecords();
  const index = new Map<string, BlockchainRecord>();
  (query.data ?? []).forEach((record) => {
    if (!record.entity_table || !record.entity_id) return;
    const key = `${record.entity_table}:${record.entity_id}`;
    const current = index.get(key);
    if (!current || record.version > current.version) index.set(key, record);
  });
  return { ...query, index };
};

/** Full version history for one entity, newest first. */
export const useRecordHistory = (entityTable: string, entityId?: string | null) => {
  const query = useBlockchainRecords();
  const history = (query.data ?? [])
    .filter((r) => r.entity_table === entityTable && r.entity_id === entityId)
    .sort((a, b) => b.version - a.version);
  return { ...query, history };
};

export const useVerificationRecord = (verificationId?: string) =>
  useQuery({
    queryKey: ["blockchain_record", verificationId],
    enabled: Boolean(verificationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blockchain_records")
        .select("*")
        .eq("verification_id", verificationId!)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as BlockchainRecord | null) ?? null;
    },
  });

export const useInvalidateBlockchain = () => {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["blockchain_records"] });
    void queryClient.invalidateQueries({ queryKey: ["blockchain_config"] });
  };
};
