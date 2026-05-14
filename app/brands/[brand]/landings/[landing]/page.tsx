import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "../../../../../lib/data";
import LandingEditor from "../../../../../components/editor/LandingEditor";
import { getSupabaseBrandBySlug } from "../../../../../lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function LandingDetailPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;

  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#020617]">
      <div className="w-full">
        <LandingEditor
          brand={brand}
          initialLanding={landing}
          exportFilename={`${brandSlug}-${landingSlug}.html`}
        />
      </div>
    </main>
  );
}
