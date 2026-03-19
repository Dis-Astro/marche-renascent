import { useState, useRef, useCallback, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Step1Anagrafica from "@/components/form/Step1Anagrafica";
import Step2Edificio from "@/components/form/Step2Edificio";
import Step3Documenti from "@/components/form/Step3Documenti";
import { ChevronLeft } from "lucide-react";
import logoCingoli from "@/assets/logo-cingoli.png";

export type TipoUtente = "proprietario" | "progettista";
export type FormData = Record<string, any>;

type SubmitCandidaturaBody = {
  tipo: TipoUtente;
  nome: string;
  email: string;
  telefono: string;
  comune: string;
  denominazione: string;
  referente: string;
  payload: FormData;
  file_url: string | null;
  client_request_id: string;
};

const STEPS = ["Anagrafica", "Edificio", "Documenti"];
const SUBMIT_TIMEOUT_MS = 30_000; // timeout only for the final POST, not uploads
const SUBMIT_ENDPOINT = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/submit-candidatura`;

const submitCandidatura = async (body: SubmitCandidaturaBody, signal: AbortSignal) => {
  console.info("[candidatura] request:start", {
    requestId: body.client_request_id,
    endpoint: SUBMIT_ENDPOINT,
    hasFile: Boolean(body.file_url),
  });

  let response: Response;
  try {
    response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("[candidatura] request:abort", { requestId: body.client_request_id });
      throw new Error("Timeout durante l'invio della candidatura. Riprova.");
    }
    console.error("[candidatura] request:network_error", { requestId: body.client_request_id, error });
    throw new Error("Errore di rete. Controlla la connessione e riprova.");
  }

  console.info("[candidatura] request:response", {
    requestId: body.client_request_id,
    status: response.status,
    ok: response.ok,
  });

  if (response.ok) {
    return { success: true };
  }

  let errorMessage = `Errore durante l'invio (${response.status}).`;
  try {
    const text = await response.text();
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed?.error) errorMessage = parsed.error;
    }
  } catch {
    // fallback error message already set
  }

  console.error("[candidatura] request:error_response", {
    requestId: body.client_request_id,
    status: response.status,
    errorMessage,
  });

  throw new Error(errorMessage);
};

