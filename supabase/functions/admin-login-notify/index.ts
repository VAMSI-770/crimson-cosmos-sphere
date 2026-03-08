import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || email;

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set, skipping email. Login by:", email);
      return new Response(
        JSON.stringify({ success: true, message: "Login logged (email not configured)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Admin Portal <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        subject: "🔐 Admin Login Detected — Portfolio CMS",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
            <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">Admin Login Detected</h1>
            </div>
            <div style="padding: 32px 24px;">
              <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Your portfolio admin portal was accessed successfully.
              </p>
              <div style="background: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #6b7280; font-size: 13px; padding: 6px 0;">Account</td>
                    <td style="color: #111827; font-size: 13px; padding: 6px 0; text-align: right; font-weight: 600;">${email}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 13px; padding: 6px 0;">Time</td>
                    <td style="color: #111827; font-size: 13px; padding: 6px 0; text-align: right; font-weight: 600;">${now}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0; text-align: center;">
                If this wasn't you, secure your account immediately.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: "Email send failed", details: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
