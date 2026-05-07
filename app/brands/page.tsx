import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import { getSupabaseBrands } from "@/lib/supabaseBrands";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = getBrands();
  const supabaseBrands = await getSupabaseBrands();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="w-full">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              Marcas
            </h1>
            <p className="max-w-2xl text-gray-600 dark:text-slate-300">
              Selecciona una marca para gestionar sus landings.
            </p>
          </div>

          <Link
            href="/admin/brands/new"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white dark:bg-[var(--bunji-primary)]"
          >
            <Plus className="h-4 w-4" />
            Nueva marca
          </Link>
        </div>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
              Marcas con JSON
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Estas marcas vienen de los archivos guardados en el proyecto.
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
              Marcas en Supabase
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Estas marcas están en la base de datos. Algunas pueden existir también como JSON local.
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
              No hay marcas en Supabase pendientes por mostrar desde base de
              datos.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