const Candidatura = () => {
  const [searchParams] = useSearchParams();
  const tipo: TipoUtente = (searchParams.get("tipo") as TipoUtente) || "proprietario";

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isSubmittingRef = useRef(false);
  const acceptedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const [showFallbackSuccess, setShowFallbackSuccess] = useState(false);

  // ── Central reset: brings the component back to "virgin" state ──
  const resetSubmissionFlow = useCallback(() => {
    console.info("[candidatura] flow:reset:start");
    // Clear any pending fallback timer
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    // Reset all refs
    isSubmittingRef.current = false;
    acceptedRef.current = false;
    // Reset all state
    setStep(0);
    setForm({});
    setFiles([]);
    setLoading(false);
    setSuccess(false);
    setShowFallbackSuccess(false);
    setError("");
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.info("[candidatura] flow:reset:end");
  }, []);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const hasValue = (value: unknown) => {
    if (typeof value === "string") return value.trim().length > 0;
    return value !== undefined && value !== null;
  };

  const getStepValidationError = (currentStep: number, currentForm: FormData) => {
    const requiredFields =
      tipo === "proprietario"
        ? [
            [
              { label: "Nome immobile", value: currentForm.denominazione },
              { label: "Tipologia immobile", value: currentForm.tipologia_immobile },
              { label: "Regione", value: currentForm.regione || "Marche" },
              { label: "Provincia", value: currentForm.provincia },
              { label: "Città", value: currentForm.citta },
              { label: "Indirizzo", value: currentForm.via },
              { label: "Referente", value: currentForm.referente_tipo },
              { label: "Nome referente", value: currentForm.nome_referente },
              { label: "Telefono", value: currentForm.telefono },
              { label: "Email", value: currentForm.email },
              { label: "Vincoli", value: currentForm.vincoli },
              { label: "Tipo intervento", value: currentForm.tipo_intervento },
              ...(currentForm.tipo_intervento === "Altro"
                ? [{ label: "Specifica intervento", value: currentForm.tipo_intervento_altro }]
                : []),
            ],
            [
              { label: "Tipologia edificio", value: currentForm.class_ubicativa },
              ...(currentForm.class_ubicativa === "Altro"
                ? [{ label: "Specifica tipologia edificio", value: currentForm.class_ubicativa_altro }]
                : []),
              { label: "Superficie", value: currentForm.superficie },
              { label: "Unità immobiliari", value: currentForm.unita_immobiliari },
              { label: "Pertinenze", value: currentForm.pertinenze },
            ],
            [],
          ]
        : [
            [
              { label: "Denominazione edificio", value: currentForm.denominazione },
              { label: "Regione", value: currentForm.regione || "Marche" },
              { label: "Provincia", value: currentForm.provincia },
              { label: "Città", value: currentForm.citta },
              { label: "Indirizzo", value: currentForm.via },
              { label: "Referente", value: currentForm.referente_tipo },
              { label: "Nome referente", value: currentForm.nome_referente },
              { label: "Telefono", value: currentForm.telefono },
              { label: "Email", value: currentForm.email },
              { label: "Vincoli", value: currentForm.vincoli },
              { label: "Tipo intervento", value: currentForm.tipo_intervento },
              ...(currentForm.tipo_intervento === "Altro"
                ? [{ label: "Specifica intervento", value: currentForm.tipo_intervento_altro }]
                : []),
            ],
            [
              { label: "Classificazione ubicativa", value: currentForm.class_ubicativa },
              ...(currentForm.class_ubicativa === "Altro"
                ? [{ label: "Specifica classificazione", value: currentForm.class_ubicativa_altro }]
                : []),
              { label: "Superficie", value: currentForm.superficie },
              { label: "Unità immobiliari", value: currentForm.unita_immobiliari },
              { label: "Pertinenze", value: currentForm.pertinenze },
              { label: "Struttura portante", value: currentForm.tipo_struttura },
              ...(currentForm.tipo_struttura === "Altro"
                ? [{ label: "Specifica struttura", value: currentForm.tipo_struttura_altro }]
                : []),
              { label: "Area circostante", value: currentForm.area_circostante },
              { label: "Tipologia orizzontamenti", value: currentForm.tipo_orizzontamenti },
              ...(currentForm.tipo_orizzontamenti === "Altro"
                ? [{ label: "Specifica orizzontamenti", value: currentForm.tipo_orizzontamenti_altro }]
                : []),
              { label: "Tipologia copertura", value: currentForm.tipo_copertura },
              ...(currentForm.tipo_copertura === "Altro"
                ? [{ label: "Specifica copertura", value: currentForm.tipo_copertura_altro }]
                : []),
              { label: "Scheda FAST / AEDES", value: currentForm.fast_aedes },
              { label: "Visure / Planimetrie", value: currentForm.visure },
              { label: "Rilievo / Quadro fessurativo", value: currentForm.rilievo },
            ],
            [
              { label: "Progetto", value: currentForm.progetto },
              { label: "Buono contributo", value: currentForm.buono_contributo },
              ...(currentForm.buono_contributo === "Rilasciato"
                ? [
                    { label: "Data rilascio buono contributo", value: currentForm.buono_contributo_data },
                    { label: "Importo concesso", value: currentForm.importo_concesso },
                  ]
                : []),
              { label: "Livello operatività", value: currentForm.livello_operativita },
              { label: "Calcolo contributo massimo", value: currentForm.calcolo_contributo },
              ...(currentForm.calcolo_contributo === "Fatto"
                ? [{ label: "Importo max concedibile", value: currentForm.importo_max }]
                : []),
              { label: "Progetto architettonico", value: currentForm.prog_architettonico },
              { label: "Progetto strutturale", value: currentForm.prog_strutturale },
              { label: "Progetto impianti", value: currentForm.prog_impianti },
              { label: "PSC", value: currentForm.psc },
              { label: "Layout cantiere", value: currentForm.layout_cantiere },
              { label: "Cronoprogramma", value: currentForm.cronoprogramma },
              { label: "Computo metrico", value: currentForm.computo },
              { label: "Autorizzazione Comune", value: currentForm.aut_comune },
              ...(currentForm.aut_comune === "Rilasciato"
                ? [{ label: "Data rilascio autorizzazione Comune", value: currentForm.aut_comune_data }]
                : []),
              { label: "Autorizzazione Genio Civile", value: currentForm.aut_genio },
              ...(currentForm.aut_genio === "Rilasciato"
                ? [{ label: "Data rilascio autorizzazione Genio Civile", value: currentForm.aut_genio_data }]
                : []),
              { label: "Autorizzazione Soprintendenza", value: currentForm.aut_soprintendenza },
              ...(currentForm.aut_soprintendenza === "Rilasciato"
                ? [{ label: "Data rilascio autorizzazione Soprintendenza", value: currentForm.aut_soprintendenza_data }]
                : []),
              { label: "Incarico progettista architettonico", value: currentForm.incarico_progettista_architettonico },
              { label: "Incarico progettista strutturale", value: currentForm.incarico_progettista_strutturale },
              { label: "Incarico progettista impianti", value: currentForm.incarico_progettista_impianti },
              { label: "Incarico geologo", value: currentForm.incarico_geologo },
              { label: "Incarico coordinatore sicurezza", value: currentForm.incarico_coordinatore_sicurezza },
              { label: "Incarico direttore lavori", value: currentForm.incarico_direttore_lavori },
            ],
          ];

    const missingFields = (requiredFields[currentStep] ?? [])
      .filter((field) => !hasValue(field.value))
      .map((field) => field.label);

    if (missingFields.length === 0) return null;

    return `Completa i campi obbligatori di ${STEPS[currentStep]}: ${missingFields.join(", ")}.`;
  };

  const next = () => {
    const stepError = getStepValidationError(step, form);
    if (stepError) {
      setError(stepError);
      return;
    }

    setError("");
    setStep((s) => Math.min(s + 1, 2));
  };

  const prev = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const clearSelectedFiles = useCallback(() => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop() || "file";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("candidature-files")
      .upload(path, file, { upsert: false });

    if (uploadErr) {
      throw new Error(`Errore upload file ${file.name}: ${uploadErr.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("candidature-files")
      .getPublicUrl(path);

    return urlData.publicUrl;
  };

  // Prevent native form submit (Enter key, etc.)
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // ──────────────────────────────────────────────
  // SINGLE submit handler — the ONLY entry point
  // ──────────────────────────────────────────────
  const handleFinalSubmit = useCallback(async () => {
    // Guard: must be on step 2
    if (step < 2) {
      console.warn("[candidatura] submit:blocked_not_final_step", { step });
      return;
    }

    // Guard: anti double-submit (ref-based, survives re-renders)
    if (isSubmittingRef.current) {
      console.warn("[candidatura] submit:blocked (already submitting)");
      return;
    }

    // Validate ALL steps before submitting
    for (const stepIndex of [0, 1, 2]) {
      const stepError = getStepValidationError(stepIndex, form);
      if (stepError) {
        console.warn("[candidatura] submit:validation_failed", { stepIndex, stepError });
        setError(stepError);
        setStep(stepIndex);
        return;
      }
    }

    const requestId = crypto.randomUUID();
    const submittedForm = { ...form };
    const submittedFiles = [...files];
    const nome = submittedForm.nome_referente || "";
    const email = submittedForm.email || "";
    const telefono = submittedForm.telefono || "";
    const comune = submittedForm.citta || "";

    console.info("[candidatura] submit:start", {
      requestId,
      tipo,
      files: submittedFiles.length,
      comune,
      email,
    });

    // Lock submit
    isSubmittingRef.current = true;
    acceptedRef.current = false;
    setError("");
    setLoading(true);

    try {
      // ── Phase 1: Upload files (NO timeout — uploads can be slow) ──
      const fileUrls: string[] = [];
      if (submittedFiles.length > 0) {
        console.info("[candidatura] upload:start", { requestId, count: submittedFiles.length });
        for (const file of submittedFiles) {
          fileUrls.push(await uploadFile(file));
        }
        console.info("[candidatura] upload:done", { requestId, fileUrls });
      }

      // ── Phase 2: Submit (with its OWN AbortController + timeout) ──
      const submitController = new AbortController();
      const submitTimeoutId = window.setTimeout(() => {
        console.warn("[candidatura] request:timeout", { requestId, timeoutMs: SUBMIT_TIMEOUT_MS });
        submitController.abort();
      }, SUBMIT_TIMEOUT_MS);

      const payload = { ...submittedForm, tipo, file_urls: fileUrls };

      try {
        await submitCandidatura(
          {
            tipo,
            nome,
            email,
            telefono,
            comune,
            denominazione: submittedForm.denominazione || "",
            referente: submittedForm.referente_tipo || "",
            payload,
            file_url: fileUrls[0] || null,
            client_request_id: requestId,
          },
          submitController.signal,
        );
      } finally {
        // Always clear the timeout — whether success or failure
        window.clearTimeout(submitTimeoutId);
      }

      // ── Phase 3: ACCEPTED — from here, NOTHING can block user confirmation ──
      acceptedRef.current = true;
      console.info("[candidatura] submit:accepted", { requestId });

      // Show success state IMMEDIATELY (before any cleanup)
      console.info("[candidatura] success_ui:start");
      setSuccess(true);
      setError("");
      setLoading(false);

      // Hard redirect — guaranteed, independent of React lifecycle
      console.info("[candidatura] redirect:hard:start");
      try {
        window.location.assign("/");
      } catch (redirectErr) {
        console.error("[candidatura] redirect:hard:error", { redirectErr });
      }

      // Fallback: if redirect hasn't happened in 1s, show fallback UI
      fallbackTimerRef.current = window.setTimeout(() => {
        if (document.location.pathname !== "/") {
          console.warn("[candidatura] redirect:fallback_ui");
          setShowFallbackSuccess(true);
        }
        fallbackTimerRef.current = null;
      }, 1000);

      // Fire-and-forget cleanup AFTER success is guaranteed
      // NOTE: do NOT reset form here — it causes re-render issues
      // Form will be reset via resetSubmissionFlow on "Nuova candidatura"
      console.info("[candidatura] reset:deferred_to_new_submission");
    } catch (err) {
      if (!acceptedRef.current) {
        const message = err instanceof Error ? err.message : "Errore durante l'invio della candidatura.";
        console.error("[candidatura] submit:error", { requestId, err });
        setError(message);
        setLoading(false);
      } else {
        console.warn("[candidatura] submit:post_accept_error (ignored)", { requestId, err });
      }
    } finally {
      console.info("[candidatura] submit:finally", { requestId });
      isSubmittingRef.current = false;
    }
  }, [step, form, files, tipo, clearSelectedFiles]);

  const inputClass =
    "w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground transition-colors";

  if (success || showFallbackSuccess || acceptedRef.current) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-border px-6 h-14 flex items-center">
          <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer" className="-my-1">
            <img src={logoCingoli} alt="Impresa Cingoli" className="h-10" />
          </a>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-primary text-2xl font-bold">✓</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
              Candidatura inviata!
            </h1>
            <p className="text-muted-foreground text-sm mb-1">Abbiamo ricevuto la tua richiesta.</p>
            <p className="text-muted-foreground text-sm">Ti contatteremo dopo una prima valutazione tecnica.</p>
            <a
              href="/"
              className="inline-block mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold rounded tracking-wide hover:opacity-90 transition-opacity"
            >
              Torna alla home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer" className="-my-1">
            <img src={logoCingoli} alt="Impresa Cingoli" className="h-10" />
          </a>
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium tracking-wide">
            ← Home
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <form className="w-full max-w-xl" onSubmit={handleFormSubmit}>
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary block mb-1">
              Modulo di candidatura
            </span>
            <h1 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              {tipo === "proprietario" ? "Proprietario" : "Progettista"}
            </h1>
          </div>

          <div className="mb-6">
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={`text-[10px] uppercase tracking-widest font-semibold ${
                    i <= step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-xl border border-border p-6 mb-4 shadow-sm">
            {step === 0 && <Step1Anagrafica tipo={tipo} form={form} update={update} inputClass={inputClass} />}
            {step === 1 && <Step2Edificio tipo={tipo} form={form} update={update} inputClass={inputClass} />}
            {step === 2 && (
              <Step3Documenti
                tipo={tipo}
                form={form}
                update={update}
                files={files}
                setFiles={setFiles}
                inputClass={inputClass}
                fileInputRef={fileInputRef}
              />
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                className="flex items-center gap-2 border border-border text-foreground px-5 py-3 text-sm font-semibold rounded hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Indietro
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide rounded hover:opacity-90 transition-opacity"
              >
                Avanti →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleFinalSubmit()}
                disabled={loading}
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Invio in corso…" : "Invia candidatura"}
              </button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground mt-6 text-center leading-relaxed">
            Inviando questo form acconsenti al trattamento dei tuoi dati personali ai sensi del GDPR (Reg. UE 2016/679).
          </p>
        </form>
      </main>
    </div>
  );
};

export default Candidatura;
