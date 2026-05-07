import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandLandingsList from "../../../components/dashboard/BrandLandingsList";
import type { LandingCardData } from "../../../components/dashboard/LandingCard";
import { getBrandBySlug, getLandingsByBrand } from "../../../lib/data";
import type { Landing } from "../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

function toLandingCardData(
  landing: Landing,
): LandingCardData & { programType: string } {
  return {
    slug: landing.slug,
    brand: landing.brand,
    title: landing.title,
    fullTitle: landing.fullTitle,
    template: landing.template,
    status: landing.status,
    updatedAt: landing.updatedAt,
    schedule: landing.schedule,
    programType: landing.programType?.trim() || "Sin tipo",
    hero: {
      modality: landing.hero?.modality,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const landings = getLandingsByBrand(brandSlug);
  const landingItems = landings.map(toLandingCardData);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="w-full">
        <Link
          href="/admin/brands"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a marcas
        </Link>

        {landings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No hay landings creadas para esta marca.
          </div>
        ) : (
          <BrandLandingsList landings={landingItems} />
        )}
      </div>
    </main>
  );
}
