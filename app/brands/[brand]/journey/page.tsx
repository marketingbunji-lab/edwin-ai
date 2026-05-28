import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Brush, Shapes, Target, Users } from "lucide-react";
import { getBrandAgentRecords } from "@/lib/brandAgentRecords";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getLandingsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandJourneyPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const buyerPersonRecords = getBrandAgentRecords(brand.slug, "buyer-person");
  const visualAssets = getBrandAgentRecords(brand.slug, "visual-assets");
  const landings = getLandingsByBrand(brand.slug);
  const publishedLandings = landings.filter(
    (landing) => landing.status === "published",
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
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
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {t("journeyPage.title")}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/buyer-person`}
              title={t("journeyPage.buyerPersonaTitle")}
              description={t("journeyPage.buyerPersonaDescription")}
              helper={t("journeyPage.buyerPersonaHelper", {
                count: buyerPersonRecords.length,
              })}
              ctaLabel={t("journeyPage.buyerPersonaCta")}
              icon={Users}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/visual-assets`}
              title={t("journeyPage.visualAssetsTitle")}
              description={t("journeyPage.visualAssetsDescription")}
              helper={t("journeyPage.visualAssetsHelper", {
                count: visualAssets.length,
              })}
              ctaLabel={t("journeyPage.visualAssetsCta")}
              icon={Brush}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/landings`}
              title={t("journeyPage.landingActivationTitle")}
              description={t("journeyPage.landingActivationDescription")}
              helper={t("journeyPage.landingActivationHelper", {
                published: publishedLandings.length,
                total: landings.length,
              })}
              ctaLabel={t("journeyPage.landingActivationCta")}
              icon={Shapes}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/golden-circle`}
              title={t("knowledgeBasePage.goldenCircleTitle")}
              description={t("knowledgeBasePage.goldenCircleDescription")}
              helper={t("knowledgeBasePage.narrativeFramework")}
              ctaLabel={t("knowledgeBasePage.goToGoldenCircle")}
              icon={Target}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkspaceCard({
  href,
  title,
  description,
  helper,
  ctaLabel,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  helper: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="admin-panel-soft group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
    >
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      <p className="admin-muted mt-3">{description}</p>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {helper}
      </p>
      <p className="mt-5 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
        {ctaLabel}
      </p>
    </Link>
  );
}

