import { existsSync } from "node:fs";
import { join } from "node:path";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface SpeakerPortraitProps {
  alt: string;
  className?: string;
  image: string;
  priority?: boolean;
}

function SpeakerPortrait({
  alt,
  className,
  image,
  priority = false,
}: SpeakerPortraitProps) {
  const assetPath = join(process.cwd(), "public", image.replace(/^\//, ""));
  const hasImage = existsSync(assetPath);

  return (
    <div
      className={cn(
        "bg-card shadow-background/60 relative aspect-[4/5] overflow-hidden rounded-3xl border shadow-xl",
        className,
      )}
    >
      {hasImage ? (
        <Image
          fill
          priority={priority}
          alt={alt}
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, 90vw"
          src={image}
        />
      ) : (
        <div
          aria-label={`Espacio reservado para ${alt.toLocaleLowerCase("es-AR")}`}
          className="flex size-full flex-col items-center justify-center bg-[radial-gradient(circle_at_center,var(--accent),transparent_65%)] text-center"
          role="img"
        >
          <span className="border-border bg-background/60 text-primary flex size-20 items-center justify-center rounded-full border text-xl font-semibold">
            NF
          </span>
        </div>
      )}
    </div>
  );
}

export { SpeakerPortrait };
