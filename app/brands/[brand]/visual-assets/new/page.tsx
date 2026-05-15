import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewBrandVisualAssetPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <Link
          href={`/admin/brands/${brand.slug}/visual-assets`}
          className="mb-6 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a visual assets
        </Link>

        <BrandAgentRecordForm
          brand={brand}
          collection="visual-assets"
          showPreview
          eyebrow={brand.shortName || brand.name}
          title="Agregar visual asset"
          description="Registra recursos visuales que puedan alimentar landings, campanas y piezas generadas por los agentes."
        />
      </div>
    </main>
  );
}
