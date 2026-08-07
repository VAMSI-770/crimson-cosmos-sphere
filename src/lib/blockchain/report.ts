import { jsPDF } from "jspdf";
import { sha256Text } from "@/lib/blockchain/hash";
import { addressUrl, getNetwork, txUrl } from "@/lib/blockchain/networks";

export interface ReportInput {
  status: string;
  statusNote: string;
  recordType: string;
  title: string;
  version: number | string;
  owner: string;
  verificationId: string;
  shortId: string;
  network?: string | null;
  contractAddress?: string | null;
  ownerWallet?: string | null;
  verifiedAt?: string | null;
  blockNumber?: number | string | null;
  onChainHash?: string | null;
  computedHash?: string | null;
  txHash?: string | null;
  verifyUrl: string;
}

const INK = { heading: [10, 23, 51], body: [40, 48, 66], muted: [110, 120, 140] } as const;

/**
 * Tamper-evident verification report. Every field that determines the outcome is
 * printed in full, and the whole payload is fingerprinted with SHA-256 so the
 * PDF itself can be re-checked against the live record later.
 */
export const generateVerificationReport = async (input: ReportInput) => {
  const network = getNetwork(input.network);
  const generatedAt = new Date().toISOString();

  const rows: [string, string][] = [
    ["Result", input.status],
    ["Record Type", input.recordType],
    ["Title", input.title],
    ["Version", `v${input.version}`],
    ["Portfolio Owner", input.owner],
    ["Verification ID", input.verificationId],
    ["Short ID", input.shortId],
    ["Network", `${network.name}${network.isTestnet ? " (testnet)" : ""} · chain ${network.chainId}`],
    ["Registry Contract", input.contractAddress ?? "—"],
    ["Owner Wallet", input.ownerWallet ?? "—"],
    ["Verified At", input.verifiedAt ?? "—"],
    ["Block Number", String(input.blockNumber ?? "—")],
    ["On-Chain Hash (SHA-256)", input.onChainHash ?? "—"],
    ["Re-Computed Hash (SHA-256)", input.computedHash ?? "—"],
    ["Transaction Hash", input.txHash ?? "—"],
    ["Report Generated", generatedAt],
  ];

  const fingerprint = await sha256Text(rows.map(([k, v]) => `${k}=${v}`).join("|"));

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const valueX = margin + 170;
  const valueWidth = pageWidth - valueX - margin;
  let y = margin + 6;

  doc.setFillColor(10, 23, 51);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Blockchain Verification Report", margin, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${input.owner} · Digital Portfolio`, margin, y + 42);
  y = 138;

  doc.setTextColor(...INK.heading);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(input.status.toUpperCase(), margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK.muted);
  doc.text(doc.splitTextToSize(input.statusNote, pageWidth - margin * 2), margin, y);
  y += 30;

  const line = () => {
    doc.setDrawColor(224, 228, 236);
    doc.line(margin, y, pageWidth - margin, y);
    y += 14;
  };
  line();

  rows.forEach(([label, value]) => {
    const wrapped = doc.splitTextToSize(value || "—", valueWidth) as string[];
    const blockHeight = Math.max(14, wrapped.length * 12);
    if (y + blockHeight > doc.internal.pageSize.getHeight() - 90) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...INK.muted);
    doc.text(label.toUpperCase(), margin, y);
    doc.setFont(label.includes("Hash") || label.includes("ID") ? "courier" : "helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK.body);
    doc.text(wrapped, valueX, y);
    y += blockHeight + 8;
  });

  y += 4;
  line();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...INK.heading);
  doc.text("Independent Verification Links", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 80, 200);

  const links: [string, string][] = [
    ["Live verification page", input.verifyUrl],
    ...(input.txHash
      ? ([[`${network.explorerName} transaction`, txUrl(input.network, input.txHash)]] as [string, string][])
      : []),
    ...(input.contractAddress
      ? ([
          [`${network.explorerName} contract`, addressUrl(input.network, input.contractAddress)],
        ] as [string, string][])
      : []),
  ];
  links.forEach(([label, url]) => {
    doc.textWithLink(`${label}: ${url}`, margin, y, { url });
    y += 14;
  });

  y += 12;
  doc.setTextColor(...INK.muted);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(`Report fingerprint (SHA-256): ${fingerprint}`, margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.text(
    doc.splitTextToSize(
      "This report is tamper-evident: recompute the SHA-256 of the printed field list to detect any alteration, and re-open the live verification page to confirm the on-chain proof independently. Only hashes are stored on-chain — no documents are published.",
      pageWidth - margin * 2,
    ),
    margin,
    y,
  );

  doc.save(`verification-${input.shortId}.pdf`);
  return fingerprint;
};
