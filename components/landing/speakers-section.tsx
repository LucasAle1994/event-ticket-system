import { LandingSection } from "@/components/landing/landing-section";
import { SectionHeading } from "@/components/landing/section-heading";
import { SpeakerCard } from "@/components/landing/speaker-card";
import { speaker } from "@/content/speaker";

function SpeakersSection() {
  return (
    <LandingSection
      id="speakers"
      className="bg-muted/40 py-20 sm:py-24 lg:py-20"
    >
      <SectionHeading
        eyebrow="Disertante"
        title="Conocé a la disertante"
        description="Una mirada cercana, con experiencia y respeto por cada historia familiar."
      />
      <div className="mt-10 sm:mt-12">
        <SpeakerCard
          credentials={speaker.credentials}
          description={speaker.bio}
          image={speaker.image}
          name={speaker.name}
        />
      </div>
    </LandingSection>
  );
}

export { SpeakersSection };
