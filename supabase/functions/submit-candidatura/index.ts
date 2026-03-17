import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

interface SubmitBody {
  tipo?: string;
  nome: string;
  email: string;
  telefono: string;
  comune: string;
  denominazione?: string;
  referente?: string;
  payload?: Record<string, unknown>;
  file_url?: string | null;
  client_request_id?: string;
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

    const mailConfig: Record<string, unknown> = {
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    };

    if (opts.replyTo) mailConfig.replyTo = opts.replyTo;
    if (opts.cc?.length) mailConfig.cc = opts.cc;
    if (opts.bcc?.length) mailConfig.bcc = opts.bcc;

    await client.send(mailConfig);
    await client.close();

    return { ok: true };
  } catch (err) {
    try {
      client?.close();
    } catch {
      // no-op
    }

    return { ok: false, error: (err as Error).message };
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} (>${ms}ms)`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }) as Promise<T>;
}

function runInBackground(task: Promise<unknown>) {
  const edgeRuntime = (globalThis as typeof globalThis & {
    EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
  }).EdgeRuntime;

  if (edgeRuntime?.waitUntil) {
    edgeRuntime.waitUntil(task);
    return;
  }

  task.catch((error) => {
    console.error("[submit-candidatura] Background task failed:", error);
  });
}

async function notifyByEmail(
  supabase: ReturnType<typeof createClient>,
  { tipo, nome, email, telefono, comune, denominazione, referente, file_url }: SubmitBody,
) {
  const { data: configs, error: configError } = await supabase
    .from("email_config")
    .select("*")
    .limit(1);

  if (configError) {
    console.error("[submit-candidatura] Config email non leggibile:", configError.message);
    return;
  }

  const cfg = configs?.[0];

  if (!cfg?.enabled || !cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) {
    return;
  }

  const recipients = cfg.to_recipients
    .split(",")
    .map((entry: string) => entry.trim())
    .filter(Boolean);

  if (!recipients.length) {
    return;
  }

  let subject = cfg.subject_template || `Nuova candidatura: ${nome}`;
  subject = subject
    .replace("{tipo}", tipo || "privato")
    .replace("{comune}", comune || "")
    .replace("{referente}", referente || nome || "");

  const mailResult = await withTimeout(
    sendSmtpEmail({
      host: cfg.smtp_host,
      port: cfg.smtp_port || 465,
      user: cfg.smtp_user,
      pass: cfg.smtp_pass,
      from: `${cfg.from_name} <${cfg.from_email}>`,
      to: recipients,
      replyTo: cfg.reply_to || undefined,
      cc: cfg.cc ? cfg.cc.split(",").map((entry: string) => entry.trim()) : undefined,
      bcc: cfg.bcc ? cfg.bcc.split(",").map((entry: string) => entry.trim()) : undefined,
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
    }),
    12000,
    "Timeout invio SMTP",
  ).catch((emailError) => ({ ok: false, error: (emailError as Error).message }));

  if (!mailResult.ok) {
    console.error("[submit-candidatura] Invio email non riuscito:", mailResult.error);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SubmitBody;
    const { tipo, nome, email, telefono, comune, denominazione, referente, payload, file_url, client_request_id } = body;

    console.log("[submit-candidatura] request:received", JSON.stringify({
      client_request_id: client_request_id || null,
      tipo: tipo || "privato",
      comune,
      has_file: Boolean(file_url),
      has_payload: Boolean(payload),
    }));

    if (!nome || !email || !telefono || !comune) {
      console.warn("[submit-candidatura] request:validation_failed", JSON.stringify({ client_request_id: client_request_id || null }));
      return new Response(JSON.stringify({ error: "Campi obbligatori mancanti" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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

    if (dbError) {
      console.error("[submit-candidatura] request:db_error", JSON.stringify({ client_request_id: client_request_id || null, message: dbError.message }));
      throw dbError;
    }

    console.log("[submit-candidatura] request:db_inserted", JSON.stringify({ client_request_id: client_request_id || null }));
    runInBackground(notifyByEmail(supabase, body));
    console.log("[submit-candidatura] request:success", JSON.stringify({ client_request_id: client_request_id || null }));

    return new Response(JSON.stringify({ success: true, client_request_id: client_request_id || null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[submit-candidatura] Request failed:", err);

    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
