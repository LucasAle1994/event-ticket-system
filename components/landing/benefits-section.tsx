import { Check } from "lucide-react";

import { LandingSection } from "@/components/landing/landing-section";
import { SectionHeading } from "@/components/landing/section-heading";

const workshopBenefits = [
  "Comprender mejor el impacto de las pantallas.",
  "Estrategias para acompañar sin perder el diálogo.",
  "Herramientas para fortalecer el vínculo familiar.",
  "Ideas para afrontar situaciones cotidianas.",
  "Recursos para establecer límites con respeto.",
  "Un espacio para hacer preguntas y compartir experiencias.",
];

function BenefitsSection() {
  return (
    <LandingSection id="benefits" className="py-14 sm:py-20 lg:py-20">
      <SectionHeading
        eyebrow="Para llevar"
        title="¿Qué te vas a llevar?"
        description="Una propuesta pensada para que la conversación siga en casa, con ideas posibles para tu realidad."
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workshopBenefits.map((benefit) => (
          <li
            key={benefit}
            className="bg-card flex gap-4 rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <Check
              aria-hidden="true"
              className="text-primary mt-0.5 size-5 shrink-0"
            />
            <span className="text-muted-foreground leading-7">{benefit}</span>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}

export { BenefitsSection };
