import { LandingSection } from "@/components/landing/landing-section";

function CtaSection() {
  return (
    <LandingSection id="registration">
      <div className="bg-primary text-primary-foreground rounded-3xl px-6 py-12 sm:px-12 sm:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] uppercase opacity-80">
            Inscripción
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Reservá tu lugar
          </h2>
          <p className="mt-4 text-base leading-7 opacity-85 sm:text-lg">
            Completá tus datos y nos pondremos en contacto para confirmar tu
            inscripción. Una vez registrada, recibirás tu entrada digital por
            WhatsApp.
          </p>
          <div className="border-primary-foreground/30 bg-background/10 mt-8 rounded-2xl border p-6">
            <p className="font-semibold">Formulario de inscripción</p>
            <p className="mt-2 text-sm leading-6 opacity-85">
              Este espacio estará disponible en el Sprint 003.
            </p>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}

export { CtaSection };
