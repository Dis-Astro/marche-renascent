import { TipoUtente, FormData } from "@/pages/Candidatura";
import {
  FORME_GIURIDICHE,
  REFERENTE_OPTIONS,
  VINCOLI_OPTIONS,
  CONTESTO_NORMATIVO,
  TIPO_INTERVENTO,
  PROVINCE_MARCHE,
} from "@/config/formFields";
import ConditionalField from "./ConditionalField";
import CheckboxGroup from "./CheckboxGroup";

interface Props {
  tipo: TipoUtente;
  form: FormData;
  update: (field: string, value: any) => void;
  inputClass: string;
}

const InputField = ({
  label,
  value,
  onChange,
  inputClass,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputClass: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
      {!required && <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      placeholder={placeholder}
    />
  </div>
);

const Step1Anagrafica = ({ tipo, form, update, inputClass }: Props) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Anagrafica</h3>

      <InputField label="Denominazione edificio" value={form.denominazione} onChange={(v) => update("denominazione", v)} inputClass={inputClass} required />

      <CheckboxGroup label="Forma giuridica" value={form.forma_giuridica} options={FORME_GIURIDICHE} onChange={(v) => update("forma_giuridica", v)} required />
      <ConditionalField show={form.forma_giuridica === "Altro"}>
        <InputField label="Specifica forma giuridica" value={form.forma_giuridica_altro} onChange={(v) => update("forma_giuridica_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <div className="grid grid-cols-2 gap-3">
        <InputField label="Regione" value={form.regione || "Marche"} onChange={(v) => update("regione", v)} inputClass={inputClass} required />
        <CheckboxGroup label="Provincia" value={form.provincia} options={PROVINCE_MARCHE} onChange={(v) => update("provincia", v)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Città" value={form.citta} onChange={(v) => update("citta", v)} inputClass={inputClass} required />
        <InputField label="Via / Indirizzo" value={form.via} onChange={(v) => update("via", v)} inputClass={inputClass} required />
      </div>

      <CheckboxGroup label="Referente edificio" value={form.referente_tipo} options={REFERENTE_OPTIONS} onChange={(v) => update("referente_tipo", v)} required />
      <ConditionalField show={form.referente_tipo === "Altro"}>
        <InputField label="Specifica referente" value={form.referente_altro} onChange={(v) => update("referente_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <InputField label="Nome e Cognome referente" value={form.nome_cognome} onChange={(v) => update("nome_cognome", v)} inputClass={inputClass} required />
      <InputField label="Telefono" value={form.telefono} onChange={(v) => update("telefono", v)} inputClass={inputClass} required type="tel" />
      <InputField label="Email" value={form.email} onChange={(v) => update("email", v)} inputClass={inputClass} required type="email" />

      <CheckboxGroup label="Vincoli" value={form.vincoli} options={VINCOLI_OPTIONS} onChange={(v) => update("vincoli", v)} required />
      <ConditionalField show={form.vincoli === "Presenti"}>
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Descrizione vincoli <span className="text-primary">*</span>
          </label>
          <textarea
            value={form.vincoli_desc || ""}
            onChange={(e) => update("vincoli_desc", e.target.value)}
            className={`${inputClass} min-h-[80px] resize-none`}
          />
        </div>
      </ConditionalField>

      <CheckboxGroup label="Contesto normativo" value={form.contesto_normativo} options={CONTESTO_NORMATIVO} onChange={(v) => update("contesto_normativo", v)} required />
      <ConditionalField show={form.contesto_normativo === "Altro"}>
        <InputField label="Specifica contesto" value={form.contesto_altro} onChange={(v) => update("contesto_altro", v)} inputClass={inputClass} required />
      </ConditionalField>

      <CheckboxGroup label="Tipo intervento richiesto" value={form.tipo_intervento} options={TIPO_INTERVENTO} onChange={(v) => update("tipo_intervento", v)} required />
      <ConditionalField show={form.tipo_intervento === "Altro"}>
        <InputField label="Specifica intervento" value={form.tipo_intervento_altro} onChange={(v) => update("tipo_intervento_altro", v)} inputClass={inputClass} required />
      </ConditionalField>
    </div>
  );
};

export default Step1Anagrafica;
