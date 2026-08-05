import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  useProjects,
  useSiteContent,
} from "@/hooks/usePortfolioData";
import { useWallet } from "@/lib/blockchain/WalletProvider";
import { buildContentProof, RECORD_TYPE_LABEL, type VerifiableType } from "@/lib/blockchain/content";
import { buildVerificationId, displayVerificationId } from "@/lib/blockchain/hash";
import {
  deployRegistry,
  readContractOwner,
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
import WalletConnectButton from "@/components/blockchain/WalletConnectButton";
import { fetchWalletConnectProjectId, saveWalletConnectProjectId } from "@/lib/blockchain/walletconnect";

type Stage = "idle" | "preparing" | "signing" | "pending" | "confirmed";

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
  const hero = useSiteContent("hero");

  const wallet = useWallet();
  const [stage, setStage] = useState<Stage>("idle");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [networkKey, setNetworkKey] = useState<string>(config?.network ?? DEFAULT_NETWORK_KEY);
  const [contractOwner, setContractOwner] = useState<string | null>(null);
  const [wcProjectId, setWcProjectId] = useState("");
  const [savingWc, setSavingWc] = useState(false);
  const [chainCount, setChainCount] = useState<number | null>(null);

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
      resumeVersion: resume ? `v${resume.version}` : "—",
    };
  }, [records]);

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

  const register = async (
    type: VerifiableType,
    entityTable: string,
    entity: Record<string, unknown>,
    title: string,
  ) => {
    if (!config?.contract_address) {
      toast.error("Deploy the registry contract first");
      return;
    }
    if (!wallet.address) {
      toast.error("Connect your wallet first");
      return;
    }
    const entityId = String(entity.id ?? entity.entity_id ?? "");
    const key = `${entityTable}:${entityId}`;
    setBusyKey(key);
    setStage("preparing");

    let insertedId: string | null = null;
    try {
      await wallet.switchNetwork(config.network);
      const proof = await buildContentProof(type, entity);
      const previous = latestByEntity.get(key);
      const version = (previous?.version ?? 0) + 1;

      if (previous?.content_hash === proof.hash && previous.tx_hash) {
        setStage("idle");
        setBusyKey(null);
        toast.info("Content unchanged — already registered on-chain");
        return;
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
      toast.success(`${RECORD_TYPE_LABEL[type]} verified on-chain`);
    } catch (error) {
      if (insertedId) {
        await supabase.from("blockchain_records").update({ status: "failed" }).eq("id", insertedId);
        invalidate();
      }
      setStage("idle");
      logAudit({ action: `blockchain.register.${type}`, status: "failed", entity: entityTable });
      toast.error(error instanceof Error ? error.message.slice(0, 180) : "Registration failed");
    } finally {
      setBusyKey(null);
      setTimeout(() => setStage("idle"), 2500);
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
          <Widget label="Resume Version" value={stats.resumeVersion} />
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
        </div>

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
              Portfolio ID: <span className="font-mono text-foreground">{config.portfolio_id}</span>
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
              )}
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

      {/* Registerable content */}
      <div className="cinema-card rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-display font-bold mb-1">Register Records</h3>
        <p className="text-muted-foreground text-sm mb-5">
          Registering an edited item creates a new version with a fresh proof. Unchanged items are skipped.
        </p>

        <div className="space-y-2">
          {rows.map((row) => {
            const record = latestByEntity.get(row.key);
            const isBusy = busyKey === row.key;
            return (
              <div
                key={row.key}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 px-4 py-3"
              >
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
