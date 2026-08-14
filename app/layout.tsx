import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "El Arte de Criar | Taller para familias",
  description:
    "Un encuentro para acompañar a tus hijos en tiempos de pantallas y algoritmos.",
};

interface RootLayoutProperties {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
