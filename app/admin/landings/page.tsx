import BrandLandingsList from "@/components/dashboard/BrandLandingsList";
import type { LandingCardData } from "@/components/dashboard/LandingCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import type { Landing } from "@/lib/data";

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

export default function AdminLandingsPage() {
  const landings = getBrands().flatMap((brand) =>
    getLandingsByBrand(brand.slug).map(toLandingCardData),
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="w-full">
        {landings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No hay landings creadas.
          </div>
        ) : (
          <BrandLandingsList landings={landings} />
        )}
      </div>
    </main>
  );
}
