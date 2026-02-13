import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TIPOLOGIE = [
  "Abitazione",
  "Palazzo storico",
  "Edificio vincolato",
  "Altro",
];

const Candidatura = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefono: "",
    comune: "",
    tipologia: "",
    descrizione: "",
    privacy: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nome || !form.email || !form.telefono || !form.comune || !form.privacy) {
      setError("Compila tutti i campi obbligatori e accetta la privacy.");
      return;
    }

    setLoading(true);

    try {
      let file_url: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("candidature-files")
          .upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage
          .from("candidature-files")
          .getPublicUrl(path);
        file_url = urlData.publicUrl;
      }

      const { error: fnErr } = await supabase.functions.invoke("submit-candidatura", {
        body: { ...form, file_url },
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
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Abbiamo ricevuto la tua richiesta.
          </h1>
          <p className="text-muted-foreground text-sm">
            Ti contatteremo dopo una prima valutazione tecnica.
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-border bg-background text-foreground px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <a href="https://impresacingoli.it" target="_blank" rel="noopener noreferrer">
          <h2 className="text-2xl font-bold text-primary tracking-tight text-center mb-1">
            Cingoli
          </h2>
        </a>
        <p className="text-xs text-muted-foreground tracking-widest uppercase text-center mb-8">
          Consolidamento – Restauro
        </p>

        <h1 className="text-xl font-bold text-foreground mb-2 text-center">
          Raccontaci il tuo caso
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Compila il form per permetterci di valutare il tuo edificio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome e Cognome *"
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
            className={inputClass}
            maxLength={100}
            required
          />
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            maxLength={255}
            required
          />
          <input
            type="tel"
            placeholder="Telefono *"
            value={form.telefono}
            onChange={(e) => update("telefono", e.target.value)}
            className={inputClass}
            maxLength={20}
            required
          />
          <input
            type="text"
            placeholder="Comune dell'edificio *"
            value={form.comune}
            onChange={(e) => update("comune", e.target.value)}
            className={inputClass}
            maxLength={100}
            required
          />
          <select
            value={form.tipologia}
            onChange={(e) => update("tipologia", e.target.value)}
            className={inputClass}
          >
            <option value="">Tipologia edificio</option>
            {TIPOLOGIE.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <textarea
            placeholder="Breve descrizione del caso"
            value={form.descrizione}
            onChange={(e) => update("descrizione", e.target.value)}
            className={`${inputClass} min-h-[100px] resize-none`}
            maxLength={2000}
          />

          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Allega foto o documenti (opzionale)
            </label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-muted-foreground"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.privacy}
              onChange={(e) => update("privacy", e.target.checked)}
              className="mt-1 accent-primary"
              required
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Acconsento al trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679). *
            </span>
          </label>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 text-base font-bold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "INVIO IN CORSO..." : "INVIA LA CANDIDATURA"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Candidatura;
