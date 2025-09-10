import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PoiFilterProvider } from "@/context/PoiFilterContext";

import "./globals.css";
import "./leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bike Buddy",
  description: "Find cycling related points of interest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PoiFilterProvider>{children}</PoiFilterProvider>
      </body>
    </html>
  );
}
