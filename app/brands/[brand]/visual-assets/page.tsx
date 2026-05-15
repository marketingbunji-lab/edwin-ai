import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Plus } from "lucide-react";
import {
  getBrandAgentRecords,
  type VisualAssetRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandVisualAssetsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const records = getBrandAgentRecords(
    brand.slug,
    "visual-assets",
  ) as VisualAssetRecord[];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href={`/admin/brands/${brand.slug}`}
              className="mb-3 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a marca
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {brand.name}
            </p>
            <h1 className="text-3xl font-semibold text-gray-950 dark:text-slate-50">
              Visual Assets
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-slate-400">
              Organiza logos, fotografias, referencias visuales y recursos de
              marca para alimentar las piezas de comunicacion.
            </p>
          </div>

          <Link
            href={`/admin/brands/${brand.slug}/visual-assets/new`}
            className="inline-flex items-center gap-2 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--bunji-primary)]"
          >
            <Plus className="h-4 w-4" />
            Agregar visual asset
          </Link>
        </div>

        {records.length === 0 ? (
          <section className="border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--bunji-primary-light)] text-[var(--bunji-primary)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)]">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-500">
              Visual Assets Agent
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-gray-950 dark:text-slate-50">
              Aun no hay visual assets creados
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-slate-400">
              Crea el primer recurso para empezar a centralizar imagenes,
              referencias y materiales visuales de la marca.
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/visual-assets/new`}
                className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[var(--bunji-primary)]"
              >
                <Plus className="h-4 w-4" />
                Crear primer visual asset
              </Link>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="grid grid-cols-[minmax(220px,1fr)_minmax(150px,0.4fr)_minmax(260px,1fr)_150px] bg-slate-100 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <span>Recurso</span>
              <span>Tipo</span>
              <span>URL</span>
              <span>Actualizado</span>
            </div>
            {records.map((record) => (
              <article
                key={record.id}
                className="grid grid-cols-[minmax(220px,1fr)_minmax(150px,0.4fr)_minmax(260px,1fr)_150px] gap-4 border-t border-slate-200 px-5 py-4 text-sm dark:border-slate-800"
              >
                <div>
                  <p className="font-semibold text-slate-950 dark:text-slate-50">
                    {record.name}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {record.id}
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {record.assetType || "Pendiente"}
                </p>
                <p className="truncate text-slate-600 dark:text-slate-400">
                  {record.url || "Pendiente"}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {record.updatedAt.slice(0, 10)}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
