import BrandCard from "@/components/dashboard/BrandCard";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import { getSupabaseBrands } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const language = await getDashboardLanguage();
  const brands = getBrands();
  const supabaseBrands = await getSupabaseBrands();

  return (
    <main className="admin-page">
      <div className="w-full">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
              {language === "en" ? "Brands from JSON" : "Marcas con JSON"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {language === "en"
                ? "These brands come from files stored in the project."
                : "Estas marcas vienen de los archivos guardados en el proyecto."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => (
              <BrandCard
                key={brand.slug}
                brand={brand}
                landingCount={getLandingsByBrand(brand.slug).length}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
              {language === "en" ? "Brands in Supabase" : "Marcas en Supabase"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {language === "en"
                ? "These brands live in the database. Some may also exist as local JSON."
                : "Estas marcas estan en la base de datos. Algunas pueden existir tambien como JSON local."}
            </p>
          </div>

          {supabaseBrands.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {supabaseBrands.map((brand) => (
                <BrandCard
                  key={brand.slug}
                  brand={brand}
                  landingCount={getLandingsByBrand(brand.slug).length}
                  canDeleteJson={false}
                  canDeleteSupabase
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 bg-white px-5 py-6 text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              {language === "en"
                ? "There are no Supabase brands waiting to be shown from the database."
                : "No hay marcas en Supabase pendientes por mostrar desde base de datos."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
