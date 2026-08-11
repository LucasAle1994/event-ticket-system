import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

function LandingSection({ children, className, id }: LandingSectionProps) {
  return (
    <section id={id} className={cn("px-6 py-20 sm:py-28 lg:py-32", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export { LandingSection };
