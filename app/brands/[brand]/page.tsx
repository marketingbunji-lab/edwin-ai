import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import BrandLandingsList from "../../../components/dashboard/BrandLandingsList";
import type { LandingCardData } from "../../../components/dashboard/LandingCard";
import { getBrandBySlug, getLandingsByBrand } from "../../../lib/data";
import type { Landing } from "../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

function toLandingCardData(
  landing: Landing,
): LandingCardData & { programType: string } {
  return {
    slug: landing.slug,
    brand: landing.brand,
    title: landing.title,
    fullTitle: landing.fullTitle,
    template: landing.template,
    status: landing.status,
    updatedAt: landing.updatedAt,
    schedule: landing.schedule,
    programType: landing.programType?.trim() || "Sin tipo",
    hero: {
      modality: landing.hero?.modality,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const landings = getLandingsByBrand(brandSlug);
  const landingItems = landings.map(toLandingCardData);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="w-full">
        <Link
          href="/admin/brands"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a marcas
        </Link>

        <section
          id="brand-agent-preview"
          className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
            <div className="mb-8 flex h-14 w-14 items-center justify-center bg-white/10 text-white">
              <Building2 className="h-7 w-7" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
              Brand Agent Preview
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              {brand.name}
            </h1>

            {brand.description ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Descripcion
                </p>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-white/75">
                  {brand.description}
                </p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {brand.officialWebsite ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Sitio oficial
                  </p>
                  <a
                    href={brand.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-2 truncate text-sm font-semibold text-[var(--bunji-primary-muted)] underline-offset-4 hover:underline"
                  >
                    <span className="truncate">{brand.officialWebsite}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Slug
                </p>
                <p className="mt-2 truncate font-mono text-sm text-white/70">
                  {brand.slug}
                </p>
              </div>
            </div>
          </div>

          <aside className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            {brand.imageBrand ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.imageBrand}
                alt={brand.name}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Sin imagen de marca
              </div>
            )}

            <Link
              href={`/admin/brands/${brand.slug}/edit`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--bunji-primary)] dark:bg-[var(--bunji-primary)]"
            >
              Editar datos de marca
            </Link>
          </aside>
        </section>

        {landings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No hay landings creadas para esta marca.
          </div>
        ) : (
          <BrandLandingsList landings={landingItems} />
        )}
      </div>
    </main>
  );
}
