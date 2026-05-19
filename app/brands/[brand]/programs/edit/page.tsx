import { notFound } from "next/navigation";
import ProgramsEditor from "@/components/programs/ProgramsEditor";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandProgramsEditPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);

  return (
    <main className="admin-page">
      <div className="w-full">
        <ProgramsEditor brand={brand} initialPrograms={programs} />
      </div>
    </main>
  );
}
