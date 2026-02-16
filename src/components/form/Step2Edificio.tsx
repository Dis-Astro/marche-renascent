import { TipoUtente, FormData } from "@/pages/Candidatura";
import {
  CLASSIFICAZIONE_UBICATIVA,
  TIPOLOGIA_STRUTTURA,
  TIPOLOGIA_ORIZZONTAMENTI,
  TIPOLOGIA_COPERTURA,
} from "@/config/formFields";
import ConditionalField from "./ConditionalField";

interface Props {
  tipo: TipoUtente;
  form: FormData;
  update: (field: string, value: any) => void;
  inputClass: string;
}

const SelectField = ({ label, value, options, onChange, inputClass, required }: any) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
      {!required && <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>}
    </label>
    <select value={value || ""} onChange={(e: any) => onChange(e.target.value)} className={inputClass}>
      <option value="">Seleziona...</option>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

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
  const isPro = tipo === "professionista";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Edificio</h3>

      <SelectField label="Classificazione ubicativa" value={form.class_ubicativa} options={CLASSIFICAZIONE_UBICATIVA} onChange={(v: string) => update("class_ubicativa", v)} inputClass={inputClass} required />
      <ConditionalField show={form.class_ubicativa === "Altro"}>
        <InputField label="Specifica" value={form.class_ubicativa_altro} onChange={(v: string) => update("class_ubicativa_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <InputField label="Superficie lorda (mq)" value={form.superficie} onChange={(v: string) => update("superficie", v)} inputClass={inputClass} required type="number" />
      <InputField label="Unità immobiliari" value={form.unita_immobiliari} onChange={(v: string) => update("unita_immobiliari", v)} inputClass={inputClass} required type="number" />
      <InputField label="Pertinenze" value={form.pertinenze} onChange={(v: string) => update("pertinenze", v)} inputClass={inputClass} required type="number" />

      <SelectField label="Tipologia struttura portante" value={form.tipo_struttura} options={TIPOLOGIA_STRUTTURA} onChange={(v: string) => update("tipo_struttura", v)} inputClass={inputClass} required />
      <ConditionalField show={form.tipo_struttura === "Altro"}>
        <InputField label="Specifica struttura" value={form.tipo_struttura_altro} onChange={(v: string) => update("tipo_struttura_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      {/* Professionista-only fields */}
      {isPro && (
        <>
          <InputField label="Area circostante edificio" value={form.area_circostante} onChange={(v: string) => update("area_circostante", v)} inputClass={inputClass} required />

          <SelectField label="Tipologia orizzontamenti" value={form.tipo_orizzontamenti} options={TIPOLOGIA_ORIZZONTAMENTI} onChange={(v: string) => update("tipo_orizzontamenti", v)} inputClass={inputClass} required />
          <ConditionalField show={form.tipo_orizzontamenti === "Altro"}>
            <InputField label="Specifica" value={form.tipo_orizzontamenti_altro} onChange={(v: string) => update("tipo_orizzontamenti_altro", v)} inputClass={inputClass} required />
          </ConditionalField>

          <SelectField label="Tipologia copertura" value={form.tipo_copertura} options={TIPOLOGIA_COPERTURA} onChange={(v: string) => update("tipo_copertura", v)} inputClass={inputClass} required />
          <ConditionalField show={form.tipo_copertura === "Altro"}>
            <InputField label="Specifica" value={form.tipo_copertura_altro} onChange={(v: string) => update("tipo_copertura_altro", v)} inputClass={inputClass} required />
          </ConditionalField>

          <SelectField label="Scheda FAST / AEDES" value={form.fast_aedes} options={["Sì", "No", "Da verificare"]} onChange={(v: string) => update("fast_aedes", v)} inputClass={inputClass} required />

          <SelectField label="Visure / Planimetrie disponibili" value={form.visure} options={["Sì", "No", "Parzialmente"]} onChange={(v: string) => update("visure", v)} inputClass={inputClass} required />

          <SelectField label="Rilievo / Quadro fessurativo" value={form.rilievo} options={["Fatto", "Da fare", "Parziale"]} onChange={(v: string) => update("rilievo", v)} inputClass={inputClass} required />
        </>
      )}
    </div>
  );
};

export default Step2Edificio;
