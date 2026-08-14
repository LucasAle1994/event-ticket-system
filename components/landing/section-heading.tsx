interface SectionHeadingProps {
  description: string;
  eyebrow: string;
  title: string;
}

function SectionHeading({ description, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-5 text-base leading-8 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

export { SectionHeading };
