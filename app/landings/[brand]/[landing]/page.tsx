import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "@/lib/data";
import { renderLandingTemplate } from "@/components/templates/renderLandingTemplate";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, landing: landingSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    return {};
  }

  const favicon = brand.favicon?.trim() || "";

  return {
    title: landing.seo?.metaTitle?.trim() || landing.fullTitle || landing.title,
    description:
      landing.seo?.metaDescription?.trim() ||
      landing.hero?.description?.trim() ||
      landing.overview?.description?.trim() ||
      brand.description?.trim() ||
      "",
    icons: favicon
      ? {
          icon: favicon,
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,
  };
}

export default async function BrandLandingPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    notFound();
  }

  return renderLandingTemplate({
    brand,
    landing,
    mode: "preview",
  });
}
