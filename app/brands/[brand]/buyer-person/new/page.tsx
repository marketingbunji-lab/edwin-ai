import { notFound } from "next/navigation";
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
        <BrandAgentRecordForm
          brand={brand}
          collection="buyer-person"
          showPreview
          title="Agregar buyer person"
          description="Crea la base del perfil de audiencia para que los agentes puedan ajustar mensajes, objeciones y oportunidades por segmento."
          backHref={`/admin/brands/${brand.slug}/buyer-person`}
          backLabel="Volver a buyer person"
        />
      </div>
    </main>
  );
}
