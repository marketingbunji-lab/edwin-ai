import { notFound } from "next/navigation";
import { renderLandingTemplate } from "@/components/templates/renderLandingTemplate";
import { findLandingBySlugOrAlias } from "@/lib/landingLookup";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    landing: string;
  }>;
};

export default async function LandingPreviewPage({ params }: Props) {
  const { landing: landingSlug } = await params;
  const result = findLandingBySlugOrAlias(landingSlug);

  if (!result) {
    notFound();
  }

  return renderLandingTemplate({
    brand: result.brand,
    landing: result.landing,
    mode: "preview",
  });
}
