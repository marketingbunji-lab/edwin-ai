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

export default async function NewBrandBuyerPersonPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full">
        <Link
          href={`/admin/brands/${brand.slug}/buyer-person`}
          className="mb-6 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a buyer person
        </Link>

        <BrandAgentRecordForm
          brand={brand}
          collection="buyer-person"
          showPreview
          eyebrow={brand.shortName || brand.name}
          title="Agregar buyer person"
          description="Crea la base del perfil de audiencia para que los agentes puedan ajustar mensajes, objeciones y oportunidades por segmento."
        />
      </div>
    </main>
  );
}
