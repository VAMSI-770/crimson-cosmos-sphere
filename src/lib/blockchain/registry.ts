import { BrowserProvider, Contract, ContractFactory, JsonRpcProvider, type Signer } from "ethers";
import artifact from "./PortfolioRegistry.json";
import { getNetwork } from "./networks";

export const REGISTRY_ABI = artifact.abi;
export const REGISTRY_BYTECODE = artifact.bytecode;

export const RECORD_TYPE_INDEX: Record<string, number> = {
  certificate: 0,
  resume: 1,
  achievement: 2,
  project: 3,
  internship: 4,
  ownership: 5,
};

/** Read-only provider for visitors without a wallet. Verification is always free. */
export const getReadProvider = (networkKey?: string | null) => {
  const network = getNetwork(networkKey);
  return new JsonRpcProvider(network.rpcUrls[0], network.chainId, { staticNetwork: true });
};

export const getReadContract = (address: string, networkKey?: string | null) =>
  new Contract(address, REGISTRY_ABI, getReadProvider(networkKey));

export const getWriteContract = (address: string, signer: Signer) =>
  new Contract(address, REGISTRY_ABI, signer);

export const deployRegistry = async (signer: Signer, portfolioId: string) => {
  const factory = new ContractFactory(REGISTRY_ABI, REGISTRY_BYTECODE, signer);
  const contract = await factory.deploy(portfolioId);
  const tx = contract.deploymentTransaction();
  await contract.waitForDeployment();
  return { address: await contract.getAddress(), txHash: tx?.hash ?? null };
};

export interface RegisterInput {
  recordType: keyof typeof RECORD_TYPE_INDEX;
  verificationId: string;
  contentHash: string;
  version: number;
  metadata: string;
}

/** Owner-only write. Returns the mined receipt so we can persist tx hash + block. */
export const registerOnChain = async (
  address: string,
  signer: Signer,
  input: RegisterInput,
  onStage?: (stage: "signing" | "pending" | "confirmed") => void,
) => {
  const contract = getWriteContract(address, signer);
  const { verificationId, contentHash, version, metadata } = input;

  onStage?.("signing");
  let tx;
  switch (input.recordType) {
    case "certificate":
      tx = await contract.registerCertificate(verificationId, contentHash, metadata);
      break;
    case "achievement":
      tx = await contract.registerAchievement(verificationId, contentHash, metadata);
      break;
    case "resume":
      tx = await contract.registerResume(verificationId, contentHash, version, metadata);
      break;
    case "internship":
      tx = await contract.registerInternship(verificationId, contentHash, metadata);
      break;
    case "ownership":
      tx = await contract.registerOwnership(verificationId, contentHash, metadata);
      break;
    default:
      tx = await contract.registerProjectVersion(verificationId, contentHash, version, metadata);
  }

  onStage?.("pending");
  const receipt = await tx.wait();
  onStage?.("confirmed");
  return { txHash: tx.hash as string, blockNumber: Number(receipt?.blockNumber ?? 0) };
};

export interface OnChainRecord {
  contentHash: string;
  recordType: number;
  version: number;
  timestamp: number;
  blockNumber: number;
  metadata: string;
}

export const readOnChainRecord = async (
  address: string,
  networkKey: string | null | undefined,
  verificationId: string,
): Promise<OnChainRecord | null> => {
  try {
    const contract = getReadContract(address, networkKey);
    const result = await contract.getRecord(verificationId);
    return {
      contentHash: result[0] as string,
      recordType: Number(result[1]),
      version: Number(result[2]),
      timestamp: Number(result[3]),
      blockNumber: Number(result[4]),
      metadata: result[5] as string,
    };
  } catch {
    return null;
  }
};

export const verifyHashOnChain = async (
  address: string,
  networkKey: string | null | undefined,
  verificationId: string,
  contentHash: string,
) => {
  const contract = getReadContract(address, networkKey);
  return (await contract.verifyHash(verificationId, contentHash)) as boolean;
};

export const readContractOwner = async (address: string, networkKey?: string | null) => {
  try {
    const contract = getReadContract(address, networkKey);
    return (await contract.owner()) as string;
  } catch {
    return null;
  }
};

export const readTotalRecords = async (address: string, networkKey?: string | null) => {
  try {
    const contract = getReadContract(address, networkKey);
    return Number(await contract.totalRecords());
  } catch {
    return null;
  }
};

