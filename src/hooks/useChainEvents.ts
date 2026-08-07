import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BlockchainConfig, BlockchainRecord } from "@/hooks/useBlockchain";
import {
  readLatestBlock,
  readOnChainRecord,
  readRegistryEvents,
  type RegistryEvent,
} from "@/lib/blockchain/registry";

/**
 * Live database sync: any insert/update on the verification tables is pushed
 * over the realtime socket, so verification statuses refresh immediately in
 * every open tab (public cards, verify page and the admin dashboard).
 */
export const useVerificationRealtime = (onChanged: () => void) => {
  const handler = useRef(onChanged);
  handler.current = onChanged;

  useEffect(() => {
    const channel = supabase
      .channel("verification-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "blockchain_records" }, () =>
        handler.current(),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "blockchain_config" }, () =>
        handler.current(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
};

const EVENT_LABEL: Record<string, string> = {
  RecordRegistered: "Record registered on-chain",
  RecordUpdated: "Metadata updated",
  CertificateRegistered: "Certificate proof anchored",
  ResumeRegistered: "Resume proof anchored",
  AchievementRegistered: "Achievement proof anchored",
  InternshipRegistered: "Internship proof anchored",
  ProjectVersionCreated: "Project version created",
  OwnershipRecorded: "Portfolio ownership recorded",
  VerificationPerformed: "Verification performed",
};

export const chainEventLabel = (name: string) => EVENT_LABEL[name] ?? name;

/**
 * Contract event feed. Public Polygon RPCs have no dependable websocket, so the
 * registry logs are polled in a tight window and any `RecordRegistered` /
 * `VerificationPerformed` event immediately promotes the matching database row
 * and refreshes the UI — no manual sync required.
 */
export const useChainEvents = (
  config: BlockchainConfig | null | undefined,
  records: BlockchainRecord[],
  onChanged: () => void,
  intervalMs = 15_000,
) => {
  const [events, setEvents] = useState<RegistryEvent[]>([]);
  const [lastBlock, setLastBlock] = useState<number | null>(null);
  const cursor = useRef<number | null>(null);
  const recordsRef = useRef(records);
  const changed = useRef(onChanged);
  recordsRef.current = records;
  changed.current = onChanged;

  const address = config?.contract_address ?? null;
  const network = config?.network ?? null;

  const poll = useCallback(async () => {
    if (!address) return;
    const head = await readLatestBlock(network);
    if (!head) return;
    setLastBlock(head);

    // First pass looks back a short window; later passes only read new blocks.
    const from = cursor.current === null ? Math.max(0, head - 5_000) : cursor.current + 1;
    if (from > head) return;

    const fresh = await readRegistryEvents(address, network, from, head);
    cursor.current = head;
    if (!fresh.length) return;

    setEvents((prev) =>
      [...fresh, ...prev]
        .filter(
          (event, index, all) =>
            all.findIndex((o) => o.txHash === event.txHash && o.logIndex === event.logIndex) === index,
        )
        .sort((a, b) => b.blockNumber - a.blockNumber || b.logIndex - a.logIndex)
        .slice(0, 40),
    );

    // Promote any local row that the chain now proves, using the event payload.
    const ids = new Set(
      fresh
        .filter((event) => event.name === "RecordRegistered" || event.name === "VerificationPerformed")
        .map((event) => (event.verificationId ?? "").toLowerCase()),
    );
    const touched = recordsRef.current.filter(
      (record) => ids.has(record.verification_id.toLowerCase()) && record.status !== "confirmed",
    );
    let promoted = false;
    for (const record of touched) {
      const onChain = await readOnChainRecord(address, record.network, record.verification_id);
      if (!onChain || onChain.contentHash?.replace(/^0x/, "") !== record.content_hash) continue;
      const event = fresh.find(
        (e) => (e.verificationId ?? "").toLowerCase() === record.verification_id.toLowerCase(),
      );
      await supabase
        .from("blockchain_records")
        .update({
          status: "confirmed",
          tx_hash: record.tx_hash ?? event?.txHash ?? null,
          block_number: onChain.blockNumber || event?.blockNumber || null,
          registered_at: onChain.timestamp
            ? new Date(onChain.timestamp * 1000).toISOString()
            : new Date().toISOString(),
        })
        .eq("id", record.id);
      promoted = true;
    }
    if (promoted || fresh.length) changed.current();
  }, [address, network]);

  useEffect(() => {
    if (!address) return;
    cursor.current = null;
    void poll();
    const timer = setInterval(() => void poll(), intervalMs);
    return () => clearInterval(timer);
  }, [address, poll, intervalMs]);

  return { events, lastBlock, refresh: poll };
};
