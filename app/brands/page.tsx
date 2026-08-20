import BrandCard from "@/components/dashboard/BrandCard";
import { formatCountLabel, getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrands, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrands } from "@/lib/supabaseBrands";

export default async function BrandsPage() {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const brands = getBrands();
  const supabaseBrands = await getSupabaseBrands();
  const totalWorkspaces = brands.length + supabaseBrands.length;

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Dashboard
              </p>
              <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                {t("shell.brands")}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {formatCountLabel(
                  language,
                  totalWorkspaces,
                  language === "en" ? "workspace" : "workspace",
                  language === "en" ? "workspaces" : "workspaces",
                )}
              </span>
              <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_32%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bunji-primary-dark)] shadow-sm dark:border-[rgba(125,227,234,0.22)] dark:bg-[rgba(125,227,234,0.12)] dark:text-[var(--bunji-cyan)]">
                {language === "en" ? "Workspace directory" : "Directorio de workspaces"}
              </span>
            </div>
          </div>
        </div>

        <section>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => (
              <BrandCard
                key={brand.slug}
                brand={brand}
                programCount={getProgramsByBrand(brand.slug).length}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

