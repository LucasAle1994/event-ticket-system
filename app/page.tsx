import { AboutSection } from "@/components/landing/about-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { EventDetailsSection } from "@/components/landing/event-details-section";
import { HeroSection } from "@/components/landing/hero-section";
import { Navigation } from "@/components/landing/navigation";
import { SiteFooter } from "@/components/landing/site-footer";
import { SpeakersSection } from "@/components/landing/speakers-section";
import { RegistrationModal } from "@/components/registration-modal";

export default function HomePage() {
  return (
    <div id="top" className="bg-background min-h-screen overflow-x-clip">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SpeakersSection />
        <BenefitsSection />
        <EventDetailsSection />
      </main>
      <SiteFooter />
      <RegistrationModal />
    </div>
  );
}
