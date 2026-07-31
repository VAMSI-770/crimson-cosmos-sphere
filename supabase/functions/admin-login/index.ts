import { createClient } from "npm:@supabase/supabase-js@2";
import { adminClient, clientIp, writeAudit } from "../_shared/audit.ts";

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

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const GENERIC_ERROR = "Invalid credentials";

const emailOk = (v: unknown) =>
  typeof v === "string" && v.length <= 255 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const requestId = crypto.randomUUID();
  const ip = clientIp(req);

  try {
    let body: { email?: unknown; password?: unknown };
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request" }, 400);
    }

    const email = emailOk(body.email) ? String(body.email).trim().toLowerCase() : null;
    const password =
      typeof body.password === "string" && body.password.length >= 6 && body.password.length <= 200
        ? body.password
        : null;

    if (!email || !password) {
      await writeAudit(req, {
        action: "admin.login",
        status: "validation_error",
        request_id: requestId,
      });
      return json({ error: GENERIC_ERROR }, 400);
    }

    const admin = adminClient();
    const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

    const { data: recent } = await admin
      .from("login_attempts")
      .select("success, created_at")
      .eq("ip_address", ip)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50);

    const failures = (recent || []).filter((r) => !r.success).length;

    if (failures >= MAX_ATTEMPTS) {
      await writeAudit(req, {
        action: "admin.login",
        status: "rate_limited",
        actor_email: email,
        request_id: requestId,
        details: { failures, window_minutes: WINDOW_MINUTES },
      });
      return json(
        {
          error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.`,
          retry_after_minutes: WINDOW_MINUTES,
        },
        429,
      );
    }

    // Progressive delay on repeated failures (brute-force slow-down)
    if (failures > 0) {
      await new Promise((r) => setTimeout(r, Math.min(failures * 600, 3000)));
    }

    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await anon.auth.signInWithPassword({ email, password });
    const success = !error && !!data?.session;

    await admin.from("login_attempts").insert({
      ip_address: ip,
      email,
      success,
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
    });

    if (!success) {
      await writeAudit(req, {
        action: "admin.login",
        status: "failed",
        actor_email: email,
        request_id: requestId,
        details: { attempts_in_window: failures + 1 },
      });
      return json({ error: GENERIC_ERROR }, 401);
    }

    await writeAudit(req, {
      action: "admin.login",
      status: "success",
      actor_email: email,
      actor_id: data.user?.id ?? null,
      request_id: requestId,
    });

    return json({
      session: {
        access_token: data.session!.access_token,
        refresh_token: data.session!.refresh_token,
      },
      email: data.user?.email ?? email,
    });
  } catch (err) {
    console.error("admin-login error", err);
    return json({ error: "Authentication failed" }, 500);
  }
});
