import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import BrandLandingsList, {
  type BrandLandingListItem,
} from "../../../../components/dashboard/BrandLandingsList";
import { getBrandBySlug, getLandingsByBrand } from "../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandLandingsPage({ params }: Props) {
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
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href={`/admin/brands/${brand.slug}`}
              className="mb-3 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a marca
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {brand.name}
            </p>
            <h1 className="text-3xl font-semibold text-gray-950 dark:text-slate-50">
              Landings de marca
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-slate-400">
              Gestiona las landings creadas para esta universidad y crea nuevas
              experiencias cuando las necesites.
            </p>
          </div>

          <Link
            href={`/admin/brands/${brand.slug}/new`}
            className="inline-flex items-center gap-2 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--bunji-primary)]"
          >
            <Plus className="h-4 w-4" />
            Crear landing
          </Link>
        </div>

        {landingItems.length === 0 ? (
          <section className="border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-500">
              Agente de landings
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-gray-950 dark:text-slate-50">
              Aun no hay landings creadas
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-400">
              Crea la primera landing de esta marca para empezar a organizar su
              oferta academica y flujo de captacion.
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/new`}
                className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--bunji-primary)]"
              >
                <Plus className="h-4 w-4" />
                Crear primera landing
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
