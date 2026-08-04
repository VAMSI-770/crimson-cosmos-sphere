/**
 * Polygon network definitions used by the verification layer.
 * Mainnet is the production target; Amoy is the development testnet.
 */
export interface ChainConfig {
  key: string;
  chainId: number;
  chainIdHex: string;
  name: string;
  shortName: string;
  currency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  explorer: string;
  explorerName: string;
  isTestnet: boolean;
}

export const NETWORKS: Record<string, ChainConfig> = {
  polygon: {
    key: "polygon",
    chainId: 137,
    chainIdHex: "0x89",
    name: "Polygon Mainnet",
    shortName: "Polygon",
    currency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com", "https://polygon-bor-rpc.publicnode.com"],
    explorer: "https://polygonscan.com",
    explorerName: "PolygonScan",
    isTestnet: false,
  },
  "polygon-amoy": {
    key: "polygon-amoy",
    chainId: 80002,
    chainIdHex: "0x13882",
    name: "Polygon Amoy Testnet",
    shortName: "Amoy",
    currency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://rpc-amoy.polygon.technology", "https://polygon-amoy-bor-rpc.publicnode.com"],
    explorer: "https://amoy.polygonscan.com",
    explorerName: "PolygonScan (Amoy)",
    isTestnet: true,
  },
};

export const NETWORK_LIST = Object.values(NETWORKS);
export const DEFAULT_NETWORK_KEY = "polygon-amoy";

export const getNetwork = (key?: string | null): ChainConfig =>
  (key && NETWORKS[key]) || NETWORKS[DEFAULT_NETWORK_KEY];

export const getNetworkByChainId = (chainId?: number | null): ChainConfig | undefined =>
  NETWORK_LIST.find((n) => n.chainId === chainId);

export const txUrl = (networkKey: string | null | undefined, hash: string) =>
  `${getNetwork(networkKey).explorer}/tx/${hash}`;

export const addressUrl = (networkKey: string | null | undefined, address: string) =>
  `${getNetwork(networkKey).explorer}/address/${address}`;

export const shortHash = (value?: string | null, size = 6) => {
  if (!value) return "—";
  if (value.length <= size * 2 + 3) return value;
  return `${value.slice(0, size + 2)}…${value.slice(-size)}`;
};
