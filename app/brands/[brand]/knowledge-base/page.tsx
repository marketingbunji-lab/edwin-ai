import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FileText,
  FileStack,
  LibraryBig,
  Lock,
  Pencil,
} from "lucide-react";
import {
  getDashboardTranslator,
  type DashboardLanguage,
} from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";
import {
  getUniversityProfileByBrand,
  hasUniversityProfileContent,
} from "@/lib/universityProfiles";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

type WorkflowState = "completed" | "in_progress" | "locked" | "pending";

export default async function BrandKnowledgeBasePage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const universityProfile = getUniversityProfileByBrand(brand.slug);
  const brandSetupSignals = [
    brand.description,
    brand.officialWebsite,
    brand.logos?.light || brand.logo || "",
    brand.primaryColor,
    brand.secondaryColor,
  ].filter((value) => Boolean(value?.trim())).length;

  const brandSetupCompleted = brandSetupSignals >= 5;
  const brandSetupInProgress = !brandSetupCompleted && brandSetupSignals > 0;
  const contentBaseCompleted = programs.length > 0;
  const universityContentBaseCompleted =
    hasUniversityProfileContent(universityProfile);
  const universityContentBaseState: WorkflowState = universityContentBaseCompleted
    ? "completed"
    : "pending";
  const contentBaseState: WorkflowState = contentBaseCompleted
    ? "completed"
    : "pending";
  const documentsState: WorkflowState = "pending";

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}`}
                className="admin-button-secondary admin-button-icon"
                aria-label={t("shell.backToBrand")}
                title={t("shell.backToBrand")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {t("knowledgeBasePage.title")}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">

          <div className="relative grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-[linear-gradient(90deg,rgba(62,57,137,0.18),rgba(125,227,234,0.48),rgba(62,57,137,0.18))] xl:block" />
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[34px] hidden h-3 bg-[radial-gradient(circle,rgba(125,227,234,0.28)_0%,transparent_62%)] blur-xl xl:block" />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/university`}
              title={t("knowledgeBasePage.universityContentBaseTitle")}
              description={t("knowledgeBasePage.universityContentBaseDescription")}
              helper={t("knowledgeBasePage.institutionalContentHelper")}
              ctaLabel={t("knowledgeBasePage.goToUniversityContentBase")}
              icon={LibraryBig}
              state={universityContentBaseState}
              stepLabel={t("knowledgeBasePage.step01")}
              language={language}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/edit`}
              title={t("knowledgeBasePage.brandSetupTitle")}
              description={t("knowledgeBasePage.brandSetupDescription")}
              helper={`${brandSetupSignals}/5 ${t("knowledgeBasePage.baseSignalsCompleted")}`}
              ctaLabel={t("knowledgeBasePage.setupBrand")}
              icon={Pencil}
              state={
                brandSetupCompleted
                  ? "completed"
                  : brandSetupInProgress
                    ? "in_progress"
                    : "pending"
              }
              stepLabel={t("knowledgeBasePage.step02")}
              language={language}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/programs`}
              title={t("knowledgeBasePage.programContentBaseTitle")}
              description={t("knowledgeBasePage.programContentBaseDescription")}
              helper={`${programs.length} ${t("knowledgeBasePage.structuredPrograms")}`}
              ctaLabel={t("knowledgeBasePage.goToContentBase")}
              icon={FileStack}
              state={contentBaseState}
              stepLabel={t("knowledgeBasePage.step03")}
              language={language}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/documents`}
              title={t("knowledgeBasePage.documentsTitle")}
              description={t("knowledgeBasePage.documentsDescription")}
              helper={t("knowledgeBasePage.documentsHelper")}
              ctaLabel={t("knowledgeBasePage.goToDocuments")}
              icon={FileText}
              state={documentsState}
              stepLabel={t("knowledgeBasePage.step04")}
              language={language}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkspaceCard({
  href,
  title,
  subtitle,
  description,
  helper,
  ctaLabel,
  icon: Icon,
  state,
  stepLabel,
  language,
}: {
  href: string;
  title: string;
  subtitle?: string;
  description: string;
  helper: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  state: WorkflowState;
  stepLabel: string;
  language: DashboardLanguage;
}) {
  const t = getDashboardTranslator(language);
  const statusConfig = getWorkflowStatusConfig(state, language);
  const StatusIcon = statusConfig.icon;
  const isLocked = state === "locked";
  const cardClassName = `admin-panel-soft group relative block overflow-hidden p-6 transition-all duration-300 ${
    isLocked
      ? "cursor-not-allowed border-slate-200/70 opacity-65 grayscale-[0.08] dark:border-white/10"
      : "hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
  }`;

  const cardContent = (
    <>
      <div className="pointer-events-none absolute left-6 top-6 h-12 w-12 rounded-full bg-[radial-gradient(circle,rgba(125,227,234,0.16),transparent_72%)] blur-xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="admin-icon-tile">
            <Icon className="h-5 w-5" />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${statusConfig.className}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </div>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {stepLabel}
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
            {subtitle}
          </p>
        ) : null}
        <p className="admin-muted mt-3">{description}</p>
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          {isLocked ? t("knowledgeBasePage.completePreviousStep") : helper}
        </p>
        <p
          className={`mt-5 text-sm font-semibold ${
            isLocked
              ? "text-slate-400 dark:text-slate-500"
              : "text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]"
          }`}
        >
          {isLocked ? t("knowledgeBasePage.availableLater") : ctaLabel}
        </p>
      </div>
    </>
  );

  if (isLocked) {
    return <div className={cardClassName}>{cardContent}</div>;
  }

  return (
    <Link href={href} className={cardClassName}>
      {cardContent}
    </Link>
  );
}

function getWorkflowStatusConfig(
  state: WorkflowState,
  language: DashboardLanguage,
) {
  const t = getDashboardTranslator(language);

  if (state === "completed") {
    return {
      label: t("knowledgeBasePage.statusCompleted"),
      icon: CheckCircle2,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
    };
  }

  if (state === "in_progress") {
    return {
      label: t("knowledgeBasePage.statusInProgress"),
      icon: Clock3,
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
    };
  }

  if (state === "locked") {
    return {
      label: t("knowledgeBasePage.statusLocked"),
      icon: Lock,
      className:
        "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
    };
  }

  return {
    label: t("knowledgeBasePage.statusPending"),
    icon: CircleDashed,
    className:
      "border-[color-mix(in_srgb,var(--bunji-primary-soft)_68%,white)] bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)] dark:border-[var(--bunji-primary-muted)]/20 dark:bg-[var(--bunji-primary-soft)]/20 dark:text-[var(--bunji-primary-muted)]",
  };
}
