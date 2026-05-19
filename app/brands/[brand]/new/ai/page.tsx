import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AiLandingChat from "../../../../../components/editor/AiLandingChat";
import { getBrandBySlug } from "../../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewLandingAiPage({ params }: Props) {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Crear con AI</h1>
          </div>

          <Link
            href={`/admin/brands/${brandSlug}/new`}
            className="inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a nueva landing
          </Link>
        </div>

        <AiLandingChat brandSlug={brandSlug} brandName={brand.name} />
      </div>
    </main>
  );
}
