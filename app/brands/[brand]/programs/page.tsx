import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import ProgramsList from "@/components/programs/ProgramsList";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandProgramsPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}`}
                className="admin-button-secondary admin-button-icon"
                aria-label={language === "en" ? "Back to brand" : "Volver a marca"}
                title={language === "en" ? "Back to brand" : "Volver a marca"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {t("programsPage.title")}
                </h1>
              </div>
            </div>

            <Link
              href={`/admin/brands/${brand.slug}/programs/new`}
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              {t("programsPage.addProgram")}
            </Link>
          </div>
        </div>

        <ProgramsList brand={brand} programs={programs} />
      </div>
    </main>
  );
}
