import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
  try {
    const client = new SmtpClient();
    const connectConfig = {
      hostname: opts.host,
      port: opts.port,
      username: opts.user,
      password: opts.pass,
    };

    if (opts.port === 465) {
      await client.connectTLS(connectConfig);
    } else {
      await client.connect(connectConfig);
    }

    await client.send({
      from: opts.from,
      to: opts.to.join(","),
      cc: opts.cc?.join(","),
      bcc: opts.bcc?.join(","),
      subject: opts.subject,
      content: "",
      html: opts.html,
    });

    await client.close();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tipo, nome, email, telefono, comune, denominazione, referente, payload, file_url } = body;

    if (!nome || !email || !telefono || !comune) {
      return new Response(
        JSON.stringify({ error: "Campi obbligatori mancanti" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert candidatura
    const { error: dbError } = await supabase.from("candidature").insert({
      tipo: tipo || "privato",
      nome,
      email,
      telefono,
      comune,
      denominazione: denominazione || null,
      referente: referente || null,
      payload: payload || null,
      file_url: file_url || null,
      stato: "nuova",
    });

    if (dbError) throw dbError;

    // Get email config
    const { data: configs } = await supabase
      .from("email_config")
      .select("*")
      .limit(1);

    const cfg = configs?.[0];

    if (cfg?.enabled && cfg?.smtp_host && cfg?.smtp_user && cfg?.smtp_pass) {
      const recipients = cfg.to_recipients.split(",").map((e: string) => e.trim()).filter(Boolean);
      
      // Build subject from template
      let subject = cfg.subject_template || `Nuova candidatura: ${nome}`;
      subject = subject
        .replace("{tipo}", tipo || "privato")
        .replace("{comune}", comune || "")
        .replace("{referente}", referente || nome || "");

      await sendSmtpEmail({
        host: cfg.smtp_host,
        port: cfg.smtp_port || 587,
        user: cfg.smtp_user,
        pass: cfg.smtp_pass,
        from: `${cfg.from_name} <${cfg.from_email}>`,
        to: recipients,
        replyTo: cfg.reply_to || undefined,
        cc: cfg.cc ? cfg.cc.split(",").map((e: string) => e.trim()) : undefined,
        bcc: cfg.bcc ? cfg.bcc.split(",").map((e: string) => e.trim()) : undefined,
        subject,
        html: `
          <h2>Nuova candidatura ricevuta</h2>
          <p><strong>Tipo:</strong> ${tipo || "privato"}</p>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${telefono}</p>
          <p><strong>Comune:</strong> ${comune}</p>
          <p><strong>Denominazione:</strong> ${denominazione || "–"}</p>
          <p><strong>Referente:</strong> ${referente || "–"}</p>
          ${file_url ? `<p><strong>Allegato:</strong> <a href="${file_url}">${file_url}</a></p>` : ""}
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
