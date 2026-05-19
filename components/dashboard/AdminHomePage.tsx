import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";

export default function HomePage() {
  const brands = getBrands();

  return (
    <main className="admin-page bg-transparent">
      <div className="admin-page-inner">

        <section className="mt-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="admin-eyebrow">
                Marcas
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Espacios de trabajo disponibles
              </h2>
              <p className="admin-muted mt-3 max-w-3xl">
                <strong>Agentes de IA trabajando más rápido y de forma inteligente</strong> para tu universidad o institución 
              </p>
            </div>

          </div>

          <div className="grid gap-8 border border-none dark:border-none md:grid-cols-2 xl:grid-cols-3">
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
