import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrowserProvider, type Signer } from "ethers";
import { hasInjectedWallet } from "./registry";
import { getNetwork, getNetworkByChainId, type ChainConfig } from "./networks";
import { createWalletConnectProvider, fetchWalletConnectProjectId } from "./walletconnect";

export type ConnectorKind = "injected" | "walletconnect";

interface WalletState {
  address: string | null;
  chainId: number | null;
  network?: ChainConfig;
  connector: ConnectorKind | null;
  isConnecting: boolean;
  /** Injected wallet (MetaMask) present in this browser. */
  isAvailable: boolean;
  /** WalletConnect is configured (project id present) and usable on mobile. */
  isWalletConnectAvailable: boolean;
  connect: (kind?: ConnectorKind, preferredNetworkKey?: string | null) => Promise<string | null>;
  disconnect: () => void;
  switchNetwork: (networkKey: string) => Promise<void>;
  getSigner: () => Promise<Signer>;
}

const WalletContext = createContext<WalletState | null>(null);

const STORAGE_KEY = "portfolio.wallet.connected";
const CONNECTOR_KEY = "portfolio.wallet.connector";

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: never[]) => void) => void;
  removeListener?: (event: string, handler: (...args: never[]) => void) => void;
  disconnect?: () => Promise<void>;
};

const injected = () => (window as unknown as { ethereum?: Eip1193 }).ethereum;

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connector, setConnector] = useState<ConnectorKind | null>(null);
  const [wcProjectId, setWcProjectId] = useState<string | null>(null);
  const activeProvider = useRef<Eip1193 | null>(null);
  const isAvailable = hasInjectedWallet();

  useEffect(() => {
    void fetchWalletConnectProjectId().then(setWcProjectId).catch(() => undefined);
  }, []);

  const readChain = useCallback(async (provider?: Eip1193 | null) => {
    const eth = provider ?? activeProvider.current ?? injected();
    if (!eth) return;
    const hex = (await eth.request({ method: "eth_chainId" })) as string;
    setChainId(Number.parseInt(hex, 16));
  }, []);

  const attachListeners = useCallback((eth: Eip1193) => {
    if (!eth.on) return;
    const onAccounts = (...args: never[]) => {
      const accounts = args[0] as unknown as string[];
      setAddress(accounts?.length ? accounts[0] : null);
      if (!accounts?.length) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CONNECTOR_KEY);
      }
    };
    const onChain = (...args: never[]) => {
      const raw = args[0] as unknown as string | number;
      setChainId(typeof raw === "number" ? raw : Number.parseInt(raw, 16));
    };
    const onDisconnect = () => {
      setAddress(null);
      setConnector(null);
      activeProvider.current = null;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CONNECTOR_KEY);
    };
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    eth.on("disconnect", onDisconnect as never);
  }, []);

  // Silent restore for injected wallets: never prompts.
  useEffect(() => {
    const eth = injected();
    if (!eth || localStorage.getItem(STORAGE_KEY) !== "1") return;
    if (localStorage.getItem(CONNECTOR_KEY) === "walletconnect") return;
    void (async () => {
      const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
      if (accounts?.length) {
        activeProvider.current = eth;
        setConnector("injected");
        setAddress(accounts[0]);
        attachListeners(eth);
        await readChain(eth);
      }
    })().catch(() => undefined);
  }, [readChain, attachListeners]);

  const connect = useCallback(
    async (kind: ConnectorKind = "injected", preferredNetworkKey?: string | null) => {
      setIsConnecting(true);
      try {
        let eth: Eip1193;
        if (kind === "walletconnect") {
          const projectId = wcProjectId ?? (await fetchWalletConnectProjectId());
          if (!projectId) {
            throw new Error(
              "WalletConnect is not configured yet. Add a WalletConnect project ID in Admin → Blockchain.",
            );
          }
          setWcProjectId(projectId);
          eth = (await createWalletConnectProvider(projectId, preferredNetworkKey)) as Eip1193;
        } else {
          const found = injected();
          if (!found) {
            throw new Error("No browser wallet detected. Use WalletConnect to connect a mobile wallet.");
          }
          eth = found;
        }

        const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
        const next = accounts?.[0] ?? null;
        activeProvider.current = eth;
        setConnector(kind);
        setAddress(next);
        if (next) {
          localStorage.setItem(STORAGE_KEY, "1");
          localStorage.setItem(CONNECTOR_KEY, kind);
        }
        attachListeners(eth);
        await readChain(eth);
        return next;
      } finally {
        setIsConnecting(false);
      }
    },
    [attachListeners, readChain, wcProjectId],
  );

  const disconnect = useCallback(() => {
    const eth = activeProvider.current;
    void eth?.disconnect?.().catch(() => undefined);
    activeProvider.current = null;
    setAddress(null);
    setConnector(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONNECTOR_KEY);
  }, []);

  const switchNetwork = useCallback(
    async (networkKey: string) => {
      const eth = activeProvider.current ?? injected();
      if (!eth) throw new Error("No wallet connected.");
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
      await readChain(eth);
    },
    [readChain],
  );

  const getSigner = useCallback(async () => {
    const eth = activeProvider.current ?? injected();
    if (!eth) throw new Error("No wallet connected.");
    return new BrowserProvider(eth as never).getSigner();
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      address,
      chainId,
      network: getNetworkByChainId(chainId),
      connector,
      isConnecting,
      isAvailable,
      isWalletConnectAvailable: Boolean(wcProjectId),
      connect,
      disconnect,
      switchNetwork,
      getSigner,
    }),
    [address, chainId, connector, isConnecting, isAvailable, wcProjectId, connect, disconnect, switchNetwork, getSigner],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used inside <WalletProvider>");
  return context;
};
