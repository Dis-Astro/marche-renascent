import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Step1Anagrafica from "@/components/form/Step1Anagrafica";
import Step2Edificio from "@/components/form/Step2Edificio";
import Step3Documenti from "@/components/form/Step3Documenti";
import { ChevronLeft } from "lucide-react";
import logoCingoli from "@/assets/logo-cingoli.png";

export type TipoUtente = "proprietario" | "progettista";
export type FormData = Record<string, any>;

const STEPS = ["Anagrafica", "Edificio", "Documenti"];

const Candidatura = () => {
  const [searchParams] = useSearchParams();
  const initialTipo = (searchParams.get("tipo") as TipoUtente) || "proprietario";

  const [tipo, setTipo] = useState<TipoUtente>(initialTipo);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = searchParams.get("tipo") as TipoUtente;
    if (t === "proprietario" || t === "progettista") setTipo(t);
  }, [searchParams]);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const fileUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("candidature-files")
          .upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from("candidature-files")
          .getPublicUrl(path);
        fileUrls.push(urlData.publicUrl);
      }

      const payload = { ...form, tipo, file_urls: fileUrls };

      const { error: fnErr } = await supabase.functions.invoke("submit-candidatura", {
        body: {
          tipo,
          nome: form.nome_cognome || form.referente_nome || "",
          email: form.email || "",
          telefono: form.telefono || "",
          comune: form.citta || "",
          denominazione: form.denominazione || "",
          referente: form.referente_tipo || "",
          payload,
          file_url: fileUrls[0] || null,
        },
      });

      if (fnErr) throw fnErr;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Errore durante l'invio.");
    } finally {
      setLoading(false);
    }
  };

  /* ── INPUT CLASS ── */
  const inputClass =
    "w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground transition-colors";

  /* ── SUCCESS ── */
  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navbar */}
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
      {/* ── NAVBAR ── */}
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

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xl">

          {/* Title */}
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary block mb-1">
              Modulo di candidatura
            </span>
            <h1 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
              Valutazione gratuita
            </h1>
          </div>

          {/* ── SEGMENT CONTROL ── */}
          <div className="flex border border-border rounded overflow-hidden mb-6 shadow-sm">
            {(["privato", "professionista"] as TipoUtente[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTipo(t); setStep(0); }}
                className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${
                  tipo === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                {t === "privato" ? "Privato" : "Professionista"}
              </button>
            ))}
          </div>

          {/* ── PROGRESS ── */}
          <div className="mb-6">
            {/* Bar */}
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step labels */}
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

          {/* ── STEP CARD ── */}
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

          {/* ── NAVIGATION ── */}
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
                {loading ? "Invio in corso..." : "Invia candidatura"}
              </button>
            )}
          </div>

          {/* Privacy */}
          <p className="text-[10px] text-muted-foreground mt-6 text-center leading-relaxed">
            Inviando questo form acconsenti al trattamento dei tuoi dati personali ai sensi del GDPR (Reg. UE 2016/679).
          </p>
        </div>
      </main>
    </div>
  );
};

export default Candidatura;
