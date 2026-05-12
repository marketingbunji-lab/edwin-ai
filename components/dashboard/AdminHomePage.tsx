import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";

export default function HomePage() {
  const brands = getBrands();

  return (
    <main className="min-h-screen bg-transparent px-6 py-8">
      <div className="w-full">

        <section className="mt-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Marcas
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-950 dark:text-slate-50">
                Espacios de trabajo disponibles
              </h2>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
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
