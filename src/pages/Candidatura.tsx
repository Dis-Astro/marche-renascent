import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Step1Anagrafica from "@/components/form/Step1Anagrafica";
import Step2Edificio from "@/components/form/Step2Edificio";
import Step3Documenti from "@/components/form/Step3Documenti";
import { ChevronLeft } from "lucide-react";
import logoCingoli from "@/assets/logo-cingoli.png";

export type TipoUtente = "proprietario" | "progettista";
export type FormData = Record<string, any>;

type SubmitStage = "upload" | "submit" | "";

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
const REQUEST_TIMEOUT_MS = 20000;
const SUBMIT_ENDPOINT = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/submit-candidatura`;

const withTimeout = <T,>(promise: Promise<T>, message: string): Promise<T> => {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), REQUEST_TIMEOUT_MS);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }) as Promise<T>;
};

const submitCandidatura = async (body: SubmitCandidaturaBody) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  console.info("[candidatura] request:start", {
    requestId: body.client_request_id,
    endpoint: SUBMIT_ENDPOINT,
    hasFile: Boolean(body.file_url),
    comune: body.comune,
    tipo: body.tipo,
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
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeoutId);
    console.error("[candidatura] request:network_error", {
      requestId: body.client_request_id,
      error,
    });
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Timeout durante l'invio della candidatura. Riprova.");
    }
    throw new Error("Errore di rete. Controlla la connessione e riprova.");
  }

  window.clearTimeout(timeoutId);
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
    const text = await Promise.race([
      response.text(),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      ),
    ]);
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed?.error) errorMessage = parsed.error;
    }
  } catch {
    // ignore - we already have a fallback error message
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
  const [submitStage, setSubmitStage] = useState<SubmitStage>("");

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop() || "file";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await withTimeout(
      supabase.storage.from("candidature-files").upload(path, file),
      `Timeout durante il caricamento di ${file.name}`
    );

    if (uploadErr) throw uploadErr;

    const { data: urlData } = supabase.storage
      .from("candidature-files")
      .getPublicUrl(path);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    const requestId = crypto.randomUUID();
    const nome = form.nome_referente || "";
    const email = form.email || "";
    const telefono = form.telefono || "";
    const comune = form.citta || "";

    console.info("[candidatura] submit:start", {
      requestId,
      tipo,
      files: files.length,
      comune,
      email,
    });

    if (!nome.trim() || !email.trim() || !telefono.trim() || !comune.trim()) {
      console.warn("[candidatura] submit:validation_failed", { requestId, nome, email, telefono, comune });
      setError("Per favore compila tutti i campi obbligatori: Nome, Email, Telefono e Città.");
      return;
    }

    setError("");
    setLoading(true);
    setSubmitStage(files.length > 0 ? "upload" : "submit");

    try {
      let fileUrls: string[] = [];
      if (files.length > 0) {
        console.info("[candidatura] upload:start", { requestId, count: files.length, names: files.map((file) => file.name) });
        fileUrls = await Promise.all(files.map(uploadFile));
        console.info("[candidatura] upload:done", { requestId, fileUrls });
      }
      const payload = { ...form, tipo, file_urls: fileUrls };

      setSubmitStage("submit");

      await submitCandidatura({
        tipo,
        nome,
        email,
        telefono,
        comune,
        denominazione: form.denominazione || "",
        referente: form.referente_tipo || "",
        payload,
        file_url: fileUrls[0] || null,
        client_request_id: requestId,
      });

      console.info("[candidatura] submit:success", { requestId });
      setSuccess(true);
    } catch (err: any) {
      console.error("[candidatura] submit failed", { requestId, err });
      setError(err.message || "Errore durante l'invio. Riprova.");
    } finally {
      setLoading(false);
      setSubmitStage("");
    }
  };

  const inputClass =
    "w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground transition-colors";

  if (success) {
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
            <a href="/"
              className="inline-block mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-bold rounded tracking-wide hover:opacity-90 transition-opacity">
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
        <div className="w-full max-w-xl">
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
                <span key={s}
                  className={`text-[10px] uppercase tracking-widest font-semibold ${
                    i <= step ? "text-primary" : "text-muted-foreground"
                  }`}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-xl border border-border p-6 mb-4 shadow-sm">
            {step === 0 && <Step1Anagrafica tipo={tipo} form={form} update={update} inputClass={inputClass} />}
            {step === 1 && <Step2Edificio tipo={tipo} form={form} update={update} inputClass={inputClass} />}
            {step === 2 && (
              <Step3Documenti tipo={tipo} form={form} update={update} files={files} setFiles={setFiles} inputClass={inputClass} />
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            {step > 0 ? (
              <button onClick={prev}
                className="flex items-center gap-2 border border-border text-foreground px-5 py-3 text-sm font-semibold rounded hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Indietro
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button onClick={next}
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide rounded hover:opacity-90 transition-opacity">
                Avanti →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide rounded hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading
                  ? submitStage === "upload"
                    ? "Caricamento allegati..."
                    : "Invio in corso..."
                  : "Invia candidatura"}
              </button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground mt-6 text-center leading-relaxed">
            Inviando questo form acconsenti al trattamento dei tuoi dati personali ai sensi del GDPR (Reg. UE 2016/679).
          </p>
        </div>
      </main>
    </div>
  );
};

export default Candidatura;
