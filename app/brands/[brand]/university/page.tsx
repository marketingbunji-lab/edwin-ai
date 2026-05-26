import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileStack, Pencil, Plus } from "lucide-react";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getLandingsByBrand, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandUniversityContentBasePage({
  params,
}: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const landingPrograms = getLandingsByBrand(brand.slug);
  const uniqueProgramTypes = Array.from(
    new Set(
      landingPrograms
        .map((program) => program.programType?.trim() || "")
        .filter(Boolean),
    ),
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/knowledge-base`}
                className="admin-button-secondary admin-button-icon"
                aria-label={t("universityPage.backToKnowledgeBase")}
                title={t("universityPage.backToKnowledgeBase")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {t("universityPage.context")}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {brand.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/university/edit`}
                className="admin-button-secondary"
              >
                <Pencil className="h-4 w-4" />
                {t("universityPage.edit")}
              </Link>
              <Link
                href={`/admin/brands/${brand.slug}/university/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                {t("universityPage.configureSection")}
              </Link>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="admin-panel-soft p-6">
              <div className="admin-icon-tile">
                <FileStack className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                {t("universityPage.snapshotEyebrow")}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                {t("universityPage.snapshotTitle")}
              </h2>
              <p className="admin-muted mt-3">
                {brand.description ||
                  t("universityPage.snapshotEmptyDescription")}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    {t("universityPage.programsLabel")}
                  </p>
                  <Link
                    href={`/admin/brands/${brand.slug}/programs`}
                    className="mt-2 inline-flex items-center text-2xl font-bold text-[var(--bunji-primary)] underline-offset-4 hover:underline"
                  >
                    {programs.length}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("universityPage.goToProgramsBase")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    {t("universityPage.programTypesLabel")}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-50">
                    {uniqueProgramTypes.length > 0
                      ? uniqueProgramTypes.join(", ")
                      : t("universityPage.pendingStructure")}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {t("universityPage.portfolioDetected")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
