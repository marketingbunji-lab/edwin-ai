import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import BrandLandingsList, {
  type BrandLandingListItem,
} from "../../../../components/dashboard/BrandLandingsList";
import { getDashboardTranslator } from "../../../../lib/dashboardI18n";
import { getDashboardLanguage } from "../../../../lib/dashboardI18nServer";
import { getBrandBySlug, getLandingsByBrand } from "../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandLandingsPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const landings = getLandingsByBrand(brand.slug);
  const landingItems: BrandLandingListItem[] = landings.map((landing) => ({
    ...landing,
    programType: landing.programType || "Sin tipo",
  }));

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
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
                  {t("landingsPage.title")}
                </h1>
              </div>
            </div>

            <Link
              href={`/admin/brands/${brand.slug}/new`}
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              {t("landingsPage.createLanding")}
            </Link>
          </div>
        </div>

        {landingItems.length === 0 ? (
          <section className="admin-empty-state">
            <p className="admin-eyebrow">{t("landingsPage.emptyEyebrow")}</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {t("landingsPage.emptyTitle")}
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-xl">
              {t("landingsPage.emptyDescription")}
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                {t("landingsPage.createFirstLanding")}
              </Link>
            </div>
          </section>
        ) : (
          <BrandLandingsList landings={landingItems} />
        )}
      </div>
    </main>
  );
}
