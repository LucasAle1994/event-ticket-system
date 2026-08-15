import Image from "next/image";

import { Button } from "@/components/ui/button";
import { event } from "@/content/event";

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-30 lg:pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_top_left,var(--primary),transparent_32%),radial-gradient(circle_at_85%_20%,var(--accent),transparent_28%)] opacity-20"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">

        {/* CONTENIDO */}
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="max-w-4xl">
            <p className="text-accent text-sm font-semibold tracking-[0.16em] uppercase">
              Taller para padres
            </p>

            <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight uppercase sm:text-6xl lg:text-7xl">
              {event.title}
            </h1>

            <p className="text-primary mt-5 max-w-2xl text-xl leading-8 font-medium sm:text-2xl">
              {event.subtitle}
            </p>

            <p className="text-muted-foreground mt-6 max-w-3xl text-base leading-8 sm:text-lg">
              {event.description}
            </p>
          </div>

          {/* IMAGEN EN MOBILE:
              aparece inmediatamente después de la descripción.
              En desktop se posiciona en la columna derecha. */}
          <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-3xl lg:hidden">
            <Image
              fill
              priority
              alt="Una familia intenta conversar mientras su hijo adolescente está distraído con el teléfono"
              className="object-cover"
              sizes="90vw"
              src="/images/hero-family.webp"
            />
          </div>

          {/* ACCIONES + INFORMACIÓN */}
          <div className="mt-8 lg:mt-10">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                aria-haspopup="dialog"
                data-registration-trigger="true"
                size="lg"
                type="button"
                className="cursor-pointer"
              >
                Reservar mi lugar
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer"
              >
                <a href="#about">Conocer el taller</a>
              </Button>
            </div>
          </div>

          <dl className="border-border bg-card mt-6 grid overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4 lg:mt-12">
            <div className="border-border border-b p-5 sm:border-r lg:border-b-0">
              <dt className="text-muted-foreground text-sm">Fechas</dt>
              <dd className="text-foreground mt-2 font-medium">
                {event.dateSummary}
              </dd>
            </div>

            <div className="border-border border-b p-5 lg:border-r lg:border-b-0">
              <dt className="text-muted-foreground text-sm">Lugar</dt>
              <dd className="text-foreground mt-2 font-medium">
                {event.location}
              </dd>
            </div>

            <div className="border-border border-b p-5 sm:border-r sm:border-b-0 lg:border-r">
              <dt className="text-muted-foreground text-sm">Ciudad</dt>
              <dd className="text-foreground mt-2 font-medium">
                {event.city}
              </dd>
            </div>

            <div className="p-5">
              <dt className="text-muted-foreground text-sm">Valor</dt>
              <dd className="text-primary mt-2 font-semibold">
                {event.price}
              </dd>
            </div>
          </dl>
        </div>

        {/* IMAGEN DESKTOP */}
        <div className="relative hidden aspect-[3/2] overflow-hidden rounded-3xl lg:col-start-2 lg:row-start-1 lg:block lg:translate-y-32">
          <Image
            fill
            priority
            alt="Una familia intenta conversar mientras su hijo adolescente está distraído con el teléfono"
            className="object-cover"
            sizes="44vw"
            src="/images/hero-family.webp"
          />
        </div>
      </div>
    </section>
  );
}

export { HeroSection };