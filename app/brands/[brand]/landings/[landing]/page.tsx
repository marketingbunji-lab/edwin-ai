import { notFound } from "next/navigation";
import { getBrandBySlug, getLandingBySlug } from "../../../../../lib/data";
import LandingEditor, {
  type LandingImageAsset,
} from "../../../../../components/editor/LandingEditor";
import { getSupabaseBrandBySlug } from "../../../../../lib/supabaseBrands";
import { getVisualAssetsByCategory } from "../../../../../lib/brandAgentRecords";
import { getVisualAssetImageCategoryLabel } from "../../../../../lib/visualAssetCategories";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function LandingDetailPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;

  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));
  const landing = getLandingBySlug(brandSlug, landingSlug);

  if (!brand || !landing) {
    notFound();
  }

  const isImageAsset = (asset: {
    url?: string;
    assetType?: string;
    assetCategory?: string;
  }) =>
    Boolean(asset.url?.trim()) &&
    asset.assetCategory !== "videos" &&
    asset.assetCategory !== "documents" &&
    asset.assetType?.toLowerCase() !== "video";
  const programAssetIds = new Set([
    landing.slug,
    landing.sourceProgramId || "",
    landing.sourceProgramSlug || "",
  ].filter(Boolean));
  const programAssets: LandingImageAsset[] = getVisualAssetsByCategory(
    brand.slug,
    "programs-assets",
  )
    .filter(
      (asset) =>
        isImageAsset(asset) &&
        Boolean(asset.programId && programAssetIds.has(asset.programId)),
    )
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
      url: asset.url,
      source: "program" as const,
      categoryLabel: asset.assetCategory
        ? getVisualAssetImageCategoryLabel("programs-assets", asset.assetCategory)
        : "Program asset",
      notes: asset.notes,
    }));
  const brandAssets: LandingImageAsset[] = getVisualAssetsByCategory(
    brand.slug,
    "brand-assets",
  )
    .filter(isImageAsset)
    .map((asset) => ({
      id: asset.id,
      name: asset.name,
      url: asset.url,
      source: "brand" as const,
      categoryLabel: asset.assetCategory
        ? getVisualAssetImageCategoryLabel("brand-assets", asset.assetCategory)
        : "Brand asset",
      notes: asset.notes,
    }));
  const imageAssets = [...programAssets, ...brandAssets];

  return (
    <main className="admin-page px-0 py-0">
      <div className="w-full">
        <LandingEditor
          brand={brand}
          initialLanding={landing}
          exportFilename={`${brandSlug}-${landingSlug}.html`}
          imageAssets={imageAssets}
        />
      </div>
    </main>
  );
}
