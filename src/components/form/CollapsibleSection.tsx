import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

const CollapsibleSection = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border mt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-xs font-bold text-primary uppercase tracking-wide">{title}</span>
        <ChevronDown className={`w-4 h-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
