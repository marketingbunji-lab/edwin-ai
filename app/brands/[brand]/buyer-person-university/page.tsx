import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Users } from "lucide-react";
import BuyerPersonRecordsTable from "@/components/brand-agent-records/BuyerPersonRecordsTable";
import {
  getBrandAgentRecords,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandBuyerPersonUniversityPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const records = getBrandAgentRecords(
    brand.slug,
    "buyer-person",
  ) as BuyerPersonRecord[];

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="sticky z-20 mb-8 overflow-hidden border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/buyer-person`}
                className="admin-button-secondary admin-button-icon"
                aria-label={language === "en" ? "Back to buyer person" : "Volver a buyer person"}
                title={language === "en" ? "Back to buyer person" : "Volver a buyer person"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  Buyer Person University
                </h1>
              </div>
            </div>

            <Link
              href={`/admin/brands/${brand.slug}/buyer-person/new`}
              className="admin-button-primary"
            >
              <Plus className="h-4 w-4" />
              {language === "en" ? "Add buyer person" : "Agregar buyer person"}
            </Link>
          </div>
        </div>

        {records.length === 0 ? (
          <section className="admin-empty-state">
            <div className="admin-icon-tile mx-auto">
              <Users className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-5">Buyer Persona Agent</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {language === "en"
                ? "No university buyer persons yet"
                : "Aun no hay buyer persons generales"}
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-xl">
              {language === "en"
                ? "Create the first general audience profile for the institution."
                : "Crea el primer perfil general para orientar mensajes, audiencias y automatizaciones de matricula."}
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/buyer-person/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                {language === "en"
                  ? "Create first buyer person"
                  : "Crear primer buyer person"}
              </Link>
            </div>
          </section>
        ) : (
          <BuyerPersonRecordsTable brandSlug={brand.slug} records={records} />
        )}
      </div>
    </main>
  );
}
