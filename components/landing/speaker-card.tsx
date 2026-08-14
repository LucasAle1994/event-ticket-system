import { SpeakerPortrait } from "@/components/landing/speaker-portrait";

interface SpeakerCardProps {
  credentials: readonly string[];
  description: string;
  image: string;
  name: string;
}

function SpeakerCard({
  credentials,
  description,
  image,
  name,
}: SpeakerCardProps) {
  return (
    <article className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
      <SpeakerPortrait
        alt={`Retrato de ${name}`}
        className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
        image={image}
      />
      <div>
        <h3 className="text-card-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          {name}
        </h3>
        <p className="text-muted-foreground mt-6 text-base leading-8 sm:text-lg">
          {description}
        </p>
        <ul
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Formación profesional"
        >
          {credentials.map((credential) => (
            <li
              key={credential}
              className="border-border bg-card text-muted-foreground rounded-full border px-3 py-2 text-sm"
            >
              {credential}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export { SpeakerCard };
