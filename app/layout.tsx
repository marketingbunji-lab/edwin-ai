import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import { getSupabaseBrands } from "@/lib/supabaseBrands";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EDwin AI",
  description: "Dashboard para gestionar marcas, programas y agentes de contenido.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonBrands = getBrands();
  const supabaseBrands = await getSupabaseBrands();
  const brands = [
    ...jsonBrands,
    ...supabaseBrands.filter(
      (supabaseBrand) =>
        !jsonBrands.some((jsonBrand) => jsonBrand.slug === supabaseBrand.slug),
    ),
  ];
  const landingSummaries = brands.flatMap((brand) =>
    getLandingsByBrand(brand.slug).map((landing) => ({
      brandSlug: brand.slug,
      landingSlug: landing.slug,
      title: landing.title,
      fullTitle: landing.fullTitle,
    })),
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <DashboardShell brands={brands} landingSummaries={landingSummaries}>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
