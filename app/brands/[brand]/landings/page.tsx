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
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/admin/brands/${brand.slug}`}
              className="admin-button-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a marca
            </Link>

            <Link
              href={`/admin/brands/${brand.slug}/new`}
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              Crear landing
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <p className="admin-eyebrow">
            {brand.name}
          </p>
          <h1 className="admin-title">
            Landings de marca
          </h1>
          <p className="admin-muted mt-2 max-w-2xl">
            Gestiona las landings creadas para esta universidad y crea nuevas
            experiencias cuando las necesites.
          </p>
        </div>

        {landingItems.length === 0 ? (
          <section className="admin-empty-state">
            <p className="admin-eyebrow">
              Agente de landings
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Aun no hay landings creadas
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-xl">
              Crea la primera landing de esta marca para empezar a organizar su
              oferta academica y flujo de captacion.
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/new`}
                className="admin-button-primary"
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
