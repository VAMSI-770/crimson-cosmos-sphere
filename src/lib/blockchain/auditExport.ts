import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

export interface AuditRow {
  created_at: string;
  action: string;
  status: string;
  actor_email: string | null;
  entity: string | null;
  entity_id: string | null;
  ip_address: string | null;
  details: Record<string, unknown> | null;
}

/** Blockchain operations we report on: repairs, batch runs and verification sweeps. */
export const AUDIT_ACTION_PREFIXES = [
  "blockchain.repair",
  "blockchain.batch_register",
  "blockchain.verify_all",
  "blockchain.register",
  "blockchain.contract.deploy",
  "blockchain.smoke_test",
];

export const fetchBlockchainAudit = async (limit = 1000): Promise<AuditRow[]> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("created_at,action,status,actor_email,entity,entity_id,ip_address,details")
    .like("action", "blockchain.%")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as unknown as AuditRow[]) ?? [];
};

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

export const exportAuditCsv = (rows: AuditRow[]) => {
  const header = ["Timestamp", "Action", "Status", "Actor", "Entity", "Entity ID", "IP Address", "Details"];
  const body = rows.map((row) =>
    [
      row.created_at,
      row.action,
      row.status,
      row.actor_email ?? "",
      row.entity ?? "",
      row.entity_id ?? "",
      row.ip_address ?? "",
      row.details ?? {},
    ]
      .map(csvCell)
      .join(","),
  );
  download(
    new Blob([[header.map(csvCell).join(","), ...body].join("\r\n")], { type: "text/csv;charset=utf-8" }),
    `blockchain-audit-${stamp()}.csv`,
  );
};

export const exportAuditPdf = (rows: AuditRow[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  doc.setFillColor(10, 23, 51);
  doc.rect(0, 0, pageWidth, 78, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Blockchain Operations Audit Log", margin, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Sync repairs · batch registrations · verification sweeps · ${rows.length} entries · exported ${new Date().toISOString()}`,
    margin,
    58,
  );
  y = 108;

  rows.forEach((row) => {
    const detail = row.details && Object.keys(row.details).length ? JSON.stringify(row.details) : "—";
    const lines = doc.splitTextToSize(
      `${row.action} · ${row.status}${row.entity ? ` · ${row.entity}` : ""}${
        row.entity_id ? ` (${row.entity_id})` : ""
      }\n${detail}`,
      pageWidth - margin * 2 - 130,
    ) as string[];
    const height = Math.max(22, lines.length * 11 + 10);
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(110, 120, 140);
    doc.text(new Date(row.created_at).toLocaleString(), margin, y);
    doc.text(row.actor_email ?? row.ip_address ?? "—", margin, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 48, 66);
    doc.text(lines, margin + 130, y);
    y += height;
    doc.setDrawColor(226, 230, 238);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);
  });

  if (!rows.length) {
    doc.setTextColor(110, 120, 140);
    doc.setFontSize(10);
    doc.text("No blockchain audit entries recorded yet.", margin, y);
  }

  doc.save(`blockchain-audit-${stamp()}.pdf`);
};
