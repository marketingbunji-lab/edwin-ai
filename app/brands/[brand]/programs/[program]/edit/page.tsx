import { notFound } from "next/navigation";
import ProgramDataEditor from "@/components/programs/ProgramDataEditor";
import { getBrandBySlug, getProgramDataBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    program: string;
  }>;
};

export default async function BrandProgramEditPage({ params }: Props) {
  const { brand: brandSlug, program: programSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const program = getProgramDataBySlug(brand.slug, programSlug);

  if (!program) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full">
        <ProgramDataEditor brand={brand} initialProgram={program} />
      </div>
    </main>
  );
}
