import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import {
  getBrandAgentRecords,
  isVisualAssetCategory,
  visualAssetCategories,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
    category: string;
  }>;
};

export default async function NewVisualAssetCategoryPage({ params }: Props) {
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

  const buyerPersonRecords = getBrandAgentRecords(
    brand.slug,
    "buyer-person",
  ) as BuyerPersonRecord[];

  return (
    <main className="admin-page">
      <div className="w-full">
        <Link
          href={`/admin/brands/${brand.slug}/visual-assets/${category.slug}`}
          className="mb-6 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a {category.title}
        </Link>

        <BrandAgentRecordForm
          brand={brand}
          collection="visual-assets"
          visualAssetCategory={category.slug}
          buyerPersonRecords={buyerPersonRecords}
          showPreview
          eyebrow={brand.shortName || brand.name}
          title={`Agregar ${category.title}`}
          description={category.description}
        />
      </div>
    </main>
  );
}
