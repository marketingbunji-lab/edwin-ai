import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images, Layers } from "lucide-react";
import {
  getVisualAssetsByCategory,
  visualAssetCategories,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandVisualAssetsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="mb-8">
          <Link
            href={`/admin/brands/${brand.slug}`}
            className="admin-button-secondary mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a marca
          </Link>
          <p className="admin-eyebrow">
            {brand.name}
          </p>
          <h1 className="admin-title">
            Visual Assets
          </h1>
          <p className="admin-muted mt-2 max-w-2xl">
            Organiza los recursos visuales por tipo de uso para alimentar
            landings, campanas y piezas generadas por agentes.
          </p>
        </div>

        <section className="grid gap-5 lg:grid-cols-2">
          {visualAssetCategories.map((category) => {
            const count = getVisualAssetsByCategory(brand.slug, category.slug)
              .length;
            const Icon = category.slug === "brand-assets" ? Images : Layers;

            return (
              <Link
                key={category.slug}
                href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}`}
                className="admin-panel group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="admin-icon-tile">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {count} assets
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  {category.title}
                </h2>
                <p className="admin-muted mt-3">
                  {category.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                  Entrar a {category.title}
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
