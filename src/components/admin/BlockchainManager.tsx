import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportAuditCsv, exportAuditPdf, fetchBlockchainAudit } from "@/lib/blockchain/auditExport";

import { logAudit } from "@/lib/audit";
import {
  useBlockchainConfig,
  useBlockchainRecords,
  useInvalidateBlockchain,
  type BlockchainRecord,
} from "@/hooks/useBlockchain";
import {
  useAchievements,
  useCertifications,
  useInternships,
  useProjects,
  useSiteContent,
} from "@/hooks/usePortfolioData";
import { useBackgroundSync, useBlockchainHealth } from "@/hooks/useBlockchainHealth";
import { chainEventLabel, useChainEvents, useVerificationRealtime } from "@/hooks/useChainEvents";
import { useWallet } from "@/lib/blockchain/WalletProvider";
import { buildContentProof, RECORD_TYPE_LABEL, type VerifiableType } from "@/lib/blockchain/content";
import { buildVerificationId, displayVerificationId } from "@/lib/blockchain/hash";
import {
  deployRegistry,
  readContractOwner,
  readOnChainRecord,
  verifyBatchOnChain,
  readLatestBlock,
  readTotalRecords,
  registerOnChain,
  verifyHashOnChain,
} from "@/lib/blockchain/registry";
import {
  addressUrl,
  getNetwork,
  NETWORK_LIST,
  shortHash,
  txUrl,
  DEFAULT_NETWORK_KEY,
} from "@/lib/blockchain/networks";
import VerificationTimeline from "@/components/blockchain/VerificationTimeline";
import CopyButton from "@/components/blockchain/CopyButton";
import WalletConnectButton from "@/components/blockchain/WalletConnectButton";
import { fetchWalletConnectProjectId, saveWalletConnectProjectId } from "@/lib/blockchain/walletconnect";

type Stage = "idle" | "preparing" | "signing" | "pending" | "confirmed";

export interface BatchItem {
  key: string;
  title: string;
  status: "queued" | "running" | "done" | "skipped" | "failed";
  message: string;
}

const BATCH_TONE: Record<BatchItem["status"], string> = {
  queued: "bg-muted-foreground",
  running: "bg-blue-bright",
  done: "bg-emerald-400",
  skipped: "bg-amber-400",
  failed: "bg-red-400",
};

const ProgressList = ({ items }: { items: BatchItem[] }) => (
  <div className="mt-4 space-y-2">
    {items.map((item) => (
      <div
        key={item.key}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-2.5"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${BATCH_TONE[item.status]}`} />
        <p className="text-sm min-w-0 flex-1 truncate">{item.title}</p>
        <p
          className={`text-xs break-words max-w-full sm:max-w-[55%] ${
            item.status === "failed"
              ? "text-red-400"
              : item.status === "done"
                ? "text-emerald-400"
                : "text-muted-foreground"
          }`}
        >
          {item.message}
        </p>
      </div>
    ))}
  </div>
);

const STAGE_LABEL: Record<Stage, string> = {
  idle: "",
  preparing: "Preparing transaction…",
  signing: "Signing transaction…",
  pending: "Waiting for confirmation…",
  confirmed: "Verification complete",
};

const Widget = ({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "good" | "warn" }) => (
  <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">{label}</p>
    <p
      className={`text-base font-display font-bold break-all ${
        tone === "good" ? "text-emerald-400" : tone === "warn" ? "text-amber-400" : "text-foreground"
      }`}
    >
      {value}
    </p>
  </div>
);

