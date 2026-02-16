import { ReactNode } from "react";

const ConditionalField = ({ show, children }: { show: boolean; children: ReactNode }) => {
  if (!show) return null;
  return <div className="pl-3 border-l-2 border-primary/20 space-y-4">{children}</div>;
};

export default ConditionalField;
