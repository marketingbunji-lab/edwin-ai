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
            brandName={brand.name}
            brandSlug={brand.slug}
            title={category.title}
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
                  de una card especÃ­fica de programa.
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
            <section className="grid gap-4">
              {programs.map((program) => {
                const count = assets.filter(
                  (asset) => asset.programId === program.id,
                ).length;

                return (
                  <article
                    key={program.id}
                    className="admin-panel grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
                        Programa
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-50">
                        {program.programName}
                      </h2>
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {program.id}
                      </p>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {count} assets asociados
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <Link
                        href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/${program.id}`}
                        className="admin-button-secondary"
                      >
                        <Eye className="h-4 w-4" />
                        Ver assets
                      </Link>
                      <Link
                        href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}/${program.id}/new`}
                        className="admin-button-primary"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar asset
                      </Link>
                    </div>
                  </article>
                );
              })}
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
          brandName={brand.name}
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
  brandName,
  brandSlug,
  title,
  description,
  actionHref,
}: {
  brandName: string;
  brandSlug: string;
  title: string;
  description: string;
  actionHref?: string;
}) {
  return (
    <>
      <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/brands/${brandSlug}/visual-assets`}
            className="admin-button-secondary admin-button-icon"
            aria-label="Volver a visual assets"
            title="Volver a visual assets"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

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

      <div className="mb-8">
        <p className="admin-eyebrow">
          {brandName}
        </p>
        <h1 className="admin-title">
          {title}
        </h1>
        <p className="admin-muted mt-2 max-w-2xl">
          {description}
        </p>
      </div>
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

