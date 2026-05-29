import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, Users } from "lucide-react";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
    program: string;
  }>;
};

export default async function ProgramBuyerPersonPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const { brand: brandSlug, program: programId } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const program = getProgramsByBrand(brand.slug).find(
    (item) => item.id === programId,
  );

  if (!program) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[22px] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/buyer-person-program`}
                className="admin-button-secondary admin-button-icon"
                aria-label={language === "en" ? "Back to program buyer persons" : "Volver a buyer person por programa"}
                title={language === "en" ? "Back to program buyer persons" : "Volver a buyer person por programa"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {program.programName}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="admin-panel p-6">
            <div className="admin-icon-tile">
              <Bot className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-6">Buyer Person Program</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {language === "en"
                ? "Specific buyer persona setup"
                : "Configuracion de buyer person especifico"}
            </h2>
            <p className="admin-muted mt-3 max-w-2xl">
              {language === "en"
                ? "This space is ready to create and manage audience profiles tied to this program."
                : "Este espacio queda listo para crear y administrar perfiles de audiencia conectados a este programa."}
            </p>
          </div>

          <aside className="admin-panel-soft p-5">
            <div className="admin-icon-tile">
              <Users className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-5">Program context</p>
            <dl className="mt-5 space-y-4">
              <Info label="Program" value={program.programName} />
              <Info label="Slug" value={program.id} />
              <Info
                label={language === "en" ? "Source website" : "Sitio web fuente"}
                value={program.sourceWebsite || "Pendiente"}
              />
              <Info
                label={language === "en" ? "Catalog" : "Catalogo"}
                value={program.catalog || "Pendiente"}
              />
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {value}
      </dd>
    </div>
  );
}
