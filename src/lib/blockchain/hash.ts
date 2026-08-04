import { keccak256, toUtf8Bytes } from "ethers";

/** Lowercase hex SHA-256 of arbitrary bytes, computed in the browser (no upload). */
export const sha256Bytes = async (data: ArrayBuffer | Uint8Array): Promise<string> => {
  const buffer = data instanceof Uint8Array ? new Uint8Array(data).buffer : data;
  const digest = await crypto.subtle.digest("SHA-256", buffer as ArrayBuffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const sha256Text = (text: string) => sha256Bytes(new TextEncoder().encode(text));

export const sha256File = async (file: File | Blob) => sha256Bytes(await file.arrayBuffer());

/** Hash a remote asset (certificate PDF, resume, image) by streaming it client-side. */
export const sha256Url = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Unable to fetch asset (${response.status})`);
  return sha256Bytes(await response.arrayBuffer());
};

/**
 * Deterministic canonical serialisation so the same content always yields the
 * same hash regardless of key ordering or unrelated columns.
 */
export const canonicalize = (value: unknown): string => {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

export const sha256Record = (record: Record<string, unknown>) => sha256Text(canonicalize(record));

/** 0x-prefixed bytes32 for on-chain storage. */
export const toBytes32 = (hex: string) => `0x${hex.replace(/^0x/, "").padStart(64, "0")}`;

/**
 * Stable verification id: keccak256 of type + entity + version, so the same
 * item/version can never be registered twice (replay + duplicate protection).
 */
export const buildVerificationId = (recordType: string, entityId: string, version: number) =>
  keccak256(toUtf8Bytes(`${recordType}:${entityId}:v${version}`));

/** Human-friendly short form shown on cards, e.g. VRF-8F2A-91C4. */
export const displayVerificationId = (verificationId: string) => {
  const clean = verificationId.replace(/^0x/, "").toUpperCase();
  return `VRF-${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
};
