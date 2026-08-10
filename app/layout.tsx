import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Event Ticket System",
  description: "Event registration and QR ticket management platform.",
};

interface RootLayoutProperties {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
