import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
    category: string;
    program: string;
  }>;
};

export default async function ShortProgramVisualAssetsPage({ params }: Props) {
  const { brand, category, program } = await params;
  redirect(`/admin/brands/${brand}/visual-assets/${category}/${program}`);
}
