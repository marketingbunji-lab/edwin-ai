import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandAgentRecordForm from "@/components/brand-agent-records/BrandAgentRecordForm";
import {
  getBrandAgentRecord,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
    record: string;
  }>;
};

export default async function EditBuyerPersonPage({ params }: Props) {
  const { brand: brandSlug, record: recordId } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const record = getBrandAgentRecord(
    brand.slug,
    "buyer-person",
    recordId,
  ) as BuyerPersonRecord | null;

  if (!record) {
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

        <section className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
            {brand.shortName || brand.name}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Editar buyer person
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Actualiza el perfil, la etapa y las motivaciones del segmento.
          </p>

          <BrandAgentRecordForm
            brand={brand}
            collection="buyer-person"
            initialRecord={record}
            mode="edit"
          />
        </section>
      </div>
    </main>
  );
}

