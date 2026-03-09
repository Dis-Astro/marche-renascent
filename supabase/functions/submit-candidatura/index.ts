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
    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (resendKey && cfg?.enabled) {
      const recipients = cfg.to_recipients.split(",").map((e: string) => e.trim()).filter(Boolean);
      
      // Build subject from template
      let subject = cfg.subject_template || `Nuova candidatura: ${nome}`;
      subject = subject
        .replace("{tipo}", tipo || "privato")
        .replace("{comune}", comune || "")
        .replace("{referente}", referente || nome || "");

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
