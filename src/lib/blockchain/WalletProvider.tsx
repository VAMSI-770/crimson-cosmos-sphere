import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Signer } from "ethers";
import { getInjectedProvider, hasInjectedWallet } from "./registry";
import { getNetwork, getNetworkByChainId, type ChainConfig } from "./networks";

interface WalletState {
  address: string | null;
  chainId: number | null;
  network?: ChainConfig;
  isConnecting: boolean;
  isAvailable: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  switchNetwork: (networkKey: string) => Promise<void>;
  getSigner: () => Promise<Signer>;
}

const WalletContext = createContext<WalletState | null>(null);

const STORAGE_KEY = "portfolio.wallet.connected";

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: never[]) => void) => void;
  removeListener?: (event: string, handler: (...args: never[]) => void) => void;
};

const injected = () => (window as unknown as { ethereum?: Eip1193 }).ethereum;

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const isAvailable = hasInjectedWallet();

  const readChain = useCallback(async () => {
    const eth = injected();
    if (!eth) return;
    const hex = (await eth.request({ method: "eth_chainId" })) as string;
    setChainId(Number.parseInt(hex, 16));
  }, []);

  // Silent restore: never prompts, just reads already-granted accounts.
  useEffect(() => {
    const eth = injected();
    if (!eth || localStorage.getItem(STORAGE_KEY) !== "1") return;
    void (async () => {
      const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
      if (accounts?.length) {
        setAddress(accounts[0]);
        await readChain();
      }
    })().catch(() => undefined);
  }, [readChain]);

  useEffect(() => {
    const eth = injected();
    if (!eth?.on) return;
    const onAccounts = (...args: never[]) => {
      const accounts = args[0] as unknown as string[];
      setAddress(accounts?.length ? accounts[0] : null);
      if (!accounts?.length) localStorage.removeItem(STORAGE_KEY);
    };
    const onChain = (...args: never[]) => setChainId(Number.parseInt(args[0] as unknown as string, 16));
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const connect = useCallback(async () => {
    const eth = injected();
    if (!eth) throw new Error("No Web3 wallet detected. Install MetaMask (or use a WalletConnect-enabled mobile browser).");
    setIsConnecting(true);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      const next = accounts?.[0] ?? null;
      setAddress(next);
      if (next) localStorage.setItem(STORAGE_KEY, "1");
      await readChain();
      return next;
    } finally {
      setIsConnecting(false);
    }
  }, [readChain]);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchNetwork = useCallback(async (networkKey: string) => {
    const eth = injected();
    if (!eth) throw new Error("No Web3 wallet detected.");
    const target = getNetwork(networkKey);
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: target.chainIdHex }] });
    } catch (error) {
      const code = (error as { code?: number }).code;
      if (code !== 4902) throw error;
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: target.chainIdHex,
            chainName: target.name,
            nativeCurrency: target.currency,
            rpcUrls: target.rpcUrls,
            blockExplorerUrls: [target.explorer],
          },
        ],
      });
    }
    await readChain();
  }, [readChain]);

  const getSigner = useCallback(async () => {
    const provider = getInjectedProvider();
    return provider.getSigner();
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      address,
      chainId,
      network: getNetworkByChainId(chainId),
      isConnecting,
      isAvailable,
      connect,
      disconnect,
      switchNetwork,
      getSigner,
    }),
    [address, chainId, isConnecting, isAvailable, connect, disconnect, switchNetwork, getSigner],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside <WalletProvider>");
  return context;
};
