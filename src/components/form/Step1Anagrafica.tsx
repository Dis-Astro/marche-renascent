import { TipoUtente, FormData } from "@/pages/Candidatura";
import {
  REFERENTE_OPTIONS,
  VINCOLI_OPTIONS,
  TIPO_INTERVENTO,
  PROVINCE_MARCHE,
  TIPOLOGIA_IMMOBILE,
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
  if (tipo === "proprietario") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground mb-4">Anagrafica</h3>

        <InputField label="Il tuo immobile ha un nome? Dicci qual è" value={form.denominazione} onChange={(v) => update("denominazione", v)} inputClass={inputClass} required />

        <CheckboxGroup label="Che tipologia di immobile hai?" value={form.tipologia_immobile} options={TIPOLOGIA_IMMOBILE} onChange={(v) => update("tipologia_immobile", v)} required />

        <InputField label="In che Regione si trova il tuo immobile?" value={form.regione || "Marche"} onChange={(v) => update("regione", v)} inputClass={inputClass} required />

        <InputField label="In che Provincia si trova il tuo immobile?" value={form.provincia} onChange={(v) => update("provincia", v)} inputClass={inputClass} required />

        <InputField label="In che Città si trova il tuo immobile?" value={form.citta} onChange={(v) => update("citta", v)} inputClass={inputClass} required />

        <InputField label="Qual è l'indirizzo del tuo immobile?" value={form.via} onChange={(v) => update("via", v)} inputClass={inputClass} required />

        <CheckboxGroup label="Chi è il Referente del tuo immobile?" value={form.referente_tipo} options={REFERENTE_OPTIONS} onChange={(v) => update("referente_tipo", v)} required />

        <InputField label="Dicci come si chiama il referente del tuo immobile. Lo contattiamo noi" value={form.nome_referente} onChange={(v) => update("nome_referente", v)} inputClass={inputClass} required />
        <InputField label="Telefono" value={form.telefono} onChange={(v) => update("telefono", v)} inputClass={inputClass} required type="tel" />
        <InputField label="E-mail" value={form.email} onChange={(v) => update("email", v)} inputClass={inputClass} required type="email" />

        <CheckboxGroup label="Il tuo immobile è Vincolato dalla Soprintendenza?" value={form.vincoli} options={VINCOLI_OPTIONS} onChange={(v) => update("vincoli", v)} required />

        <CheckboxGroup label="Che tipo di intervento è previsto per il tuo immobile?" value={form.tipo_intervento} options={TIPO_INTERVENTO} onChange={(v) => update("tipo_intervento", v)} required />
        <ConditionalField show={form.tipo_intervento === "Altro"}>
          <InputField label="Specifica intervento" value={form.tipo_intervento_altro} onChange={(v) => update("tipo_intervento_altro", v)} inputClass={inputClass} required />
        </ConditionalField>
      </div>
    );
  }

  // Progettista path (keep existing structure)
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Anagrafica</h3>

      <InputField label="Denominazione edificio" value={form.denominazione} onChange={(v) => update("denominazione", v)} inputClass={inputClass} required />

      <InputField label="Regione" value={form.regione || "Marche"} onChange={(v) => update("regione", v)} inputClass={inputClass} required />
      <CheckboxGroup label="Provincia" value={form.provincia} options={PROVINCE_MARCHE} onChange={(v) => update("provincia", v)} required />

      <div className="grid grid-cols-2 gap-3">
        <InputField label="Città" value={form.citta} onChange={(v) => update("citta", v)} inputClass={inputClass} required />
        <InputField label="Via / Indirizzo" value={form.via} onChange={(v) => update("via", v)} inputClass={inputClass} required />
      </div>

      <CheckboxGroup label="Referente edificio" value={form.referente_tipo} options={REFERENTE_OPTIONS} onChange={(v) => update("referente_tipo", v)} required />

      <InputField label="Nome e Cognome referente" value={form.nome_referente} onChange={(v) => update("nome_referente", v)} inputClass={inputClass} required />
      <InputField label="Telefono" value={form.telefono} onChange={(v) => update("telefono", v)} inputClass={inputClass} required type="tel" />
      <InputField label="Email" value={form.email} onChange={(v) => update("email", v)} inputClass={inputClass} required type="email" />

      <CheckboxGroup label="Vincoli" value={form.vincoli} options={VINCOLI_OPTIONS} onChange={(v) => update("vincoli", v)} required />

      <CheckboxGroup label="Tipo intervento richiesto" value={form.tipo_intervento} options={TIPO_INTERVENTO} onChange={(v) => update("tipo_intervento", v)} required />
      <ConditionalField show={form.tipo_intervento === "Altro"}>
        <InputField label="Specifica intervento" value={form.tipo_intervento_altro} onChange={(v) => update("tipo_intervento_altro", v)} inputClass={inputClass} required />
      </ConditionalField>
    </div>
  );
};

export default Step1Anagrafica;
