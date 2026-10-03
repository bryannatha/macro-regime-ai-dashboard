import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Macro Regime AI Dashboard",
  description:
    "A public-data macro monitor for inflation, growth stress, liquidity, Bitcoin blockspace demand, and Indonesia FX risk.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
