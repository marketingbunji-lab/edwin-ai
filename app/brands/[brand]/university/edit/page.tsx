import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import UniversityProfileEditor from "@/components/university/UniversityProfileEditor";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";
import {
  getEmptyUniversityProfile,
  getUniversityProfileByBrand,
} from "@/lib/universityProfiles";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function EditUniversityContentBasePage({
  params,
}: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const profile =
    getUniversityProfileByBrand(brand.slug) ?? getEmptyUniversityProfile();

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/university`}
                className="admin-button-secondary admin-button-icon"
                aria-label="Volver a University Content Base"
                title="Volver a University Content Base"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  Editar University Content Base
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            Editar University Content Base
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Refina la base institucional unica de la universidad: mision,
            vision, cultura, historia, diferenciales y perfiles academicos.
          </p>
        </section>

        <div className="mt-6">
          <UniversityProfileEditor
            brandSlug={brand.slug}
            initialProfile={profile}
          />
        </div>
      </div>
    </main>
  );
}
