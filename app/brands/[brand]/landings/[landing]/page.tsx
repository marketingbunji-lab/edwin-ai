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
    <main className="admin-page px-0 py-0">
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
