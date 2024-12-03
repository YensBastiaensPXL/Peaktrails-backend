import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title:
    "PeakTrails - GPS Hiking App | Explore, Track, and Share Hiking Routes",
  description:
    "Discover top hiking trails with PeakTrails. Navigate offline using GPS, track your hikes, and share routes with the community.",
  keywords:
    "hiking trails, GPS navigation, offline maps, hiking app, outdoor adventures, hiking tracker, trail routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow w-full mx-auto ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
