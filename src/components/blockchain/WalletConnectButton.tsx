import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useWallet, type ConnectorKind } from "@/lib/blockchain/WalletProvider";
import { shortHash } from "@/lib/blockchain/networks";

interface Props {
  /** Network the wallet should prefer when opening WalletConnect. */
  networkKey?: string | null;
  onConnected?: (address: string, connector: ConnectorKind) => void;
  onDisconnected?: () => void;
  className?: string;
}

/**
 * Dual connector control: injected wallet (MetaMask) plus WalletConnect for
 * mobile wallets. Verification never requires a wallet — this is only needed
 * for signing.
 */
const WalletConnectButton = ({ networkKey, onConnected, onDisconnected, className = "" }: Props) => {
  const wallet = useWallet();
  const [pending, setPending] = useState<ConnectorKind | null>(null);

  const handleConnect = async (kind: ConnectorKind) => {
    setPending(kind);
    try {
      const account = await wallet.connect(kind, networkKey);
      if (!account) return;
      toast.success(`Wallet connected · ${shortHash(account)}`);
      onConnected?.(account, kind);
    } catch (error) {
      toast.error(error instanceof Error ? error.message.slice(0, 200) : "Wallet connection failed");
    } finally {
      setPending(null);
    }
  };

  if (wallet.address) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          wallet.disconnect();
          toast.success("Wallet disconnected");
          onDisconnected?.();
        }}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors ${className}`}
      >
        {shortHash(wallet.address)}
        <span className="ml-2 text-xs text-muted-foreground">
          {wallet.connector === "walletconnect" ? "WalletConnect · Disconnect" : "Disconnect"}
        </span>
      </motion.button>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={pending !== null}
        onClick={() => handleConnect("injected")}
        className="px-5 py-2.5 rounded-xl text-sm font-medium border border-blue-primary/30 bg-blue-primary/10 text-blue-bright hover:bg-blue-primary/20 transition-colors disabled:opacity-60"
      >
        {pending === "injected" ? "Connecting…" : wallet.isAvailable ? "Connect Browser Wallet" : "Install MetaMask"}
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        disabled={pending !== null}
        onClick={() => handleConnect("walletconnect")}
        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors disabled:opacity-60"
      >
        {pending === "walletconnect" ? "Opening WalletConnect…" : "Connect via WalletConnect"}
      </motion.button>
      {!wallet.isWalletConnectAvailable && (
        <span className="text-xs text-muted-foreground">
          WalletConnect needs a project ID (set it below).
        </span>
      )}
    </div>
  );
};

export default WalletConnectButton;