export const hasInjectedWallet = () =>
  typeof window !== "undefined" && Boolean((window as { ethereum?: unknown }).ethereum);

export const getInjectedProvider = () => {
  const injected = (window as { ethereum?: unknown }).ethereum;
  if (!injected) throw new Error("No Web3 wallet detected. Install MetaMask to continue.");
  return new BrowserProvider(injected as never);
};

/** Free batch verification — a single RPC round-trip for many proofs. */
export const verifyBatchOnChain = async (
  address: string,
  networkKey: string | null | undefined,
  ids: string[],
  hashes: string[],
): Promise<boolean[]> => {
  if (!ids.length) return [];
  const contract = getReadContract(address, networkKey);
  const result = (await contract.verifyBatch(ids, hashes)) as boolean[];
  return result.map(Boolean);
};

/** Latest block height on the configured network (RPC connectivity probe). */
export const readLatestBlock = async (networkKey?: string | null) => {
  try {
    return await getReadProvider(networkKey).getBlockNumber();
  } catch {
    return null;
  }
};

/** Gas price in gwei, used by the health panel. */
export const readGasPriceGwei = async (networkKey?: string | null) => {
  try {
    const fee = await getReadProvider(networkKey).getFeeData();
    const price = fee.maxFeePerGas ?? fee.gasPrice;
    return price ? Number(price) / 1e9 : null;
  } catch {
    return null;
  }
};

/** Estimated gas for one registration call (read-only, no signature). */
export const estimateRegisterGas = async (
  address: string,
  signer: Signer,
  input: RegisterInput,
): Promise<number | null> => {
  try {
    const contract = getWriteContract(address, signer);
    const { verificationId, contentHash, version, metadata } = input;
    const fn =
      input.recordType === "resume" || input.recordType === "project"
        ? contract.getFunction(input.recordType === "resume" ? "registerResume" : "registerProjectVersion")
        : contract.getFunction(
            input.recordType === "certificate"
              ? "registerCertificate"
              : input.recordType === "achievement"
                ? "registerAchievement"
                : input.recordType === "internship"
                  ? "registerInternship"
                  : "registerOwnership",
          );
    const args =
      input.recordType === "resume" || input.recordType === "project"
        ? [verificationId, contentHash, version, metadata]
        : [verificationId, contentHash, metadata];
    return Number(await fn.estimateGas(...args));
  } catch {
    return null;
  }
};

/** True when the record exists on-chain (used by background sync + health). */
export const readVerificationStatus = async (
  address: string,
  networkKey: string | null | undefined,
  verificationId: string,
) => {
  try {
    const contract = getReadContract(address, networkKey);
    return Number(await contract.getVerificationStatus(verificationId)) === 1;
  } catch {
    return null;
  }
};

export interface RegistryEvent {
  name: string;
  verificationId: string | null;
  txHash: string;
  blockNumber: number;
  logIndex: number;
  valid?: boolean;
  version?: number;
}

/**
 * Poll-based event feed for the registry contract. Public Polygon RPCs do not
 * expose stable websockets, so we page `getLogs` and decode with the ABI —
 * cheap, free and reliable for driving live UI updates.
 */
export const readRegistryEvents = async (
  address: string,
  networkKey: string | null | undefined,
  fromBlock: number,
  toBlock?: number | "latest",
): Promise<RegistryEvent[]> => {
  try {
    const provider = getReadProvider(networkKey);
    const contract = new Contract(address, REGISTRY_ABI, provider);
    const logs = await provider.getLogs({
      address,
      fromBlock: Math.max(0, fromBlock),
      toBlock: toBlock ?? "latest",
    });
    return logs
      .map((log): RegistryEvent | null => {
        try {
          const parsed = contract.interface.parseLog({ topics: [...log.topics], data: log.data });
          if (!parsed) return null;
          const args = parsed.args as unknown as Record<string, unknown>;
          const id = args.verificationId;
          return {
            name: parsed.name,
            verificationId: typeof id === "string" ? id : null,
            txHash: log.transactionHash,
            blockNumber: log.blockNumber,
            logIndex: log.index,
            valid: typeof args.valid === "boolean" ? args.valid : undefined,
            version: args.version !== undefined ? Number(args.version) : undefined,
          };
        } catch {
          return null;
        }
      })
      .filter((event): event is RegistryEvent => Boolean(event));
  } catch {
    return [];
  }
};
