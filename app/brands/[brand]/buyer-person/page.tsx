import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, Users } from "lucide-react";
import {
  getBrandAgentRecords,
  type BuyerPersonRecord,
} from "@/lib/brandAgentRecords";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandBuyerPersonHubPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const universityBuyerPersons = getBrandAgentRecords(
    brand.slug,
    "buyer-person",
  ) as BuyerPersonRecord[];
  const programs = getProgramsByBrand(brand.slug);

  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="sticky z-20 mb-8 overflow-hidden border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,255,255,0.54))] p-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_58%)] before:content-[''] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.78),rgba(15,23,42,0.62))] dark:shadow-[0_22px_55px_rgba(2,6,23,0.32)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/journey`}
                className="admin-button-secondary admin-button-icon"
                aria-label={language === "en" ? "Back to journey" : "Volver a acciones"}
                title={language === "en" ? "Back to journey" : "Volver a acciones"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  Buyer Person
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-5 xl:grid-cols-2">
          <BuyerPersonSectionCard
            href={`/admin/brands/${brand.slug}/buyer-person-university`}
            icon={Users}
            eyebrow="Buyer Person University"
            title={
              language === "en"
                ? "University buyer persons"
                : "Buyer persons generales"
            }
            description={
              language === "en"
                ? "Manage the general audience profiles for this institution."
                : "Administra los perfiles generales de audiencia para esta universidad."
            }
            metric={`${universityBuyerPersons.length} ${
              language === "en"
                ? universityBuyerPersons.length === 1
                  ? "profile"
                  : "profiles"
                : universityBuyerPersons.length === 1
                  ? "perfil"
                  : "perfiles"
            }`}
          />

          <BuyerPersonSectionCard
            href={`/admin/brands/${brand.slug}/buyer-person-program`}
            icon={GraduationCap}
            eyebrow="Buyer Person Program"
            title={
              language === "en"
                ? "Program buyer persons"
                : "Buyer persons por programa"
            }
            description={
              language === "en"
                ? "Review configured programs and prepare specific profiles for each offer."
                : "Revisa los programas configurados y prepara perfiles especificos por oferta."
            }
            metric={`${programs.length} ${
              language === "en"
                ? programs.length === 1
                  ? "program"
                  : "programs"
                : programs.length === 1
                  ? "programa"
                  : "programas"
            }`}
          />
        </section>
      </div>
    </main>
  );
}

function BuyerPersonSectionCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  metric,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <Link
      href={href}
      className="group relative min-h-[260px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(62,57,137,0.16)] dark:border-white/10 dark:bg-slate-950"
    >
      <div className="pointer-events-none absolute -right-20 top-8 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(125,227,234,0.18),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(62,57,137,0.22),transparent_70%)] blur-3xl" />

      <div className="relative flex h-full flex-col">
        <div className="admin-icon-tile">
          <Icon className="h-5 w-5" />
        </div>

        <p className="admin-eyebrow mt-8">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          {title}
        </h2>
        <p className="admin-muted mt-3 max-w-xl">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {metric}
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bunji-primary)] text-white transition group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
