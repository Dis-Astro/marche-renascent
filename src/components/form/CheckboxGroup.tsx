import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
}

const CheckboxGroup = ({ label, value, options, onChange, required }: CheckboxGroupProps) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-2">
      {label} {required && <span className="text-primary">*</span>}
      {!required && <span className="text-[10px] text-primary/60 ml-1">Facoltativo</span>}
    </label>
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 cursor-pointer text-sm text-foreground"
        >
          <Checkbox
            checked={value === option}
            onCheckedChange={() => onChange(value === option ? "" : option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default CheckboxGroup;
