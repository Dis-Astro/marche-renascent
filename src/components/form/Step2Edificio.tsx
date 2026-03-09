import { TipoUtente, FormData } from "@/pages/Candidatura";
import {
  CLASSIFICAZIONE_UBICATIVA_PROP,
  TIPOLOGIA_STRUTTURA_PROP,
  CLASSIFICAZIONE_UBICATIVA,
  TIPOLOGIA_STRUTTURA,
  TIPOLOGIA_ORIZZONTAMENTI,
  TIPOLOGIA_COPERTURA,
} from "@/config/formFields";
import ConditionalField from "./ConditionalField";
import CheckboxGroup from "./CheckboxGroup";

interface Props {
  tipo: TipoUtente;
  form: FormData;
  update: (field: string, value: any) => void;
  inputClass: string;
}

const InputField = ({ label, value, onChange, inputClass, required, type = "text", placeholder }: any) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
      {!required && <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>}
    </label>
    <input type={type} value={value || ""} onChange={(e: any) => onChange(e.target.value)} className={inputClass} placeholder={placeholder} />
  </div>
);

const Step2Edificio = ({ tipo, form, update, inputClass }: Props) => {
  if (tipo === "proprietario") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground mb-4">Edificio</h3>

        <CheckboxGroup label="Che tipo di edificio hai?" value={form.class_ubicativa} options={CLASSIFICAZIONE_UBICATIVA_PROP} onChange={(v) => update("class_ubicativa", v)} required />
        <ConditionalField show={form.class_ubicativa === "Altro"}>
          <InputField label="Specifica" value={form.class_ubicativa_altro} onChange={(v: string) => update("class_ubicativa_altro", v)} inputClass={inputClass} required />
        </ConditionalField>

        <InputField label="Quale è la superficie totale del tuo edificio? Indica la somma di tutte le superfici di tutti i piani compresi i muri (superficie lorda totale comprese le pertinenze)" value={form.superficie} onChange={(v: string) => update("superficie", v)} inputClass={inputClass} required type="number" />

        <InputField label="Quante unità immobiliari ha il tuo edificio?" value={form.unita_immobiliari} onChange={(v: string) => update("unita_immobiliari", v)} inputClass={inputClass} required type="number" />

        <InputField label="Se il tuo edificio ha delle pertinenze, indica la superficie totale delle pertinenze compresi i muri che hai inserito nel conteggio fatto sopra (superficie lorda delle sole pertinenze)" value={form.pertinenze} onChange={(v: string) => update("pertinenze", v)} inputClass={inputClass} required type="number" />

        <CheckboxGroup label="Che struttura portante ha il tuo edificio?" value={form.tipo_struttura} options={TIPOLOGIA_STRUTTURA_PROP} onChange={(v) => update("tipo_struttura", v)} />
        <ConditionalField show={form.tipo_struttura === "Altro"}>
          <InputField label="Specifica struttura" value={form.tipo_struttura_altro} onChange={(v: string) => update("tipo_struttura_altro", v)} inputClass={inputClass} required />
        </ConditionalField>
      </div>
    );
  }

  // Progettista path
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Edificio</h3>

      <CheckboxGroup label="Classificazione ubicativa" value={form.class_ubicativa} options={CLASSIFICAZIONE_UBICATIVA} onChange={(v) => update("class_ubicativa", v)} required />
      <ConditionalField show={form.class_ubicativa === "Altro"}>
        <InputField label="Specifica" value={form.class_ubicativa_altro} onChange={(v: string) => update("class_ubicativa_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <InputField label="Superficie lorda (mq)" value={form.superficie} onChange={(v: string) => update("superficie", v)} inputClass={inputClass} required type="number" />
      <InputField label="Unità immobiliari" value={form.unita_immobiliari} onChange={(v: string) => update("unita_immobiliari", v)} inputClass={inputClass} required type="number" />
      <InputField label="Pertinenze" value={form.pertinenze} onChange={(v: string) => update("pertinenze", v)} inputClass={inputClass} required type="number" />

      <CheckboxGroup label="Tipologia struttura portante" value={form.tipo_struttura} options={TIPOLOGIA_STRUTTURA} onChange={(v) => update("tipo_struttura", v)} required />
      <ConditionalField show={form.tipo_struttura === "Altro"}>
        <InputField label="Specifica struttura" value={form.tipo_struttura_altro} onChange={(v: string) => update("tipo_struttura_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <InputField label="Area circostante edificio" value={form.area_circostante} onChange={(v: string) => update("area_circostante", v)} inputClass={inputClass} required />

      <CheckboxGroup label="Tipologia orizzontamenti" value={form.tipo_orizzontamenti} options={TIPOLOGIA_ORIZZONTAMENTI} onChange={(v) => update("tipo_orizzontamenti", v)} required />
      <ConditionalField show={form.tipo_orizzontamenti === "Altro"}>
        <InputField label="Specifica" value={form.tipo_orizzontamenti_altro} onChange={(v: string) => update("tipo_orizzontamenti_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <CheckboxGroup label="Tipologia copertura" value={form.tipo_copertura} options={TIPOLOGIA_COPERTURA} onChange={(v) => update("tipo_copertura", v)} required />
      <ConditionalField show={form.tipo_copertura === "Altro"}>
        <InputField label="Specifica" value={form.tipo_copertura_altro} onChange={(v: string) => update("tipo_copertura_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <CheckboxGroup label="Scheda FAST / AEDES" value={form.fast_aedes} options={["Sì", "No", "Da verificare"]} onChange={(v) => update("fast_aedes", v)} required />
      <CheckboxGroup label="Visure / Planimetrie disponibili" value={form.visure} options={["Sì", "No", "Parzialmente"]} onChange={(v) => update("visure", v)} required />
      <CheckboxGroup label="Rilievo / Quadro fessurativo" value={form.rilievo} options={["Fatto", "Da fare", "Parziale"]} onChange={(v) => update("rilievo", v)} required />
    </div>
  );
};

export default Step2Edificio;
