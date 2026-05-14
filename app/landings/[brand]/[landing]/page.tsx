import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "@/lib/data";
import { renderLandingTemplate } from "@/components/templates/renderLandingTemplate";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

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
