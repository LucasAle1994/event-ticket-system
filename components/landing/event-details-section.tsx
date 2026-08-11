import { CalendarDays, CircleDollarSign, Clock3, MapPin } from "lucide-react";

import { EventDetailCard } from "@/components/landing/event-detail-card";
import { LandingSection } from "@/components/landing/landing-section";
import { SectionHeading } from "@/components/landing/section-heading";
import { event } from "@/content/event";

function EventDetailsSection() {
  return (
    <LandingSection
      id="event-details"
      className="bg-muted/40 py-16 sm:py-20 lg:py-20"
    >
      <SectionHeading
        eyebrow="Información"
        title="Información del encuentro"
        description="Lo necesario para organizarte y reservar tu lugar con tranquilidad."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EventDetailCard
          icon={CalendarDays}
          label="Fecha"
          value={event.dateSummary}
        />
        <EventDetailCard icon={MapPin} label="Lugar" value={event.location}>
          <p>{event.city}</p>
        </EventDetailCard>
        <EventDetailCard
          icon={Clock3}
          label="Cronograma"
          value="Dos encuentros"
        >
          <div className="space-y-4">
            {event.dates.map((date) => (
              <div key={date.day}>
                <p className="text-foreground font-medium">{date.day}</p>
                <p>{`${date.time.replace(" - ", " a ")} hs`}</p>
              </div>
            ))}
          </div>
        </EventDetailCard>
        <EventDetailCard
          icon={CircleDollarSign}
          label="Valor"
          value={event.price}
        >
          <div className="space-y-2">
            <p>{event.includes}</p>
            <p>{event.capacity}.</p>
          </div>
        </EventDetailCard>
      </div>
    </LandingSection>
  );
}

export { EventDetailsSection };
