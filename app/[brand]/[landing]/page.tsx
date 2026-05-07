import { notFound } from "next/navigation";
import { renderLandingTemplate } from "@/components/templates/renderLandingTemplate";
import { getBrandBySlug, getLandingBySlug } from "@/lib/data";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function PublicLandingPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    notFound();
  }

  return renderLandingTemplate({ brand, landing });
}
