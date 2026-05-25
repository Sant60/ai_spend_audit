import type { ReactNode } from "react";

interface AuditCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const AuditCard = ({ title, subtitle, children }: AuditCardProps) => {
  return (
    <section className=" bg-white p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-bold text-black">{title}</h2>
        {subtitle ? <p className="text-sm text-black">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
};

export default AuditCard;
