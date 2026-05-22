import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";

export default function HomePage() {
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
                <p className="admin-eyebrow">Marcas</p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  Espacios de trabajo disponibles
                </h2>
                <p className="admin-muted mt-3 max-w-3xl">
                  <strong className="text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                    Agentes de IA trabajando más rápido y de forma inteligente
                  </strong>{" "}
                  para tu universidad o institución.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  {brands.length} brands
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_32%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white)] px-3 py-2 text-[var(--bunji-primary-dark)] shadow-sm dark:border-[rgba(125,227,234,0.22)] dark:bg-[rgba(125,227,234,0.12)] dark:text-[var(--bunji-cyan)]">
                  EDwin AI workspace
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
