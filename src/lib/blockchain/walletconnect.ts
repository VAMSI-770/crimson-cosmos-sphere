import { supabase } from "@/integrations/supabase/client";
import { NETWORK_LIST, getNetwork } from "./networks";

export const WC_SECTION = "blockchain";
export const WC_KEY = "walletconnect_project_id";

/** Reads the WalletConnect (Reown) project id from site content. Public read. */
export const fetchWalletConnectProjectId = async (): Promise<string | null> => {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("section", WC_SECTION)
    .eq("key", WC_KEY)
    .maybeSingle();
  if (error) return null;
  const value = (data as { value?: string } | null)?.value?.trim();
  return value ? value : null;
};

/** Admin-only write (RLS enforced server side). */
export const saveWalletConnectProjectId = async (value: string) => {
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { section: WC_SECTION, key: WC_KEY, value: value.trim() },
      { onConflict: "section,key" },
    );
  if (error) throw error;
};

type Eip1193Like = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: never[]) => void) => void;
  removeListener?: (event: string, handler: (...args: never[]) => void) => void;
  disconnect?: () => Promise<void>;
};

/**
 * Lazily creates a WalletConnect v2 provider (QR + mobile deep links) so mobile
 * visitors can connect any wallet without MetaMask being installed.
 */
export const createWalletConnectProvider = async (
  projectId: string,
  preferredNetworkKey?: string | null,
): Promise<Eip1193Like> => {
  const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const preferred = getNetwork(preferredNetworkKey);
  const optional = NETWORK_LIST.filter((n) => n.chainId !== preferred.chainId).map((n) => n.chainId);
  const rpcMap: Record<number, string> = {};
  NETWORK_LIST.forEach((n) => {
    rpcMap[n.chainId] = n.rpcUrls[0];
  });

  const provider = await EthereumProvider.init({
    projectId,
    chains: [preferred.chainId],
    optionalChains: optional as never,
    rpcMap,
    showQrModal: true,
    metadata: {
      name: "Blockchain-Verified Portfolio",
      description: "Verify portfolio credentials anchored on Polygon.",
      url: typeof window !== "undefined" ? window.location.origin : "https://crimson-cosmos-sphere.lovable.app",
      icons: ["https://crimson-cosmos-sphere.lovable.app/placeholder.svg"],
    },
  });

  return provider as unknown as Eip1193Like;
};
