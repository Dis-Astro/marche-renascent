import { TipoUtente, FormData } from "@/pages/Candidatura";
import {
  STATO_DOCUMENTO,
  STATO_AUTORIZZAZIONE,
  STATO_INCARICO,
  LIVELLI_OPERATIVITA,
} from "@/config/formFields";
import ConditionalField from "./ConditionalField";
import CollapsibleSection from "./CollapsibleSection";
import CheckboxGroup from "./CheckboxGroup";

interface Props {
  tipo: TipoUtente;
  form: FormData;
  update: (field: string, value: any) => void;
  files: File[];
  setFiles: (f: File[]) => void;
  inputClass: string;
}

const InputField = ({ label, value, onChange, inputClass, required, type = "text" }: any) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
      {!required && <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>}
    </label>
    <input type={type} value={value || ""} onChange={(e: any) => onChange(e.target.value)} className={inputClass} />
  </div>
);

const Step3Documenti = ({ tipo, form, update, files, setFiles, inputClass }: Props) => {
  const isPro = tipo === "progettista";
  const isPrivato = tipo === "proprietario";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Documenti e Autorizzazioni</h3>

      <CheckboxGroup label="Progetto" value={form.progetto} options={STATO_DOCUMENTO} onChange={(v) => update("progetto", v)} required />

      <CheckboxGroup label="Buono Contributo" value={form.buono_contributo} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("buono_contributo", v)} required />
      <ConditionalField show={form.buono_contributo === "Rilasciato"}>
        <InputField label="Data rilascio" value={form.buono_contributo_data} onChange={(v: string) => update("buono_contributo_data", v)} inputClass={inputClass} required type="date" />
        <InputField label="Importo concesso (€)" value={form.importo_concesso} onChange={(v: string) => update("importo_concesso", v)} inputClass={inputClass} required type="number" />
      </ConditionalField>

      {isPro && (
        <>
          <CheckboxGroup label="Livello operatività" value={form.livello_operativita} options={LIVELLI_OPERATIVITA} onChange={(v) => update("livello_operativita", v)} required />

          <CheckboxGroup label="Calcolo contributo massimo" value={form.calcolo_contributo} options={STATO_DOCUMENTO} onChange={(v) => update("calcolo_contributo", v)} required />
          <ConditionalField show={form.calcolo_contributo === "Fatto"}>
            <InputField label="Importo max concedibile (€)" value={form.importo_max} onChange={(v: string) => update("importo_max", v)} inputClass={inputClass} required type="number" />
          </ConditionalField>

          <CheckboxGroup label="Progetto architettonico" value={form.prog_architettonico} options={STATO_DOCUMENTO} onChange={(v) => update("prog_architettonico", v)} required />
          <CheckboxGroup label="Progetto strutturale" value={form.prog_strutturale} options={STATO_DOCUMENTO} onChange={(v) => update("prog_strutturale", v)} required />
          <CheckboxGroup label="Progetto impianti" value={form.prog_impianti} options={STATO_DOCUMENTO} onChange={(v) => update("prog_impianti", v)} required />
          <CheckboxGroup label="PSC" value={form.psc} options={STATO_DOCUMENTO} onChange={(v) => update("psc", v)} required />
          <CheckboxGroup label="Layout cantiere" value={form.layout_cantiere} options={STATO_DOCUMENTO} onChange={(v) => update("layout_cantiere", v)} required />
          <CheckboxGroup label="Cronoprogramma" value={form.cronoprogramma} options={STATO_DOCUMENTO} onChange={(v) => update("cronoprogramma", v)} required />
          <CheckboxGroup label="Computo metrico" value={form.computo} options={STATO_DOCUMENTO} onChange={(v) => update("computo", v)} required />

          <CheckboxGroup label="Autorizzazione Comune" value={form.aut_comune} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("aut_comune", v)} required />
          <ConditionalField show={form.aut_comune === "Rilasciato"}>
            <InputField label="Data rilascio" value={form.aut_comune_data} onChange={(v: string) => update("aut_comune_data", v)} inputClass={inputClass} required type="date" />
          </ConditionalField>

          <CheckboxGroup label="Autorizzazione Genio Civile" value={form.aut_genio} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("aut_genio", v)} required />
          <ConditionalField show={form.aut_genio === "Rilasciato"}>
            <InputField label="Data rilascio" value={form.aut_genio_data} onChange={(v: string) => update("aut_genio_data", v)} inputClass={inputClass} required type="date" />
          </ConditionalField>

          <CheckboxGroup label="Autorizzazione Soprintendenza" value={form.aut_soprintendenza} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("aut_soprintendenza", v)} required />
          <ConditionalField show={form.aut_soprintendenza === "Rilasciato"}>
            <InputField label="Data rilascio" value={form.aut_soprintendenza_data} onChange={(v: string) => update("aut_soprintendenza_data", v)} inputClass={inputClass} required type="date" />
          </ConditionalField>

          <h4 className="text-sm font-bold text-foreground pt-2">Incarichi professionali</h4>
          {["Progettista architettonico", "Progettista strutturale", "Progettista impianti", "Geologo", "Coordinatore sicurezza", "Direttore lavori"].map((role) => {
            const key = `incarico_${role.toLowerCase().replace(/\s/g, "_")}`;
            return (
              <CheckboxGroup key={key} label={role} value={form[key]} options={STATO_INCARICO} onChange={(v) => update(key, v)} required />
            );
          })}
        </>
      )}

      {isPrivato && (
        <CollapsibleSection title="Facoltativo (se disponibile)">
          <div className="space-y-4 pt-2">
            <CheckboxGroup label="Livello operatività" value={form.livello_operativita} options={LIVELLI_OPERATIVITA} onChange={(v) => update("livello_operativita", v)} />

            <CheckboxGroup label="Calcolo contributo massimo" value={form.calcolo_contributo} options={STATO_DOCUMENTO} onChange={(v) => update("calcolo_contributo", v)} />
            <ConditionalField show={form.calcolo_contributo === "Fatto"}>
              <InputField label="Importo max concedibile (€)" value={form.importo_max} onChange={(v: string) => update("importo_max", v)} inputClass={inputClass} required type="number" />
            </ConditionalField>

            <CheckboxGroup label="Titolo edilizio" value={form.titolo_edilizio} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("titolo_edilizio", v)} />
            <ConditionalField show={form.titolo_edilizio === "Rilasciato"}>
              <InputField label="Data rilascio" value={form.titolo_edilizio_data} onChange={(v: string) => update("titolo_edilizio_data", v)} inputClass={inputClass} required type="date" />
            </ConditionalField>

            <CheckboxGroup label="Genio Civile" value={form.genio_civile} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("genio_civile", v)} />
            <ConditionalField show={form.genio_civile === "Rilasciato"}>
              <InputField label="Data rilascio" value={form.genio_civile_data} onChange={(v: string) => update("genio_civile_data", v)} inputClass={inputClass} required type="date" />
            </ConditionalField>

            <CheckboxGroup label="Soprintendenza" value={form.soprintendenza} options={STATO_AUTORIZZAZIONE} onChange={(v) => update("soprintendenza", v)} />
            <ConditionalField show={form.soprintendenza === "Rilasciato"}>
              <InputField label="Data rilascio" value={form.soprintendenza_data} onChange={(v: string) => update("soprintendenza_data", v)} inputClass={inputClass} required type="date" />
            </ConditionalField>

            <h4 className="text-sm font-bold text-foreground">Incarichi professionali</h4>
            {["Progettista", "Geologo", "Coordinatore sicurezza", "Direttore lavori"].map((role) => {
              const key = `incarico_${role.toLowerCase().replace(/\s/g, "_")}`;
              return (
                <CheckboxGroup key={key} label={role} value={form[key]} options={STATO_INCARICO} onChange={(v) => update(key, v)} />
              );
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Allegati */}
      <div className="pt-4">
        <label className="text-xs font-semibold text-foreground block mb-1">
          Allegati (foto, documenti) <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>
        </label>
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="text-sm text-muted-foreground"
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{files.length} file selezionati</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1">
          Note finali <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>
        </label>
        <textarea
          value={form.note || ""}
          onChange={(e) => update("note", e.target.value)}
          className={`${inputClass} min-h-[80px] resize-none`}
          placeholder="Informazioni aggiuntive..."
        />
      </div>
    </div>
  );
};

export default Step3Documenti;
