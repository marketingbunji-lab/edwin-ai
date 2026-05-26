import BrandCard from "@/components/dashboard/BrandCard";
import {
  formatCountLabel,
} from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrands, getLandingsByBrand } from "@/lib/data";

export default async function HomePage() {
  const language = await getDashboardLanguage();
  const brands = getBrands();

  return (
    <main className="admin-page bg-transparent">
      <div className="admin-page-inner">
        <section className="mt-10">
          <div className="admin-panel relative overflow-hidden px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-[radial-gradient(circle_at_center,rgba(125,227,234,0.22),transparent_62%)]" />
            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--bunji-primary)_18%,transparent)] blur-3xl" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="admin-eyebrow">
                  {language === "en" ? "Brands" : "Marcas"}
                </p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  {language === "en"
                    ? "Available workspaces"
                    : "Espacios de trabajo disponibles"}
                </h2>
                <p className="admin-muted mt-3 max-w-3xl">
                  <strong className="text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                    {language === "en"
                      ? "AI agents working faster and more intelligently"
                      : "Agentes de IA trabajando mas rapido e inteligentemente"}
                  </strong>{" "}
                  {language === "en"
                    ? "for your university or institution."
                    : "para tu universidad o institucion."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  {formatCountLabel(
                    language,
                    brands.length,
                    language === "en" ? "brand" : "marca",
                    language === "en" ? "brands" : "marcas",
                  )}
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_32%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white)] px-3 py-2 text-[var(--bunji-primary-dark)] shadow-sm dark:border-[rgba(125,227,234,0.22)] dark:bg-[rgba(125,227,234,0.12)] dark:text-[var(--bunji-cyan)]">
                  {language === "en"
                    ? "EDwin AI workspace"
                    : "Workspace de EDwin AI"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 border border-none dark:border-none md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => {
              const landings = getLandingsByBrand(brand.slug);

              return (
                <BrandCard
                  key={brand.slug}
                  brand={brand}
                  landingCount={landings.length}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
