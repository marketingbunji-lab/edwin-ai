import { notFound } from "next/navigation";
import ProgramDataEditor from "@/components/programs/ProgramDataEditor";
import { getBrandBySlug, getLandingBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

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

  const program = getLandingBySlug(brand.slug, programSlug);

  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <ProgramDataEditor brand={brand} initialProgram={program} />
      </div>
    </main>
  );
}
