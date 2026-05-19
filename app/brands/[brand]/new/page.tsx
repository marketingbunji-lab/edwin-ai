import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import NewLandingForm from "../../../../components/editor/NewLandingForm";
import { getBrandBySlug } from "../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewLandingPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand = getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">{brand.name}</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              Crear nueva landing
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/admin/brands/${brandSlug}/new/ai`}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-[var(--bunji-primary)]"
            >
              <Sparkles className="h-4 w-4" />
              Crear con AI
            </Link>

            <Link
              href={`/admin/brands/${brandSlug}/landings`}
              className="inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a landings
            </Link>
          </div>
        </div>

        <NewLandingForm brandSlug={brandSlug} brandName={brand.name} />
      </div>
    </main>
  );
}
