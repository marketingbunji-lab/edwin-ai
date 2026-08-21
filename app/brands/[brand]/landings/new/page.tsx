import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NewLandingForm from "@/components/editor/NewLandingForm";
import {
  getBrandBySlug,
  getEditableLandingsByBrand,
  getProgramsByBrand,
} from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewBrandLandingPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const landings = getEditableLandingsByBrand(brand.slug);
  const programsWithLanding = new Set(
    landings.flatMap((landing) =>
      [
        landing.sourceProgramId,
        landing.sourceProgramSlug,
        landing.slug,
      ].filter((value): value is string => Boolean(value?.trim())),
    ),
  );
  const availablePrograms = programs.filter(
    (program) => !programsWithLanding.has(program.id),
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="relative flex min-w-0 items-center gap-3">
            <Link
              href={`/admin/brands/${brand.slug}/landings`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a landings"
              title="Volver a landings"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                Crear landing
              </h1>
            </div>
          </div>
        </div>

        <NewLandingForm
          brandSlug={brand.slug}
          programs={availablePrograms}
          totalProgramCount={programs.length}
        />
      </div>
    </main>
  );
}
