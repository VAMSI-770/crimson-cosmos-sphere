import { useMemo } from "react";
import ScrollReveal from "../ScrollReveal";
import { motion } from "framer-motion";
import { useBlockchainConfig, useBlockchainRecords, useInvalidateBlockchain } from "@/hooks/useBlockchain";
import { useVerificationRealtime } from "@/hooks/useChainEvents";
import { getNetwork, addressUrl, shortHash, txUrl } from "@/lib/blockchain/networks";
import VerificationTimeline from "./VerificationTimeline";
import CopyButton from "./CopyButton";

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-display font-bold">{value}</p>
  </div>
);

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/40 last:border-0">
    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">{label}</span>
    <span className="text-sm text-right break-all">{children}</span>
  </div>
);

/**
 * Public trust section: portfolio blockchain identity + live verification
 * timeline. Read-only and free for every visitor — no wallet required.
 */
const PortfolioVerificationSection = () => {
  const { data: config } = useBlockchainConfig();
  useVerificationRealtime(useInvalidateBlockchain());
  const { data: records = [] } = useBlockchainRecords();

  const stats = useMemo(() => {
    const confirmed = records.filter((r) => Boolean(r.tx_hash));
    const count = (type: string) => confirmed.filter((r) => r.record_type === type).length;
    const resume = confirmed
      .filter((r) => r.record_type === "resume")
      .sort((a, b) => b.version - a.version)[0];
    return {
      certificates: count("certificate"),
      internships: count("internship"),
      achievements: count("achievement"),
      projects: count("project"),
      resumeVersion: resume ? `v${resume.version}` : "—",
    };
  }, [records]);

  const network = getNetwork(config?.network);

  return (
    <section id="verification" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <ScrollReveal>
          <p className="accent-text text-xs tracking-[0.4em] uppercase mb-4 font-semibold font-display">
            Proof of Authenticity
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display mb-5">
            Portfolio <span className="gradient-text">Verification</span>
          </h2>
          <div className="w-20 h-[2px] rounded-full bg-gradient-to-r from-blue-primary to-blue-bright mb-8" />
          <p className="text-muted-foreground max-w-2xl mb-12 md:mb-16 text-sm md:text-base">
            Every certificate, achievement, project version and resume revision is fingerprinted with
            SHA-256 and anchored to {network.name}. Documents never leave secure storage — only their
            cryptographic proof is written on-chain, so anyone can confirm nothing has been altered.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <ScrollReveal>
            <motion.div className="cinema-card rounded-2xl p-5 md:p-7 h-full glow-ring" whileHover={{ y: -4 }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-display font-bold">Blockchain Identity</h3>
                <span
                  className={`text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full border px-3 py-1 ${
                    config?.contract_address
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-border/60 bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  {config?.contract_address ? "Contract Live" : "Awaiting Deployment"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <Stat label="Certificates Verified" value={stats.certificates} />
                <Stat label="Achievements Verified" value={stats.achievements} />
                <Stat label="Projects Registered" value={stats.projects} />
                <Stat label="Internships Verified" value={stats.internships} />
                <Stat label="Resume Version" value={stats.resumeVersion} />
                <Stat label="Total Proofs" value={records.filter((r) => Boolean(r.tx_hash)).length} />
              </div>

              <Detail label="Owner">Bollepalli Vamsi</Detail>
              <Detail label="Portfolio ID">
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-xs">{config?.portfolio_id ?? "—"}</span>
                  <CopyButton value={config?.portfolio_id} label="Copy" />
                </span>
              </Detail>
              <Detail label="Owner Wallet">
                {config?.owner_wallet ? (
                  <a
                    className="text-blue-bright hover:underline font-mono text-xs"
                    href={addressUrl(config.network, config.owner_wallet)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {shortHash(config.owner_wallet, 8)}
                  </a>
                ) : null}
                {config?.owner_wallet ? (
                  <CopyButton value={config.owner_wallet} label="Copy Wallet" className="ml-2" />
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Network">
                {network.name}
                {network.isTestnet && <span className="ml-2 text-xs text-muted-foreground">testnet</span>}
              </Detail>
              <Detail label="Contract">
                {config?.contract_address ? (
                  <a
                    className="text-blue-bright hover:underline font-mono text-xs"
                    href={addressUrl(config.network, config.contract_address)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {shortHash(config.contract_address, 8)}
                  </a>
                ) : null}
                {config?.contract_address ? (
                  <CopyButton value={config.contract_address} label="Copy Contract" className="ml-2" />
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Verification Status">
                <span className={config?.contract_address ? "text-emerald-300" : "text-muted-foreground"}>
                  {config?.contract_address
                    ? `Active · ${records.filter((r) => Boolean(r.tx_hash)).length} proof(s) anchored`
                    : "Awaiting contract deployment"}
                </span>
              </Detail>
              <Detail label="Explorer">
                {config?.contract_address ? (
                  <a
                    className="text-blue-bright hover:underline text-xs"
                    href={addressUrl(config.network, config.contract_address)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View on {network.explorerName} ↗
                  </a>
                ) : (
                  "—"
                )}
              </Detail>
              <Detail label="Deployed">
                {config?.deployed_at ? new Date(config.deployed_at).toLocaleString() : "—"}
              </Detail>
              {config?.deployment_tx && (
                <Detail label="Deployment Tx">
                  <a
                    className="text-blue-bright hover:underline font-mono text-xs"
                    href={txUrl(config.network, config.deployment_tx)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {shortHash(config.deployment_tx)} ↗
                  </a>
                  <CopyButton value={config.deployment_tx} label="Copy Tx" className="ml-2" />
                </Detail>
              )}
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.div className="cinema-card rounded-2xl p-5 md:p-7 h-full glow-ring" whileHover={{ y: -4 }}>
              <h3 className="text-lg font-display font-bold mb-5">Verification Timeline</h3>
              <div className="max-h-[420px] overflow-y-auto pr-1">
                <VerificationTimeline records={records} limit={12} />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PortfolioVerificationSection;
