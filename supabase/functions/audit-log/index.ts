import { createClient } from "npm:@supabase/supabase-js@2";
import { writeAudit } from "../_shared/audit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Actions that may be logged without a signed-in user (public site events).
const PUBLIC_ACTIONS = new Set([
  "contact.submit",
  "contact.validation_error",
  "contact.email_failed",
  "download.resume",
  "download.certificate",
]);

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request" }, 400);
    }

    const action = str(body.action, 120);
    if (!action) return json({ error: "action is required" }, 400);

    let actorEmail: string | null = null;
    let actorId: string | null = null;

    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { auth: { persistSession: false } },
      );
      const { data } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
      if (data?.claims) {
        actorId = String(data.claims.sub);
        actorEmail = data.claims.email ? String(data.claims.email) : null;
      }
    }

    if (!actorId && !PUBLIC_ACTIONS.has(action)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const details =
      body.details && typeof body.details === "object" && !Array.isArray(body.details)
        ? (JSON.parse(JSON.stringify(body.details).slice(0, 4000)) as Record<string, unknown>)
        : {};

    await writeAudit(req, {
      action,
      status: str(body.status, 40) ?? "success",
      actor_email: actorEmail,
      actor_id: actorId,
      entity: str(body.entity, 80),
      entity_id: str(body.entity_id, 200),
      session_id: str(body.session_id, 200),
      details,
    });

    return json({ success: true });
  } catch (err) {
    console.error("audit-log error", err);
    return json({ error: "Internal server error" }, 500);
  }
});
