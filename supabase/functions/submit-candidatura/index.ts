import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, email, telefono, comune, tipologia, descrizione, file_url } =
      await req.json();

    // Validate
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

    // Insert into database
    const { error: dbError } = await supabase.from("candidature").insert({
      nome,
      email,
      telefono,
      comune,
      tipologia: tipologia || null,
      descrizione: descrizione || null,
      file_url: file_url || null,
    });

    if (dbError) throw dbError;

    // Send notification email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL") || "info@impresacingoli.it";

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cingoli Post-Sisma <onboarding@resend.dev>",
          to: [notifyEmail],
          subject: `Nuova candidatura: ${nome} - ${comune}`,
          html: `
            <h2>Nuova candidatura ricevuta</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${telefono}</p>
            <p><strong>Comune:</strong> ${comune}</p>
            <p><strong>Tipologia:</strong> ${tipologia || "Non specificata"}</p>
            <p><strong>Descrizione:</strong> ${descrizione || "Nessuna"}</p>
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
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
