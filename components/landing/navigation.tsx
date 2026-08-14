"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "#about", label: "Sobre el taller" },
  { href: "#speakers", label: "Disertante" },
  { href: "#event-details", label: "Información" },
];

function Navigation() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateNavigation = () => setHasScrolled(window.scrollY > 12);

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });

    return () => window.removeEventListener("scroll", updateNavigation);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 -mb-16 border-b transition-colors duration-200",
        hasScrolled
          ? "border-border bg-background/95 backdrop-blur"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="text-foreground text-sm font-semibold tracking-[0.2em] uppercase"
        >
          El Arte de Criar
        </a>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button
                aria-haspopup="dialog"
                data-registration-trigger="true"
                type="button"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Inscribirme
              </button>
            </li>
          </ul>
        </nav>

        <Button
          aria-haspopup="dialog"
          data-registration-trigger="true"
          size="sm"
          type="button"
        >
          Inscribirme
        </Button>
      </div>
    </header>
  );
}

export { Navigation };