const BlockchainManager = () => {
  const { data: config, refetch: refetchConfig } = useBlockchainConfig();
  const { data: records = [] } = useBlockchainRecords();
  const invalidate = useInvalidateBlockchain();

  const certifications = useCertifications();
  const achievements = useAchievements();
  const projects = useProjects();
  const internships = useInternships();
  const hero = useSiteContent("hero");

  const wallet = useWallet();
  const [stage, setStage] = useState<Stage>("idle");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [networkKey, setNetworkKey] = useState<string>(config?.network ?? DEFAULT_NETWORK_KEY);
  const [contractOwner, setContractOwner] = useState<string | null>(null);
  const [wcProjectId, setWcProjectId] = useState("");
  const [savingWc, setSavingWc] = useState(false);
  const [chainCount, setChainCount] = useState<number | null>(null);
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [repairing, setRepairing] = useState(false);
  const [repairItems, setRepairItems] = useState<BatchItem[]>([]);
  const [exportingAudit, setExportingAudit] = useState<"csv" | "pdf" | null>(null);
  const [smokePending, setSmokePending] = useState(false);
  const [smokeRunning, setSmokeRunning] = useState(false);
  const [smokeItems, setSmokeItems] = useState<BatchItem[]>([]);


  const network = getNetwork(config?.network ?? networkKey);
  const resumeUrl = hero.data?.resume_url ?? "";

  const latestByEntity = useMemo(() => {
    const map = new Map<string, BlockchainRecord>();
    records.forEach((record) => {
      const key = `${record.entity_table}:${record.entity_id}`;
      const current = map.get(key);
      if (!current || record.version > current.version) map.set(key, record);
    });
    return map;
  }, [records]);

  const stats = useMemo(() => {
    const confirmed = records.filter((r) => Boolean(r.tx_hash));
    const count = (t: string) => confirmed.filter((r) => r.record_type === t).length;
    const resume = confirmed.filter((r) => r.record_type === "resume").sort((a, b) => b.version - a.version)[0];
    return {
      certificates: count("certificate"),
      achievements: count("achievement"),
      projects: count("project"),
      internships: count("internship"),
      resumeVersion: resume ? `v${resume.version}` : "—",
      pending: records.filter((r) => r.status === "pending" && !r.tx_hash).length,
      failed: records.filter((r) => r.status === "failed").length,
    };
  }, [records]);

  const health = useBlockchainHealth(config, records, wallet.address);
  useBackgroundSync(config, records, invalidate);
  useVerificationRealtime(invalidate);
  const chain = useChainEvents(config, records, invalidate);

  // Lazy, cached RPC read for the latest block — refreshed in the background.
  useEffect(() => {
    let active = true;
    const load = () =>
      void readLatestBlock(config?.network).then((block) => {
        if (active) setLatestBlock(block);
      });
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [config?.network]);

  useEffect(() => {
    void fetchWalletConnectProjectId().then((value) => setWcProjectId(value ?? ""));
  }, []);

  const handleSaveWalletConnect = async () => {
    setSavingWc(true);
    try {
      await saveWalletConnectProjectId(wcProjectId);
      logAudit({ action: "blockchain.walletconnect.configure" });
      toast.success("WalletConnect project ID saved — reload to activate");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save project ID");
    } finally {
      setSavingWc(false);
    }
  };

  const walletOnWrongChain = Boolean(wallet.address && config?.chain_id && wallet.chainId !== config.chain_id);

  // ------------------------------------------------------------------
  // Identity + deployment
  // ------------------------------------------------------------------

  const ensureConfig = async (selectedNetwork: string) => {
    if (config) return config;
    const target = getNetwork(selectedNetwork);
    const portfolioId = `VAMSI-PORTFOLIO-${new Date().getFullYear()}-${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
    const { data, error } = await supabase
      .from("blockchain_config")
      .insert({
        portfolio_id: portfolioId,
        network: target.key,
        chain_id: target.chainId,
        owner_wallet: wallet.address,
      })
      .select()
      .single();
    if (error) throw error;
    await refetchConfig();
    return data as never;
  };

  const handleSwitchNetwork = async (key: string) => {
    setNetworkKey(key);
    try {
      if (wallet.address) await wallet.switchNetwork(key);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Network switch failed");
    }
  };

  const handleDeploy = async () => {
    if (!wallet.address) {
      toast.error("Connect your wallet first");
      return;
    }
    setBusyKey("deploy");
    setStage("preparing");
    try {
      const target = getNetwork(config?.network ?? networkKey);
      await wallet.switchNetwork(target.key);
      const activeConfig = await ensureConfig(target.key);
      const signer = await wallet.getSigner();

      setStage("signing");
      const { address, txHash } = await deployRegistry(signer, activeConfig.portfolio_id);
      setStage("pending");

      const { error } = await supabase
        .from("blockchain_config")
        .update({
          contract_address: address,
          deployment_tx: txHash,
          deployed_at: new Date().toISOString(),
          owner_wallet: wallet.address,
          network: target.key,
          chain_id: target.chainId,
        })
        .eq("id", activeConfig.id);
      if (error) throw error;

      setStage("confirmed");
      logAudit({ action: "blockchain.contract.deploy", entity_id: address, details: { network: target.key, txHash } });
      invalidate();
      await refetchConfig();
      toast.success("Registry contract deployed");
    } catch (error) {
      setStage("idle");
      logAudit({ action: "blockchain.contract.deploy", status: "failed" });
      toast.error(error instanceof Error ? error.message.slice(0, 180) : "Deployment failed");
    } finally {
      setBusyKey(null);
      setTimeout(() => setStage("idle"), 2500);
    }
  };

  // ------------------------------------------------------------------
  // Registration
  // ------------------------------------------------------------------

  /** Core registration routine — returns a structured result instead of toasting. */
  const performRegistration = async (
    type: VerifiableType,
    entityTable: string,
    entity: Record<string, unknown>,
    title: string,
  ): Promise<{ status: BatchItem["status"]; message: string }> => {
    if (!config?.contract_address) return { status: "failed", message: "No registry contract deployed" };
    if (!wallet.address) return { status: "failed", message: "Wallet not connected" };

    const entityId = String(entity.id ?? entity.entity_id ?? "");
    setStage("preparing");

    let insertedId: string | null = null;
    try {
      const key = `${entityTable}:${entityId}`;
      await wallet.switchNetwork(config.network);
      const proof = await buildContentProof(type, entity);
      const previous = latestByEntity.get(key);
      const version = (previous?.version ?? 0) + 1;

      if (previous?.content_hash === proof.hash && previous.tx_hash) {
        setStage("idle");
        return { status: "skipped", message: "Content unchanged — already anchored on-chain" };
      }

      const verificationId = buildVerificationId(type, entityId, version);
      const metadata = JSON.stringify({ type, title, version, source: proof.source });

      const { data: inserted, error: insertError } = await supabase
        .from("blockchain_records")
        .insert({
          record_type: type,
          entity_table: entityTable,
          entity_id: entityId,
          title,
          verification_id: verificationId,
          content_hash: proof.hash,
          version,
          metadata: { source: proof.source, label: proof.label },
          network: config.network,
          chain_id: config.chain_id,
          contract_address: config.contract_address,
          owner_wallet: wallet.address,
          status: "pending",
        })
        .select()
        .single();
      if (insertError) throw insertError;
      insertedId = (inserted as { id: string }).id;
      invalidate();

      const signer = await wallet.getSigner();
      const { txHash, blockNumber } = await registerOnChain(
        config.contract_address,
        signer,
        { recordType: type, verificationId, contentHash: `0x${proof.hash}`, version, metadata },
        (next) => setStage(next),
      );

      const { error: updateError } = await supabase
        .from("blockchain_records")
        .update({
          tx_hash: txHash,
          block_number: blockNumber,
          status: "confirmed",
          registered_at: new Date().toISOString(),
        })
        .eq("id", insertedId);
      if (updateError) throw updateError;

      logAudit({
        action: `blockchain.register.${type}`,
        entity: entityTable,
        entity_id: entityId,
        details: { verificationId, txHash, version },
      });
      invalidate();
      return { status: "done", message: `${displayVerificationId(verificationId)} · v${version}` };
    } catch (error) {
      if (insertedId) {
        await supabase.from("blockchain_records").update({ status: "failed" }).eq("id", insertedId);
        invalidate();
      }
      setStage("idle");
      logAudit({ action: `blockchain.register.${type}`, status: "failed", entity: entityTable });
      return {
        status: "failed",
        message: error instanceof Error ? error.message.slice(0, 200) : "Registration failed",
      };
    } finally {
      setTimeout(() => setStage("idle"), 2500);
    }
  };

  /** Single-row registration (existing per-item buttons). */
  const register = async (
    type: VerifiableType,
    entityTable: string,
    entity: Record<string, unknown>,
    title: string,
  ) => {
    const entityId = String(entity.id ?? entity.entity_id ?? "");
    setBusyKey(`${entityTable}:${entityId}`);
    const result = await performRegistration(type, entityTable, entity, title);
    setBusyKey(null);
    if (result.status === "done") toast.success(`${RECORD_TYPE_LABEL[type]} verified on-chain`);
    else if (result.status === "skipped") toast.info(result.message);
    else toast.error(result.message);
  };

  // ------------------------------------------------------------------
  // Batch registration
  // ------------------------------------------------------------------

  const toggleSelected = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleBatchRegister = async () => {
    if (!config?.contract_address) {
      toast.error("Deploy the registry contract first");
      return;
    }
    if (!wallet.address) {
      toast.error("Connect your wallet first");
      return;
    }
    const queue = rows.filter((row) => selected.has(row.key));
    if (!queue.length) {
      toast.error("Select at least one record");
      return;
    }

    setBatchRunning(true);
    setBatchItems(queue.map((row) => ({ key: row.key, title: row.title || "Untitled", status: "queued", message: "Waiting" })));

    let done = 0;
    let failed = 0;
    let skipped = 0;

    for (const row of queue) {
      setBatchItems((prev) =>
        prev.map((item) =>
          item.key === row.key ? { ...item, status: "running", message: "Signing & confirming…" } : item,
        ),
      );
      const result = await performRegistration(row.type, row.table, row.entity, row.title);
      if (result.status === "done") done += 1;
      else if (result.status === "skipped") skipped += 1;
      else failed += 1;
      setBatchItems((prev) =>
        prev.map((item) => (item.key === row.key ? { ...item, ...result } : item)),
      );
    }

    logAudit({ action: "blockchain.batch_register", details: { total: queue.length, done, skipped, failed } });
    setBatchRunning(false);
    setSelected(new Set());
    invalidate();
    if (failed) toast.error(`${done} registered · ${skipped} skipped · ${failed} failed`);
    else toast.success(`${done} registered · ${skipped} skipped`);
  };

  // ------------------------------------------------------------------
  // Audit log export
  // ------------------------------------------------------------------

  const handleExportAudit = async (kind: "csv" | "pdf") => {
    setExportingAudit(kind);
    try {
      const rowsOut = await fetchBlockchainAudit();
      if (!rowsOut.length) {
        toast.info("No blockchain audit entries recorded yet");
        return;
      }
      if (kind === "csv") exportAuditCsv(rowsOut);
      else exportAuditPdf(rowsOut);
      logAudit({ action: "blockchain.audit.export", details: { format: kind, entries: rowsOut.length } });
      toast.success(`Audit log exported (${rowsOut.length} entries)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not export the audit log");
    } finally {
      setExportingAudit(null);
    }
  };

  // ------------------------------------------------------------------
  // Deploy + smoke test workflow
  // ------------------------------------------------------------------

  /** Registers a minimal set of records and waits for live on-chain confirmation. */
  const runSmokeTest = async () => {
    if (!config?.contract_address) {
      toast.error("No registry contract deployed yet");
      return;
    }
    setSmokeRunning(true);
    const queue = [
      rows.find((row) => row.type === "ownership"),
      rows.find((row) => row.type !== "ownership"),
    ].filter(Boolean) as typeof rows;

    if (!queue.length) {
      setSmokeRunning(false);
      toast.error("Nothing available to smoke-test");
      return;
    }

    setSmokeItems([
      ...queue.map((row) => ({
        key: row.key,
        title: `Register · ${row.title || "Untitled"}`,
        status: "queued" as BatchItem["status"],
        message: "Waiting",
      })),
      { key: "events", title: "Live event confirmation", status: "queued", message: "Waiting" },
    ]);

    const registered: string[] = [];
    let failures = 0;

    for (const row of queue) {
      setSmokeItems((prev) =>
        prev.map((item) =>
          item.key === row.key ? { ...item, status: "running", message: "Signing & confirming…" } : item,
        ),
      );
      const result = await performRegistration(row.type, row.table, row.entity, row.title);
      if (result.status === "failed") failures += 1;
      else registered.push(row.key);
      setSmokeItems((prev) => prev.map((item) => (item.key === row.key ? { ...item, ...result } : item)));
    }

    // Confirm the registry actually emitted and stored the proofs.
    setSmokeItems((prev) =>
      prev.map((item) =>
        item.key === "events" ? { ...item, status: "running", message: "Reading contract events…" } : item,
      ),
    );
    await chain.refresh();
    const total = await readTotalRecords(config.contract_address, config.network);
    const confirmedEvents = chain.events.filter(
      (event) => event.name === "RecordRegistered" || event.name === "VerificationPerformed",
    ).length;

    const ok = failures === 0 && (total ?? 0) > 0;
    setSmokeItems((prev) =>
      prev.map((item) =>
        item.key === "events"
          ? {
              ...item,
              status: ok ? "done" : "failed",
              message: ok
                ? `${total} record(s) on-chain · ${confirmedEvents} event(s) observed`
                : "Could not confirm the registrations on-chain",
            }
          : item,
      ),
    );

    logAudit({
      action: "blockchain.smoke_test",
      status: ok ? "success" : "failed",
      details: { registered: registered.length, failures, onChainRecords: total },
    });
    setSmokeRunning(false);
    invalidate();
    if (ok) toast.success("Smoke test passed — proofs are live on-chain");
    else toast.error("Smoke test failed — check the item details");
  };

  const handleDeployAndSmokeTest = async () => {
    if (config?.contract_address) {
      await runSmokeTest();
      return;
    }
    setSmokePending(true);
    await handleDeploy();
  };

  // Once the freshly deployed contract lands in config, run the smoke test.
  useEffect(() => {
    if (!smokePending || !config?.contract_address || smokeRunning) return;
    setSmokePending(false);
    void runSmokeTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smokePending, config?.contract_address]);

  // ------------------------------------------------------------------
  // Repair / retry workflow
  // ------------------------------------------------------------------



  const handleRepair = async () => {
    if (!config?.contract_address) {
      toast.error("No contract deployed yet");
      return;
    }
    setRepairing(true);
    setRepairItems([]);
    try {
      const stuck = records.filter((r) => r.status !== "confirmed" || !r.tx_hash);
      const confirmed = records.filter((r) => r.status === "confirmed" && r.tx_hash);
      const batch = confirmed.length
        ? await verifyBatchOnChain(
            config.contract_address,
            config.network,
            confirmed.map((r) => r.verification_id),
            confirmed.map((r) => `0x${r.content_hash}`),
          ).catch(() => [] as boolean[])
        : [];
      const broken = confirmed.filter((_, i) => batch.length > i && !batch[i]);
      const targets = [...stuck, ...broken];

      if (!targets.length) {
        setRepairItems([]);
        toast.success("No missing or failed sync items — everything is in order");
        logAudit({ action: "blockchain.repair.scan", details: { issues: 0 } });
        return;
      }

      setRepairItems(
        targets.map((r) => ({
          key: r.id,
          title: `${RECORD_TYPE_LABEL[r.record_type as VerifiableType]} · ${r.title}`,
          status: "running",
          message: "Re-checking chain…",
        })),
      );

      let healed = 0;
      let retried = 0;
      let unresolved = 0;

      for (const record of targets) {
        const onChain = await readOnChainRecord(
          config.contract_address,
          record.network,
          record.verification_id,
        );
        const matches = onChain?.contentHash?.replace(/^0x/, "") === record.content_hash;

        if (onChain && matches) {
          await supabase
            .from("blockchain_records")
            .update({
              status: "confirmed",
              block_number: onChain.blockNumber || record.block_number,
              registered_at: onChain.timestamp
                ? new Date(onChain.timestamp * 1000).toISOString()
                : record.registered_at ?? new Date().toISOString(),
            })
            .eq("id", record.id);
          healed += 1;
          setRepairItems((prev) =>
            prev.map((item) =>
              item.key === record.id
                ? { ...item, status: "done", message: "Found on-chain — status repaired" }
                : item,
            ),
          );
          continue;
        }

        const row = rows.find(
          (candidate) => candidate.table === record.entity_table &&
            String(candidate.entity.id ?? "") === String(record.entity_id ?? ""),
        );

        if (!row || !wallet.address) {
          unresolved += 1;
          setRepairItems((prev) =>
            prev.map((item) =>
              item.key === record.id
                ? {
                    ...item,
                    status: "failed",
                    message: !wallet.address
                      ? "Not on-chain — connect your wallet to re-register"
                      : "Not on-chain and the source content no longer exists",
                  }
                : item,
            ),
          );
          continue;
        }

        const result = await performRegistration(row.type, row.table, row.entity, row.title);
        if (result.status === "failed") unresolved += 1;
        else retried += 1;
        setRepairItems((prev) =>
          prev.map((item) =>
            item.key === record.id
              ? {
                  ...item,
                  status: result.status,
                  message: result.status === "failed" ? result.message : `Re-registered · ${result.message}`,
                }
              : item,
          ),
        );
      }

      logAudit({
        action: "blockchain.repair.run",
        details: { scanned: records.length, issues: targets.length, healed, retried, unresolved },
      });
      invalidate();
      await refetchConfig();
      if (unresolved) toast.error(`${healed} repaired · ${retried} re-registered · ${unresolved} unresolved`);
      else toast.success(`${healed} repaired · ${retried} re-registered`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message.slice(0, 180) : "Repair failed");
    } finally {
      setRepairing(false);
    }
  };

  // ------------------------------------------------------------------
  // Sync + verify
  // ------------------------------------------------------------------

  const handleSync = async () => {
    if (!config?.contract_address) {
      toast.error("No contract deployed yet");
      return;
    }
    setBusyKey("sync");
    try {
      const [owner, total] = await Promise.all([
        readContractOwner(config.contract_address, config.network),
        readTotalRecords(config.contract_address, config.network),
      ]);
      setContractOwner(owner);
      setChainCount(total);
      await supabase
        .from("blockchain_config")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", config.id);
      logAudit({ action: "blockchain.sync", details: { total } });
      invalidate();
      await refetchConfig();
      toast.success(`Synced · ${total ?? 0} on-chain record(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sync failed");
    } finally {
      setBusyKey(null);
    }
  };

  const handleVerifyAll = async () => {
    if (!config?.contract_address) {
      toast.error("No contract deployed yet");
      return;
    }
    setBusyKey("verify");
    try {
      const confirmed = records.filter((r) => r.tx_hash);
      let ok = 0;
      for (const record of confirmed) {
        const valid = await verifyHashOnChain(
          config.contract_address,
          record.network,
          record.verification_id,
          `0x${record.content_hash}`,
        );
        if (valid) ok += 1;
      }
      logAudit({ action: "blockchain.verify_all", details: { checked: confirmed.length, valid: ok } });
      toast.success(`${ok}/${confirmed.length} records match their on-chain proof`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setBusyKey(null);
    }
  };

  // ------------------------------------------------------------------
  // Registerable rows
  // ------------------------------------------------------------------

  const rows: {
    key: string;
    type: VerifiableType;
    table: string;
    title: string;
    subtitle: string;
    entity: Record<string, unknown>;
  }[] = [
    ...(certifications.data ?? []).map((c: Record<string, unknown>) => ({
      key: `certifications:${c.id}`,
      type: "certificate" as VerifiableType,
      table: "certifications",
      title: String(c.title ?? ""),
      subtitle: String(c.issuer ?? ""),
      entity: c,
    })),
    ...(achievements.data ?? []).map((a: Record<string, unknown>) => ({
      key: `achievements:${a.id}`,
      type: "achievement" as VerifiableType,
      table: "achievements",
      title: String(a.title ?? ""),
      subtitle: String(a.label ?? ""),
      entity: a,
    })),
    ...(projects.data ?? []).map((p: Record<string, unknown>) => ({
      key: `projects:${p.id}`,
      type: "project" as VerifiableType,
      table: "projects",
      title: String(p.title ?? ""),
      subtitle: String(p.team ?? "Project"),
      entity: p,
    })),
    ...(internships.data ?? []).map((n: Record<string, unknown>) => ({
      key: `internships:${n.id}`,
      type: "internship" as VerifiableType,
      table: "internships",
      title: `${String(n.role ?? "")} — ${String(n.company ?? "")}`,
      subtitle: String(n.duration ?? "Internship"),
      entity: n,
    })),
    ...(config
      ? [
          {
            key: `blockchain_config:${config.id}`,
            type: "ownership" as VerifiableType,
            table: "blockchain_config",
            title: "Portfolio Ownership",
            subtitle: config.portfolio_id,
            entity: {
              id: config.id,
              portfolio_id: config.portfolio_id,
              owner: "Bollepalli Vamsi",
              owner_wallet: config.owner_wallet,
              network: config.network,
            } as Record<string, unknown>,
          },
        ]
      : []),
    ...(resumeUrl
      ? [
          {
            key: "site_content:resume",
            type: "resume" as VerifiableType,
            table: "site_content",
            title: "Resume",
            subtitle: "hero.resume_url",
            entity: { id: "resume", url: resumeUrl },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Status widgets */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold mb-1">Blockchain Manager</h2>
            <p className="text-muted-foreground text-sm">
              Anchor portfolio proofs to Polygon. Files stay in storage — only hashes go on-chain.
            </p>
          </div>
          <AnimatePresence>
            {stage !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-3 rounded-xl border border-blue-primary/30 bg-blue-primary/10 px-4 py-2 text-sm text-blue-bright"
              >
                {stage === "confirmed" ? (
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ) : (
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  />
                )}
                {STAGE_LABEL[stage]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Widget label="Certificates Verified" value={stats.certificates} />
          <Widget label="Achievements Verified" value={stats.achievements} />
          <Widget label="Projects Registered" value={stats.projects} />
          <Widget label="Internships Verified" value={stats.internships} />
          <Widget label="Resume Version" value={stats.resumeVersion} />
          <Widget label="Latest Block" value={latestBlock ? latestBlock.toLocaleString() : "—"} />
          <Widget label="Pending Registrations" value={stats.pending} tone={stats.pending ? "warn" : "default"} />
          <Widget label="Failed Transactions" value={stats.failed} tone={stats.failed ? "warn" : "default"} />
          <Widget
            label="Contract Status"
            value={config?.contract_address ? "Live" : "Not deployed"}
            tone={config?.contract_address ? "good" : "warn"}
          />
          <Widget
            label="Wallet Status"
            value={wallet.address ? shortHash(wallet.address) : wallet.isAvailable ? "Disconnected" : "No wallet"}
            tone={wallet.address ? "good" : "warn"}
          />
          <Widget label="Network" value={network.name} />
          <Widget
            label="Last Sync"
            value={config?.last_sync_at ? new Date(config.last_sync_at).toLocaleString() : "Never"}
          />
        </div>

        {/* Wallet + contract controls */}
        <div className="flex flex-wrap items-center gap-3">
          <WalletConnectButton
            networkKey={config?.network ?? networkKey}
            onConnected={(account, kind) => {
              logAudit({ action: "blockchain.wallet.connect", details: { address: account, connector: kind } });
              if (config?.owner_wallet && config.owner_wallet.toLowerCase() !== account.toLowerCase()) {
                toast.warning("Connected wallet differs from the registry owner wallet.");
              }
            }}
            onDisconnected={() => logAudit({ action: "blockchain.wallet.disconnect" })}
          />

          <select
            value={config?.network ?? networkKey}
            onChange={(e) => handleSwitchNetwork(e.target.value)}
            disabled={Boolean(config?.contract_address)}
            className="px-4 py-2.5 rounded-xl text-sm bg-secondary/40 border border-border/50 disabled:opacity-60"
          >
            {NETWORK_LIST.map((n) => (
              <option key={n.key} value={n.key}>
                {n.name}
              </option>
            ))}
          </select>

          {!config?.contract_address && (
            <motion.button
              onClick={handleDeploy}
              disabled={busyKey === "deploy"}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border border-blue-primary/30 bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 transition-colors disabled:opacity-60"
            >
              {busyKey === "deploy" ? "Deploying…" : "Deploy Contract"}
            </motion.button>
          )}

          <motion.button
            onClick={handleSync}
            disabled={busyKey === "sync"}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {busyKey === "sync" ? "Syncing…" : "Sync Records"}
          </motion.button>

          <motion.button
            onClick={handleVerifyAll}
            disabled={busyKey === "verify"}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {busyKey === "verify" ? "Verifying…" : "Verify Records"}
          </motion.button>

          <motion.button
            onClick={handleRepair}
            disabled={repairing}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 transition-colors disabled:opacity-60"
          >
            {repairing ? "Repairing…" : "Scan & Repair Sync"}
          </motion.button>
        </div>

        {repairItems.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Repair Results
            </p>
            <ProgressList items={repairItems} />
          </div>
        )}

        {!wallet.isAvailable && (
          <p className="mt-4 text-xs text-amber-400">
            No browser wallet found. Use WalletConnect to sign from any mobile wallet (Trust, Rainbow,
            MetaMask Mobile, Ledger Live…).
          </p>
        )}

        <div className="mt-5 rounded-xl border border-border/40 bg-secondary/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
            WalletConnect Project ID
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              value={wcProjectId}
              onChange={(e) => setWcProjectId(e.target.value)}
              placeholder="Project ID from cloud.reown.com"
              className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl text-sm bg-secondary/40 border border-border/50 font-mono"
            />
            <motion.button
              onClick={handleSaveWalletConnect}
              disabled={savingWc || !wcProjectId.trim()}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border border-blue-primary/30 bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 transition-colors disabled:opacity-60"
            >
              {savingWc ? "Saving…" : "Save"}
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Required once to enable mobile WalletConnect sessions. Verification stays wallet-free for visitors.
          </p>
        </div>
        {walletOnWrongChain && (
          <p className="mt-4 text-xs text-amber-400">
            Connected wallet is on chain {wallet.chainId}. It will be switched to {network.name}
            automatically before signing.
          </p>
        )}

        {config && (
          <div className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground">
            <p>
              Portfolio ID: <span className="font-mono text-foreground">{config.portfolio_id}</span>{" "}
              <CopyButton value={config.portfolio_id} label="Copy ID" />
            </p>
            <p>
              Contract:{" "}
              {config.contract_address ? (
                <a
                  className="text-blue-bright hover:underline font-mono"
                  href={addressUrl(config.network, config.contract_address)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {shortHash(config.contract_address, 8)}
                </a>
              ) : (
                "—"
              )}{" "}
              <CopyButton value={config.contract_address} label="Copy" />
            </p>
            <p>
              On-chain owner:{" "}
              <span className="font-mono text-foreground">{contractOwner ? shortHash(contractOwner, 8) : "run sync"}</span>
            </p>
            <p>
              On-chain records:{" "}
              <span className="font-mono text-foreground">{chainCount ?? "run sync"}</span>
            </p>
          </div>
        )}
      </div>

      {/* Blockchain health */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-display font-bold mb-1">Blockchain Health</h3>
            <p className="text-muted-foreground text-sm">
              {health.checkedAt
                ? `Last checked ${new Date(health.checkedAt).toLocaleTimeString()}`
                : "Run a diagnostic to check RPC, contract, sync and gas conditions."}
            </p>
          </div>
          <motion.button
            onClick={() => void health.run()}
            disabled={health.running}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {health.running ? "Checking…" : "Run Health Check"}
          </motion.button>
        </div>

        {health.checks.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-2">
            {health.checks.map((check) => (
              <div
                key={check.key}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-3"
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    check.status === "ok"
                      ? "bg-emerald-400"
                      : check.status === "warn"
                        ? "bg-amber-400"
                        : check.status === "fail"
                          ? "bg-red-400"
                          : "bg-muted-foreground"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{check.label}</p>
                  <p className="text-xs text-muted-foreground break-words">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registerable content */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-display font-bold mb-1">Register Records</h3>
            <p className="text-muted-foreground text-sm">
              Registering an edited item creates a new version with a fresh proof. Unchanged items are skipped.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSelected((prev) => (prev.size === rows.length ? new Set() : new Set(rows.map((r) => r.key))))
              }
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
            >
              {selected.size === rows.length && rows.length ? "Clear selection" : "Select all"}
            </button>
            <motion.button
              onClick={handleBatchRegister}
              disabled={batchRunning || !selected.size || !config?.contract_address}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-blue-primary/30 bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 transition-colors disabled:opacity-50"
            >
              {batchRunning ? "Registering batch…" : `Register Selected (${selected.size})`}
            </motion.button>
          </div>
        </div>

        {batchItems.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Batch Progress ·{" "}
              {batchItems.filter((i) => i.status === "done" || i.status === "skipped").length}/
              {batchItems.length} complete
            </p>
            <ProgressList items={batchItems} />
          </div>
        )}

        <div className="space-y-2">
          {rows.map((row) => {
            const record = latestByEntity.get(row.key);
            const isBusy = busyKey === row.key;
            return (
              <div
                key={row.key}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={selected.has(row.key)}
                  onChange={() => toggleSelected(row.key)}
                  aria-label={`Select ${row.title || "record"} for batch registration`}
                  className="w-4 h-4 shrink-0 accent-blue-bright bg-secondary/40 rounded"
                />
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground w-24 shrink-0">
                  {RECORD_TYPE_LABEL[row.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{row.title || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground truncate">{row.subtitle}</p>
                </div>
                {record?.tx_hash ? (
                  <span className="text-xs text-emerald-400 font-mono">
                    v{record.version} · {displayVerificationId(record.verification_id)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">not registered</span>
                )}
                {record?.tx_hash && (
                  <a
                    href={txUrl(record.network, record.tx_hash)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-blue-bright hover:underline"
                  >
                    View Tx ↗
                  </a>
                )}
                {record?.tx_hash && (
                  <div className="flex items-center gap-1.5">
                    <CopyButton value={record.tx_hash} label="Copy Tx" />
                    <CopyButton value={record.verification_id} label="Copy ID" />
                  </div>
                )}
                <motion.button
                  onClick={() => register(row.type, row.table, row.entity, row.title)}
                  disabled={Boolean(busyKey) || !config?.contract_address}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-blue-primary/30 bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 transition-colors disabled:opacity-50"
                >
                  {isBusy ? "Working…" : record?.tx_hash ? "Re-register" : "Register"}
                </motion.button>
              </div>
            );
          })}
          {!rows.length && (
            <p className="text-sm text-muted-foreground">Nothing to register yet.</p>
          )}
        </div>
      </div>

      {/* Live chain events */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-display font-bold mb-1">Live Chain Events</h3>
            <p className="text-muted-foreground text-sm">
              Streaming <span className="font-mono">RecordRegistered</span> and{" "}
              <span className="font-mono">VerificationPerformed</span> events
              {chain.lastBlock ? ` · head block ${chain.lastBlock.toLocaleString()}` : ""}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void chain.refresh()}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
          >
            Refresh now
          </button>
        </div>
        {chain.events.length ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {chain.events.map((event) => (
              <div
                key={`${event.txHash}-${event.logIndex}`}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-2.5"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    event.valid === false ? "bg-red-400" : "bg-emerald-400"
                  }`}
                />
                <p className="text-sm min-w-0 flex-1 truncate">{chainEventLabel(event.name)}</p>
                <span className="text-xs text-muted-foreground font-mono">
                  {event.verificationId ? displayVerificationId(event.verificationId) : "—"}
                </span>
                <span className="text-xs text-muted-foreground">#{event.blockNumber.toLocaleString()}</span>
                <a
                  href={txUrl(config?.network, event.txHash)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-blue-bright hover:underline"
                >
                  Tx ↗
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {config?.contract_address
              ? "No contract events in the recent block window yet."
              : "Deploy the registry contract to start streaming events."}
          </p>
        )}
      </div>

      {/* Logs */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-display font-bold mb-5">Blockchain Logs</h3>
        <div className="max-h-[420px] overflow-y-auto pr-1">
          <VerificationTimeline records={records} />
        </div>
      </div>
    </div>
  );
};

export default BlockchainManager;
