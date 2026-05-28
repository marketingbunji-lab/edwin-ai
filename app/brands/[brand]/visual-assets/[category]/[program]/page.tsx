import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import VisualAssetsTable from "@/components/brand-agent-records/VisualAssetsTable";
import {
  getVisualAssetsByCategory,
  isVisualAssetCategory,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug, getProgramsByBrand, type Program } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    category: string;
    program: string;
  }>;
};

export default async function ProgramVisualAssetsPage({ params }: Props) {
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

  const allAssets = getVisualAssetsByCategory(brand.slug, categorySlug);
  const isAll = programId === "all";
  const program = isAll
    ? null
    : resolveProgram(getProgramsByBrand(brand.slug), programId);
  const resolvedProgramId = program?.id ?? programId;

  const records = isAll
    ? allAssets
    : allAssets.filter(
        (asset) =>
          asset.programId === resolvedProgramId ||
          slugify(asset.programId ?? "") === slugify(programId),
      );
  const title = isAll
    ? "Todos los programs assets"
    : program?.programName ?? titleFromSlug(programId);

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/admin/brands/${brand.slug}/visual-assets/${categorySlug}`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a Programs Assets"
              title="Volver a Programs Assets"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <Link
              href={
                isAll
                  ? `/admin/brands/${brand.slug}/visual-assets/${categorySlug}/new`
                  : `/admin/brands/${brand.slug}/visual-assets/${categorySlug}/${resolvedProgramId}/new`
              }
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              Agregar asset
            </Link>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {brand.name}
            </p>
            <h1 className="text-3xl font-semibold text-gray-950 dark:text-slate-50">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-slate-400">
              {isAll
                ? "Vista completa de todos los assets asociados a programas."
                : "Assets visuales asociados a este programa."}
            </p>
          </div>
        </div>

        {records.length === 0 ? (
          <section className="border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-2xl font-semibold text-gray-950 dark:text-slate-50">
              Aun no hay assets creados
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-400">
              Agrega el primer asset para empezar a organizar los recursos del programa.
            </p>
            <div className="mt-6">
              <Link
                href={
                  isAll
                    ? `/admin/brands/${brand.slug}/visual-assets/${categorySlug}/new`
                    : `/admin/brands/${brand.slug}/visual-assets/${categorySlug}/${resolvedProgramId}/new`
                }
                className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--bunji-primary)]"
              >
                <Plus className="h-4 w-4" />
                Crear primer asset
              </Link>
            </div>
          </section>
        ) : (
          <VisualAssetsTable
            brandSlug={brand.slug}
            category={categorySlug}
            records={records}
          />
        )}
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

