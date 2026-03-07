import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, action } = body;

    // Verify admin password
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "list") {
      const { data: candidature, error: cErr } = await supabase
        .from("candidature")
        .select("*")
        .order("created_at", { ascending: false });

      if (cErr) throw cErr;

      const { data: emailConfigs } = await supabase
        .from("email_config")
        .select("*")
        .limit(1);

      const { data: gtmConfigs } = await supabase
        .from("gtm_config")
        .select("*")
        .limit(1);

      return new Response(
        JSON.stringify({
          candidature: candidature || [],
          emailConfig: emailConfigs?.[0] || {},
          gtmConfig: gtmConfigs?.[0] || {},
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update-stato") {
      const { id, stato } = body;
      const { error } = await supabase
        .from("candidature")
        .update({ stato })
        .eq("id", id);
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "save-email") {
      const { config } = body;
      // Get existing config id
      const { data: existing } = await supabase
        .from("email_config")
        .select("id")
        .limit(1);

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from("email_config")
          .update({
            enabled: config.enabled,
            from_name: config.from_name,
            from_email: config.from_email,
            reply_to: config.reply_to || null,
            to_recipients: config.to_recipients,
            cc: config.cc || null,
            bcc: config.bcc || null,
            subject_template: config.subject_template,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing[0].id);
        if (error) throw error;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "test-email") {
      const { data: configs } = await supabase
        .from("email_config")
        .select("*")
        .limit(1);

      const cfg = configs?.[0];
      if (!cfg) throw new Error("No email config found");

      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) throw new Error("RESEND_API_KEY not configured");

      const recipients = cfg.to_recipients.split(",").map((e: string) => e.trim()).filter(Boolean);

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${cfg.from_name} <${cfg.from_email}>`,
          to: recipients,
          reply_to: cfg.reply_to || undefined,
          cc: cfg.cc ? cfg.cc.split(",").map((e: string) => e.trim()) : undefined,
          bcc: cfg.bcc ? cfg.bcc.split(",").map((e: string) => e.trim()) : undefined,
          subject: "Email di test – Cingoli Post-Sisma",
          html: "<h2>Test email</h2><p>Questa è un'email di test dalla piattaforma Cingoli.</p>",
        }),
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
