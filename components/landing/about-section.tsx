import { LandingSection } from "@/components/landing/landing-section";
import { SectionHeading } from "@/components/landing/section-heading";

const workshopReasons = [
  {
    description:
      "Muchas veces, detrás de un comportamiento hay algo que necesita ser escuchado.",
    title: "Comprender antes de reaccionar",
  },
  {
    description:
      "Herramientas para poner límites sin dejar de construir confianza.",
    title: "Acompañar sin perder el vínculo",
  },
  {
    description:
      "Una mirada clara sobre cómo influyen en el desarrollo, el aprendizaje y la vida familiar.",
    title: "Entender el impacto de las pantallas",
  },
  {
    description:
      "Ideas prácticas que podés empezar a aplicar desde el primer día.",
    title: "Herramientas para la vida cotidiana",
  },
];

function AboutSection() {
  return (
    <LandingSection id="about" className="py-16 sm:py-20 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="El taller"
          title="¿Por qué este taller puede ayudarte?"
          description="No hay recetas rápidas para criar. Sí puede haber un espacio para pensar con más calma y sentirte acompañada o acompañado."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {workshopReasons.map((reason) => (
            <article
              key={reason.title}
              className="bg-card rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <h3 className="text-card-foreground text-lg font-semibold">
                {reason.title}
              </h3>
              <p className="text-muted-foreground mt-3 leading-7">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}

export { AboutSection };
