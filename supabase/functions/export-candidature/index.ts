import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map field keys → Italian labels (for column headers)
const FIELD_LABELS: Record<string, string> = {
  id: "ID",
  created_at: "Data invio",
  tipo: "Tipo (privato/professionista)",
  stato: "Stato",
  // Anagrafica
  denominazione: "Denominazione edificio",
  forma_giuridica: "Forma giuridica",
  forma_giuridica_altro: "Forma giuridica (altro)",
  regione: "Regione",
  provincia: "Provincia",
  citta: "Città",
  via: "Via / Indirizzo",
  referente_tipo: "Tipo referente",
  referente_altro: "Referente (altro)",
  nome_cognome: "Nome e Cognome",
  email: "Email",
  telefono: "Telefono",
  comune: "Comune",
  vincoli: "Vincoli",
  vincoli_desc: "Descrizione vincoli",
  contesto_normativo: "Contesto normativo",
  contesto_altro: "Contesto normativo (altro)",
  tipo_intervento: "Tipo intervento",
  tipo_intervento_altro: "Tipo intervento (altro)",
  // Edificio
  class_ubicativa: "Classificazione ubicativa",
  class_ubicativa_altro: "Classificazione (altro)",
  superficie: "Superficie lorda (mq)",
  unita_immobiliari: "Unità immobiliari",
  pertinenze: "Pertinenze",
  tipo_struttura: "Tipologia struttura",
  tipo_struttura_altro: "Struttura (altro)",
  area_circostante: "Area circostante",
  tipo_orizzontamenti: "Tipologia orizzontamenti",
  tipo_orizzontamenti_altro: "Orizzontamenti (altro)",
  tipo_copertura: "Tipologia copertura",
  tipo_copertura_altro: "Copertura (altro)",
  fast_aedes: "Scheda FAST/AEDES",
  visure: "Visure/Planimetrie",
  rilievo: "Rilievo/Quadro fessurativo",
  // Documenti
  progetto: "Progetto",
  buono_contributo: "Buono Contributo",
  buono_contributo_data: "Buono Contributo – data rilascio",
  importo_concesso: "Importo concesso (€)",
  livello_operativita: "Livello operatività",
  calcolo_contributo: "Calcolo contributo massimo",
  importo_max: "Importo max concedibile (€)",
  prog_architettonico: "Progetto architettonico",
  prog_strutturale: "Progetto strutturale",
  prog_impianti: "Progetto impianti",
  psc: "PSC",
  layout_cantiere: "Layout cantiere",
  cronoprogramma: "Cronoprogramma",
  computo: "Computo metrico",
  aut_comune: "Autorizzazione Comune",
  aut_comune_data: "Autorizzazione Comune – data",
  aut_genio: "Autorizzazione Genio Civile",
  aut_genio_data: "Autorizzazione Genio Civile – data",
  aut_soprintendenza: "Autorizzazione Soprintendenza",
  aut_soprintendenza_data: "Autorizzazione Soprintendenza – data",
  titolo_edilizio: "Titolo edilizio",
  titolo_edilizio_data: "Titolo edilizio – data",
  genio_civile: "Genio Civile",
  genio_civile_data: "Genio Civile – data",
  soprintendenza: "Soprintendenza",
  soprintendenza_data: "Soprintendenza – data",
  // Incarichi
  incarico_progettista_architettonico: "Incarico Progettista arch.",
  incarico_progettista_strutturale: "Incarico Progettista strutt.",
  incarico_progettista_impianti: "Incarico Progettista impianti",
  incarico_geologo: "Incarico Geologo",
  incarico_coordinatore_sicurezza: "Incarico Coordinatore sicurezza",
  incarico_direttore_lavori: "Incarico Direttore lavori",
  incarico_progettista: "Incarico Progettista",
  // Allegati e note
  file_url: "URL primo allegato",
  file_urls: "URL allegati",
  note: "Note finali",
  tipologia: "Tipologia",
  referente: "Referente",
  descrizione: "Descrizione",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (adminPassword && token !== adminPassword) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("candidature")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Flatten payload into each row
    const flatRows = (data || []).map((c: any) => {
      const { payload, ...rest } = c;
      const payloadFields = (payload && typeof payload === "object") ? payload : {};
      // Merge: top-level db fields take precedence
      return { ...payloadFields, ...rest };
    });

    // Build labelled rows (replace keys with Italian labels)
    const labelledRows = flatRows.map((row: any) => {
      const labelled: Record<string, any> = {};
      const handled = new Set<string>();

      // First pass: use defined labels in order
      for (const [key, label] of Object.entries(FIELD_LABELS)) {
        if (key in row) {
          labelled[label] = row[key];
          handled.add(key);
        }
      }

      // Second pass: any remaining unknown keys (dynamic incarichi etc.)
      for (const [key, value] of Object.entries(row)) {
        if (!handled.has(key)) {
          // Try to prettify incarico_ keys
          const pretty = key.startsWith("incarico_")
            ? "Incarico " + key.replace("incarico_", "").replace(/_/g, " ")
            : key;
          labelled[pretty] = value;
        }
      }

      return labelled;
    });

    const ws = XLSX.utils.json_to_sheet(labelledRows);

    // Auto-width columns
    const colWidths = labelledRows.reduce((acc: number[], row) => {
      Object.values(row).forEach((val, i) => {
        const len = String(val ?? "").length;
        acc[i] = Math.max(acc[i] ?? 10, len, 14);
      });
      return acc;
    }, []);
    ws["!cols"] = colWidths.map((w) => ({ wch: Math.min(w, 50) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidature");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=candidature.xlsx",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
