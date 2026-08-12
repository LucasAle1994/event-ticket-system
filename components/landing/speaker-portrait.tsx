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
        "relative mx-auto aspect-square w-full max-w-md",
        className,
      )}
    >
      {/* Golden glow */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[#F5B84B]/20 blur-3xl"
      />

      {/* Decorative rings */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 400 400"
        fill="none"
      >
        {/* Thin outer ring */}
        <circle
          cx="200"
          cy="200"
          r="187"
          stroke="#F5B84B"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="520 28"
          strokeLinecap="round"
        />

        {/* Main golden arc */}
        <circle
          cx="200"
          cy="200"
          r="174"
          stroke="#F5B84B"
          strokeWidth="2.5"
          strokeDasharray="520 55"
          strokeLinecap="round"
          transform="rotate(-42 200 200)"
        />

        {/* Dotted decorative arc */}
        <circle
          cx="200"
          cy="200"
          r="164"
          stroke="#F5B84B"
          strokeOpacity="0.65"
          strokeWidth="1.5"
          strokeDasharray="1 9"
          strokeLinecap="round"
          strokeDashoffset="4"
          transform="rotate(135 200 200)"
        />
      </svg>

      {/* Decorative golden points */}
      {/* Decorative stars */}
      <span
        aria-hidden="true"
        className="absolute top-[24%] left-[5%] text-2xl leading-none text-[#F5B84B] drop-shadow-[0_0_12px_rgba(245,184,75,0.75)]"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="absolute top-[14%] right-[7%] text-3xl leading-none text-[#F5B84B] drop-shadow-[0_0_16px_rgba(245,184,75,0.8)]"
      >
        ✦
      </span>

      <span
        aria-hidden="true"
        className="absolute right-[5%] bottom-[25%] text-lg leading-none text-[#F5B84B] drop-shadow-[0_0_10px_rgba(245,184,75,0.7)]"
      >
        ✦
      </span>

      {/* Portrait */}
      <div className="bg-card absolute inset-[9%] overflow-hidden rounded-full border-2 border-[#F5B84B]/90 shadow-[0_0_45px_rgba(245,184,75,0.28)]">
        {hasImage ? (
          <Image
            fill
            priority={priority}
            alt={alt}
            className="object-cover"
            sizes="(min-width: 1024px) 35vw, 80vw"
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
    </div>
  );
}

export { SpeakerPortrait };
