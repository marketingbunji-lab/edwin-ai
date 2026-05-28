import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import {
  getBrandAgentRecord,
  isVisualAssetCategory,
  visualAssetCategories,
  type VisualAssetRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    category: string;
    program: string;
  }>;
};

export default async function EditVisualAssetPage({ params }: Props) {
  const {
    brand: brandSlug,
    category: categorySlug,
    program: recordId,
  } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand || !isVisualAssetCategory(categorySlug)) {
    notFound();
  }

  const category = visualAssetCategories.find(
    (item) => item.slug === categorySlug,
  );
  const record = getBrandAgentRecord(
    brand.slug,
    "visual-assets",
    recordId,
  ) as VisualAssetRecord | null;

  if (!category || !record || record.category !== category.slug) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full">
        <Link
          href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}`}
          className="mb-6 inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 px-0 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label={`Volver a ${category.title}`}
          title={`Volver a ${category.title}`}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <section className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
            {brand.shortName || brand.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Editar {category.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Actualiza la informacion del recurso visual.
          </p>

          <BrandAgentRecordForm
            brand={brand}
            collection="visual-assets"
            initialRecord={record}
            visualAssetCategory={category.slug}
            mode="edit"
          />
        </section>
      </div>
    </main>
  );
}

