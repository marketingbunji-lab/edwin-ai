import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "@/lib/data";
import { buildLandingMetadata } from "@/lib/landingSeo";
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

  return buildLandingMetadata({
    brand,
    landing,
    pathname: `/landings/${brandSlug}/${landingSlug}`,
  });
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
