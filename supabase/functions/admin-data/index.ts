import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SmtpEmailOptions {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string[];
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}

async function sendSmtpEmail(opts: SmtpEmailOptions): Promise<{ ok: boolean; error?: string }> {
  let client: SMTPClient | null = null;
  try {
    const tls = opts.port === 465;
    client = new SMTPClient({
      connection: {
        hostname: opts.host,
        port: opts.port,
        tls,
        auth: {
          username: opts.user,
          password: opts.pass,
        },
      },
    });

    const mailConfig: any = {
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    };
    if (opts.replyTo) mailConfig.replyTo = opts.replyTo;
    if (opts.cc && opts.cc.length > 0) mailConfig.cc = opts.cc;
    if (opts.bcc && opts.bcc.length > 0) mailConfig.bcc = opts.bcc;

    await client.send(mailConfig);
    await client.close();
    return { ok: true };
  } catch (err) {
    try { client?.close(); } catch {}
    return { ok: false, error: (err as Error).message };
  }
}

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
            smtp_host: config.smtp_host || '',
            smtp_port: config.smtp_port || 465,
            smtp_user: config.smtp_user || '',
            smtp_pass: config.smtp_pass || '',
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
      if (!cfg) throw new Error("Nessuna configurazione email trovata");
      if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) {
        throw new Error("Configurazione SMTP incompleta: compila host, utente e password");
      }

      const recipients = cfg.to_recipients.split(",").map((e: string) => e.trim()).filter(Boolean);
      if (recipients.length === 0) throw new Error("Nessun destinatario configurato");

      const result = await sendSmtpEmail({
        host: cfg.smtp_host,
        port: cfg.smtp_port || 465,
        user: cfg.smtp_user,
        pass: cfg.smtp_pass,
        from: `${cfg.from_name} <${cfg.from_email}>`,
        to: recipients,
        replyTo: cfg.reply_to || undefined,
        cc: cfg.cc ? cfg.cc.split(",").map((e: string) => e.trim()) : undefined,
        bcc: cfg.bcc ? cfg.bcc.split(",").map((e: string) => e.trim()) : undefined,
        subject: "Email di test – Cingoli Post-Sisma",
        html: "<h2>Test email</h2><p>Questa è un'email di test dalla piattaforma Cingoli Post-Sisma.</p>",
      });

      if (!result.ok) throw new Error(result.error);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete-candidatura") {
      const { id } = body;
      if (!id) throw new Error("ID mancante");
      const { error } = await supabase
        .from("candidature")
        .delete()
        .eq("id", id);
      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "save-gtm") {
      const { config } = body;
      const { data: existing } = await supabase
        .from("gtm_config")
        .select("id")
        .limit(1);

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from("gtm_config")
          .update({
            enabled: config.enabled,
            gtm_id: config.gtm_id || '',
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

    if (action === "get-gtm-public") {
      const { data: gtmConfigs } = await supabase
        .from("gtm_config")
        .select("enabled, gtm_id")
        .limit(1);

      return new Response(
        JSON.stringify({ gtmConfig: gtmConfigs?.[0] || {} }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
