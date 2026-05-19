import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
    category: string;
  }>;
};

export default async function ShortVisualAssetsCategoryPage({ params }: Props) {
  const { brand, category } = await params;
  redirect(`/admin/brands/${brand}/visual-assets/${category}`);
}
