import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  value?: string | null;
  label?: string;
  className?: string;
}

/**
 * Tiny inline copy control used next to wallets, contracts, hashes and
 * verification IDs. Purely additive — no layout impact on the host card.
 */
const CopyButton = ({ value, label = "Copy", className = "" }: Props) => {
  const [copied, setCopied] = useState(false);
  if (!value) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.94 }}
      aria-label={`${label}: ${value}`}
      title={copied ? "Copied" : label}
      className={`inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      {copied ? "Copied" : label}
    </motion.button>
  );
};

export default CopyButton;
