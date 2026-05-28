import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


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
          className="mb-6 inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 px-0 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Volver a buyer person"
          title="Volver a buyer person"
        >
          <ArrowLeft className="h-4 w-4" />
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

