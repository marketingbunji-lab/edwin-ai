import { notFound } from "next/navigation";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import {
  getBrandAgentRecords,
  isVisualAssetCategory,
  visualAssetCategories,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


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
        <BrandAgentRecordForm
          brand={brand}
          collection="visual-assets"
          visualAssetCategory={category.slug}
          buyerPersonRecords={buyerPersonRecords}
          showPreview
          title={`Agregar ${category.title}`}
          description={category.description}
          backHref={`/admin/brands/${brand.slug}/visual-assets/${category.slug}`}
          backLabel={`Volver a ${category.title}`}
        />
      </div>
    </main>
  );
}
