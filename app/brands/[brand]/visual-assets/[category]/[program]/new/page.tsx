import { notFound } from "next/navigation";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import {
  getBrandAgentRecords,
  isVisualAssetCategory,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import {
  getBrandBySlug,
  getProgramDataBySlug,
  getProgramsByBrand,
  type Program,
} from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    category: string;
    program: string;
  }>;
};

export default async function NewProgramVisualAssetPage({ params }: Props) {
  const {
    brand: brandSlug,
    category: categorySlug,
    program: programId,
  } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand || categorySlug !== "programs-assets" || !isVisualAssetCategory(categorySlug)) {
    notFound();
  }

  const program = resolveProgram(getProgramsByBrand(brand.slug), programId);
  const resolvedProgramId = program?.id ?? programId;
  const programName = program?.programName ?? titleFromSlug(programId);
  const programLanding = getProgramDataBySlug(brand.slug, resolvedProgramId);
  const programData = programLanding ?? program ?? {
    id: resolvedProgramId,
    programName,
  };
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
          visualAssetCategory={categorySlug}
          visualAssetProgramId={resolvedProgramId}
          visualAssetProgramName={programName}
          visualAssetProgramData={programData}
          buyerPersonRecords={buyerPersonRecords}
          showPreview
          backHref={`/admin/brands/${brand.slug}/visual-assets/${categorySlug}/${resolvedProgramId}`}
          backLabel="Volver a assets del programa"
          eyebrow={brand.shortName || brand.name}
          title="Agregar asset del programa"
          description="Registra recursos visuales asociados a este programa academico."
        />
      </div>
    </main>
  );
}

function resolveProgram(programs: Program[], programId: string) {
  const normalizedProgramId = slugify(programId);

  return programs.find((program) => {
    const sourceSlug = program.sourceWebsite
      ? slugify(program.sourceWebsite.split("/").filter(Boolean).at(-1) ?? "")
      : "";

    return (
      program.id === programId ||
      slugify(program.id) === normalizedProgramId ||
      slugify(program.programName) === normalizedProgramId ||
      sourceSlug === normalizedProgramId
    );
  });
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
