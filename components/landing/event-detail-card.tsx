import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EventDetailCardProps {
  children?: ReactNode;
  icon: LucideIcon;
  label: string;
  value: string;
}

function EventDetailCard({
  children,
  icon: Icon,
  label,
  value,
}: EventDetailCardProps) {
  return (
    <article className="bg-card rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-1">
      <Icon aria-hidden="true" className="text-primary size-5" />
      <p className="text-muted-foreground mt-5 text-sm font-medium">{label}</p>
      <p className="text-card-foreground mt-2 text-lg font-semibold">{value}</p>
      {children ? (
        <div className="text-muted-foreground mt-3 text-sm leading-6">
          {children}
        </div>
      ) : null}
    </article>
  );
}

export { EventDetailCard };
