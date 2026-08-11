import { event } from "@/content/event";
import { speaker } from "@/content/speaker";

function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t px-6 py-10">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground font-semibold">{event.title}</p>
          <p className="mt-1">{`${event.location}, ${event.city}`}</p>
        </div>
        <div className="flex items-center gap-4">
          {speaker.instagram ? (
            <a
              href={speaker.instagram}
              aria-label="Instagram de Natalia Farfán Pertussi"
              className="hover:text-primary focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Instagram
            </a>
          ) : null}
          {speaker.whatsapp ? (
            <a
              href={speaker.whatsapp}
              aria-label="WhatsApp de Natalia Farfán Pertussi"
              className="hover:text-primary focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              WhatsApp
            </a>
          ) : null}
          <p>{`© ${currentYear}`}</p>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
