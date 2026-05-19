import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function LegacyNewVisualAssetPage({ params }: Props) {
  const { brand } = await params;
  redirect(`/admin/brands/${brand}/visual-assets/brand-assets/new`);
}
