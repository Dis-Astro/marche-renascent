import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Step1Anagrafica from "@/components/form/Step1Anagrafica";
import Step2Edificio from "@/components/form/Step2Edificio";
import Step3Documenti from "@/components/form/Step3Documenti";

export type TipoUtente = "privato" | "professionista";
export type FormData = Record<string, any>;

const STEPS = ["Anagrafica", "Edificio", "Documenti"];

const Candidatura = () => {
  const [searchParams] = useSearchParams();
  const initialTipo = (searchParams.get("tipo") as TipoUtente) || "privato";

  const [tipo, setTipo] = useState<TipoUtente>(initialTipo);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = searchParams.get("tipo") as TipoUtente;
    if (t === "privato" || t === "professionista") setTipo(t);
  }, [searchParams]);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Upload files
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

      const payload = {
        ...form,
        tipo,
        file_urls: fileUrls,
      };

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

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary text-xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Candidatura inviata
          </h1>
          <p className="text-muted-foreground text-sm mb-2">
            Abbiamo ricevuto la tua richiesta.
          </p>
          <p className="text-muted-foreground text-sm">
            Ti contatteremo dopo una prima valutazione tecnica.
          </p>
          <a
            href="/"
            className="inline-block mt-8 text-primary text-sm font-semibold underline underline-offset-4"
          >
            Torna alla home
          </a>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h2 className="text-2xl font-bold text-primary tracking-tight text-center mb-1">
            Cingoli
          </h2>
        </a>
        <p className="text-xs text-muted-foreground tracking-widest uppercase text-center mb-6">
          Consolidamento – Restauro
        </p>

        {/* Segment control */}
        <div className="flex border border-border mb-6">
          {(["privato", "professionista"] as TipoUtente[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTipo(t); setStep(0); }}
              className={`flex-1 py-3 text-[13px] font-bold tracking-[0.1em] uppercase transition-colors ${
                tipo === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {t === "privato" ? "Privato" : "Professionista"}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1 ${
                  i <= step ? "bg-primary" : "bg-border"
                } transition-colors`}
              />
              <span
                className={`text-[10px] uppercase tracking-widest ${
                  i <= step ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 0 && (
          <Step1Anagrafica
            tipo={tipo}
            form={form}
            update={update}
            inputClass={inputClass}
          />
        )}
        {step === 1 && (
          <Step2Edificio
            tipo={tipo}
            form={form}
            update={update}
            inputClass={inputClass}
          />
        )}
        {step === 2 && (
          <Step3Documenti
            tipo={tipo}
            form={form}
            update={update}
            files={files}
            setFiles={setFiles}
            inputClass={inputClass}
          />
        )}

        {error && <p className="text-destructive text-sm mt-4">{error}</p>}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 gap-4">
          {step > 0 ? (
            <button
              onClick={prev}
              className="border border-border text-foreground px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Indietro
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button
              onClick={next}
              className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide hover:opacity-90 transition-opacity"
            >
              Avanti
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Invio..." : "Invia candidatura"}
            </button>
          )}
        </div>

        {/* Privacy */}
        <p className="text-[10px] text-muted-foreground mt-6 text-center leading-relaxed">
          Inviando questo form acconsenti al trattamento dei tuoi dati personali ai sensi del GDPR (Reg. UE 2016/679).
        </p>
      </div>
    </div>
  );
};

export default Candidatura;
