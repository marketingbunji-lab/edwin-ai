import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, GraduationCap } from "lucide-react";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getBuyerPersonProgramRecords } from "@/lib/brandAgentRecords";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandBuyerPersonProgramPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const programsWithRecords = programs.map((program) => {
    const records = getBuyerPersonProgramRecords(brand.slug, program.id);
    const lastUpdated =
      records[0]?.metadata?.updatedAt || program.updatedAt || "Pending";

    return {
      program,
      records,
      lastUpdated,
    };
  });

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
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  Buyer Person Program
                </h1>
              </div>
            </div>
          </div>
        </div>

        {programs.length === 0 ? (
          <section className="admin-empty-state">
            <div className="admin-icon-tile mx-auto">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-5">Program Buyer Persona</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {language === "en"
                ? "No programs configured yet"
                : "Aun no hay programas configurados"}
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-xl">
              {language === "en"
                ? "Add programs first so each offer can later have its own buyer persona."
                : "Agrega programas primero para que cada oferta pueda tener su buyer person particular."}
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/brands/${brand.slug}/programs/new`}
                className="admin-button-primary"
              >
                {language === "en" ? "Add program" : "Agregar programa"}
              </Link>
            </div>
          </section>
        ) : (
          <section className="admin-table-shell">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead className="admin-table-header">
                <tr>
                  <th className="px-5 py-4">Program</th>
                  <th className="px-5 py-4">
                    {language === "en" ? "Buyer persons" : "Buyer persons"}
                  </th>
                  <th className="px-5 py-4">
                    {language === "en" ? "Updated" : "Actualizado"}
                  </th>
                  <th className="px-5 py-4 text-right">
                    {language === "en" ? "Actions" : "Acciones"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {programsWithRecords.map(({ program, records, lastUpdated }) => (
                  <tr
                    key={program.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-white/[0.035]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-950 dark:text-slate-50">
                        {program.programName}
                      </p>
                      <p className="mt-1 font-mono text-xs text-gray-500 dark:text-slate-500">
                        {program.id}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                        {records.length}{" "}
                        {language === "en" ? "configured" : "configurados"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-400">
                      {lastUpdated}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/brands/${brand.slug}/buyer-person-program/${program.id}`}
                        className="admin-button-primary px-3 py-2 text-xs"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        {language === "en" ? "Configure" : "Configurar"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}
