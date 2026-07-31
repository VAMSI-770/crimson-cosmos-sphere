import { createClient } from "npm:@supabase/supabase-js@2";

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

export function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export interface AuditEntry {
  action: string;
  status?: string;
  actor_email?: string | null;
  actor_id?: string | null;
  entity?: string | null;
  entity_id?: string | null;
  session_id?: string | null;
  request_id?: string | null;
  details?: Record<string, unknown>;
}

export async function writeAudit(req: Request, entry: AuditEntry) {
  try {
    const supabase = adminClient();
    await supabase.from("audit_logs").insert({
      action: entry.action.slice(0, 120),
      status: entry.status ?? "success",
      actor_email: entry.actor_email ?? null,
      actor_id: entry.actor_id ?? null,
      entity: entry.entity ?? null,
      entity_id: entry.entity_id ? String(entry.entity_id).slice(0, 200) : null,
      ip_address: clientIp(req),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
      session_id: entry.session_id ?? null,
      request_id: entry.request_id ?? crypto.randomUUID(),
      details: entry.details ?? {},
    });
  } catch (err) {
    console.error("audit write failed", err);
  }
}
