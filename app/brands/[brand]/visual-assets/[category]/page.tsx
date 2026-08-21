import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, ImageIcon, Plus } from "lucide-react";
import VisualAssetsTable from "@/components/brand-agent-records/VisualAssetsTable";
import {
  getVisualAssetsByCategory,
  isVisualAssetCategory,
  visualAssetCategories,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    category: string;
  }>;
};

export default async function VisualAssetsCategoryPage({ params }: Props) {
  const { brand: brandSlug, category: categorySlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand || !isVisualAssetCategory(categorySlug)) {
    notFound();
  }

  const category = visualAssetCategories.find(
    (item) => item.slug === categorySlug,
  );

  if (!category) {
    notFound();
  }

  if (categorySlug === "programs-assets") {
    const programs = getProgramsByBrand(brand.slug);
    const assets = getVisualAssetsByCategory(brand.slug, categorySlug);
    const generalAssets = assets.filter((asset) => !asset.programId?.trim());

    return (
      <main className="admin-page">
        <div className="admin-page-inner">
          <Header
            brandSlug={brand.slug}
            title="Programs Assets"
            description={category.description}
            actionHref={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/new`}
          />

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Link
              href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/all`}
              className="admin-button-secondary"
            >
              <Eye className="h-4 w-4" />
              Ver todos los assets
            </Link>
          </div>

          {generalAssets.length > 0 ? (
            <section className="admin-panel mb-5 grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                  Assets generales
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50">
                  Resources not tied to a single program
                </h2>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  {generalAssets.length} assets creados sin `programId`. Estos
                  recursos viven en `Programs Assets`, pero no aparecen dentro
                  de un programa especifico.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <Link
                  href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/all`}
                  className="admin-button-secondary"
                >
                  <Eye className="h-4 w-4" />
                  Ver assets generales
                </Link>
              </div>
            </section>
          ) : null}

          {programs.length === 0 ? (
            <EmptyState
              href={`/admin/brands/${brand.slug}/programs/new`}
              title="Aun no hay programas creados"
              buttonLabel="Crear programa"
            />
          ) : (
            <section className="admin-table-shell" aria-label="Assets por programa">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead className="admin-table-header">
                  <tr>
                    <th scope="col" className="px-5 py-3">Programa</th>
                    <th scope="col" className="px-5 py-3">Identificador</th>
                    <th scope="col" className="px-5 py-3">Assets</th>
                    <th scope="col" className="px-5 py-3">Estado</th>
                    <th scope="col" className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => {
                    const count = assets.filter(
                      (asset) => asset.programId === program.id,
                    ).length;

                    return (
                      <tr
                        key={program.id}
                        className="border-t border-slate-200/80 transition-colors hover:bg-slate-50/80 dark:border-white/10 dark:hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/${program.id}`}
                            className="font-semibold text-slate-950 transition-colors hover:text-[var(--bunji-primary)] dark:text-slate-50"
                          >
                            {program.programName}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            {program.id}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex min-w-9 justify-center rounded-full bg-[var(--bunji-primary-light)] px-2.5 py-1 text-xs font-bold text-[var(--bunji-primary-dark)]">
                            {count}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              count > 0
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
                            }`}
                          >
                            {count > 0 ? "Con assets" : "Sin assets"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/${program.id}`}
                              className="admin-button-secondary px-3 py-2 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver
                            </Link>
                            <Link
                              href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/${program.id}/new`}
                              className="admin-button-primary px-3 py-2 text-xs"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Agregar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    );
  }

  const records = getVisualAssetsByCategory(brand.slug, categorySlug);

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <Header
          brandSlug={brand.slug}
          title={category.title}
          description={category.description}
          actionHref={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/new`}
        />

        {records.length === 0 ? (
          <EmptyState
            href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/new`}
            title="Aun no hay assets creados"
            buttonLabel="Crear primer asset"
          />
        ) : (
          <VisualAssetsTable
            brandSlug={brand.slug}
            category={category.slug}
            records={records}
          />
        )}
      </div>
    </main>
  );
}

function Header({
  brandSlug,
  title,
  description,
  actionHref,
}: {
  brandSlug: string;
  title: string;
  description: string;
  actionHref?: string;
}) {
  return (
    <>
      <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/admin/brands/${brandSlug}/visual-assets`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a visual assets"
              title="Volver a visual assets"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          {actionHref ? (
            <Link
              href={actionHref}
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              Agregar asset
            </Link>
          ) : null}
        </div>
      </div>

      <p className="admin-muted mb-8 max-w-2xl">
        {description}
      </p>
    </>
  );
}

function EmptyState({
  href,
  title,
  buttonLabel,
}: {
  href: string;
  title: string;
  buttonLabel: string;
}) {
  return (
    <section className="admin-empty-state">
      <div className="admin-icon-tile mx-auto">
        <ImageIcon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      <div className="mt-6">
        <Link
          href={href}
          className="admin-button-primary"
        >
          <Plus className="h-4 w-4" />
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
