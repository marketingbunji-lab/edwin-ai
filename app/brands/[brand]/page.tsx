import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Brush,
  FileStack,
  Pencil,
  Shapes,
  Users,
} from "lucide-react";
import WorkspaceProgressCard from "@/components/dashboard/WorkspaceProgressCard";
import { getBrandAgentRecords } from "@/lib/brandAgentRecords";
import {
  getDashboardTranslator,
  type DashboardLanguage,
} from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import {
  getBrandBySlug,
  getLandingsByBrand,
  getProgramsByBrand,
} from "@/lib/data";
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

type WorkflowStage = {
  title: string;
  href: string;
  ctaLabel: string;
  unlocks: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default async function BrandPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;

  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const landings = getLandingsByBrand(brand.slug);
  const universityProfile = getUniversityProfileByBrand(brand.slug);
  const buyerPersonRecords = getBrandAgentRecords(brand.slug, "buyer-person");
  const visualAssets = getBrandAgentRecords(brand.slug, "visual-assets");
  const publishedLandings = landings.filter(
    (landing) => landing.status === "published",
  );
  const hasDocuments = Object.values(brand.documents ?? {}).some((document) =>
    Boolean(document?.fileName || document?.fileUrl || document?.link),
  );

  const brandSetupSignals = [
    brand.description,
    brand.officialWebsite,
    brand.logos?.light || brand.logo || "",
    brand.primaryColor || "",
    brand.secondaryColor || "",
  ].filter((value) => Boolean(value?.trim())).length;

  const brandSetupDone = brandSetupSignals >= 5;
  const buyerPersonaDone = buyerPersonRecords.length > 0;
  const programsDone = programs.length > 0;
  const assetsDone = visualAssets.length > 0;
  const landingDone = publishedLandings.length > 0;
  const universityContentBaseDone =
    hasUniversityProfileContent(universityProfile);
  const goldenCircleDone = false;
  const documentsDone = hasDocuments;

  const stages: WorkflowStage[] = [
    {
      title: t("brandOverviewPage.brandSetup"),
      href: `/admin/brands/${brand.slug}/edit`,
      ctaLabel: t("brandOverviewPage.setupBrand"),
      unlocks: t("brandOverviewPage.setupBrandUnlock"),
      icon: Pencil,
    },
    {
      title: t("brandOverviewPage.buyerPersona"),
      href: `/admin/brands/${brand.slug}/buyer-person/new`,
      ctaLabel: t("brandOverviewPage.createBuyerPersona"),
      unlocks: t("brandOverviewPage.buyerPersonaUnlock"),
      icon: Users,
    },
    {
      title: t("brandOverviewPage.contentBase"),
      href: `/admin/brands/${brand.slug}/programs/new`,
      ctaLabel: t("brandOverviewPage.createProgram"),
      unlocks: t("brandOverviewPage.contentBaseUnlock"),
      icon: FileStack,
    },
    {
      title: t("brandOverviewPage.visualAssets"),
      href: `/admin/brands/${brand.slug}/visual-assets`,
      ctaLabel: t("brandOverviewPage.generateAssets"),
      unlocks: t("brandOverviewPage.visualAssetsUnlock"),
      icon: Brush,
    },
    {
      title: t("brandOverviewPage.landingActivation"),
      href: `/admin/brands/${brand.slug}/landings`,
      ctaLabel: t("brandOverviewPage.createLanding"),
      unlocks: t("brandOverviewPage.landingActivationUnlock"),
      icon: Shapes,
    },
  ];

  const knowledgeBaseProgress = Math.round(
    ((Number(brandSetupDone) +
      Number(programsDone) +
      Number(universityContentBaseDone) +
      Number(documentsDone)) /
      4) *
      100,
  );
  const nextStage =
    (!brandSetupDone && stages[0]) ||
    (!buyerPersonaDone && stages[1]) ||
    (!programsDone && stages[2]) ||
    (!assetsDone && stages[3]) ||
    (!landingDone && stages[4]) ||
    stages[stages.length - 1];
  const NextStageIcon = nextStage.icon;
  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/admin/brands"
                className="admin-button-secondary admin-button-icon"
                aria-label={t("brandOverviewPage.backToBrands")}
                title={t("brandOverviewPage.backToBrands")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {t("brandOverviewPage.controlRoom")}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {brand.name}
                </h1>
              </div>
            </div>

            <Link href={nextStage.href} className="admin-button-primary">
              <NextStageIcon className="h-4 w-4" />
              {nextStage.ctaLabel}
            </Link>
          </div>
        </div>

        <section
          id="brand-orchestration-control-room"
          className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]"
        >
          <div className="space-y-6">
            <section className="admin-panel p-6 sm:p-8">
              <div className="grid gap-5 xl:grid-cols-2">
                <StrategicWorkflowCard
                  href={`/admin/brands/${brand.slug}/knowledge-base`}
                  eyebrow={t("brandOverviewPage.knowledgeBase")}
                  title={t("brandOverviewPage.buildKnowledgeBase")}
                  description={t(
                    "brandOverviewPage.buildKnowledgeBaseDescription",
                  )}
                  helperLabel={t("brandOverviewPage.knowledgeBaseCompletion")}
                  helperValue={knowledgeBaseProgress}
                  ctaLabel={t("brandOverviewPage.buildKnowledge")}
                  icon={FileStack}
                  tone="knowledge"
                  language={language}
                />

                <StrategicWorkflowCard
                  href={`/admin/brands/${brand.slug}/journey`}
                  eyebrow={t("brandOverviewPage.educationAgentsEyebrow")}
                  title={t("brandOverviewPage.deployEducationAgents")}
                  description={t(
                    "brandOverviewPage.deployEducationAgentsDescription",
                  )}
                  helperLabel={t("brandOverviewPage.nextAction")}
                  helperValue={nextStage.title}
                  ctaLabel={t("brandOverviewPage.viewJourneyAndAgents")}
                  icon={NextStageIcon}
                  tone="agents"
                  language={language}
                />
              </div>

            </section>
          </div>

          <WorkspaceProgressCard
            language={language}
            nextActionLabel={nextStage.ctaLabel}
            nextActionHref={nextStage.href}
            knowledgeBaseItems={[
              {
                title: t("brandOverviewPage.universityContentBase"),
                complete: universityContentBaseDone,
              },
              {
                title: t("brandOverviewPage.brandSetup"),
                complete: brandSetupDone,
              },
              {
                title: t("brandOverviewPage.contentBase"),
                complete: programsDone,
              },
              {
                title: t("brandOverviewPage.documents"),
                complete: documentsDone,
              },
            ]}
            educationAgentItems={[
              {
                title: t("brandOverviewPage.buyerPersona"),
                complete: buyerPersonaDone,
              },
              {
                title: t("brandOverviewPage.visualAssets"),
                complete: assetsDone,
              },
              {
                title: t("brandOverviewPage.landingActivation"),
                complete: landingDone,
              },
              {
                title: t("brandOverviewPage.goldenCircle"),
                complete: goldenCircleDone,
              },
            ]}
          />
        </section>
      </div>
    </main>
  );
}

function StrategicWorkflowCard({
  href,
  eyebrow,
  title,
  description,
  helperLabel,
  helperValue,
  ctaLabel,
  icon: Icon,
  tone,
  language,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  helperLabel: string;
  helperValue: string | number;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "knowledge" | "agents";
  language: DashboardLanguage;
}) {
  const t = getDashboardTranslator(language);
  const progressValue =
    tone === "knowledge" && typeof helperValue === "number"
      ? Math.max(0, Math.min(100, helperValue))
      : null;

  const toneClasses =
    tone === "knowledge"
      ? {
          shell:
            "border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] bg-[radial-gradient(circle_at_12%_14%,rgba(125,227,234,0.16),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,244,255,0.97))] shadow-[0_24px_56px_rgba(62,57,137,0.12)]",
          icon:
            "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_85%,white))] text-[var(--bunji-primary-dark)]",
          accent: "text-[var(--bunji-primary)] dark:text-[var(--bunji-cyan)]",
        }
      : {
          shell:
            "border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)] bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] shadow-[0_24px_56px_rgba(125,227,234,0.14)]",
          icon:
            "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-cyan-soft)_88%,white),color-mix(in_srgb,var(--bunji-primary-light)_62%,white))] text-[var(--bunji-primary-dark)]",
          accent: "text-[var(--bunji-cyan-dark)] dark:text-[var(--bunji-cyan)]",
        };

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[28px] border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(15,23,42,0.16)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(15,23,42,0.74))] ${toneClasses.shell}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-[rgba(255,11,46,0.06)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-80" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
              {title}
            </h3>
          </div>

          <div className={`admin-icon-tile h-12 w-12 ${toneClasses.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>

        <div className="mt-7 rounded-2xl border border-white/60 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {helperLabel}
          </p>
          {progressValue !== null ? (
            <>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold leading-none tracking-tight text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)] sm:text-5xl">
                  {progressValue}%
                </p>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_78%,white)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bunji-primary-dark)] dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                  {t("brandOverviewPage.completed")}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,rgba(62,57,137,0.08),rgba(125,227,234,0.12))] ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_52%,white)] dark:bg-[linear-gradient(90deg,rgba(62,57,137,0.24),rgba(125,227,234,0.12))] dark:ring-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(100deg,var(--bunji-cyan)_0%,var(--bunji-red)_38%,color-mix(in_srgb,var(--bunji-red)_42%,var(--bunji-primary)_58%)_62%,var(--bunji-primary)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(125,227,234,0.22),0_0_28px_rgba(255,11,46,0.12)] transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {String(helperValue)}
            </p>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <p
            className={`text-sm font-semibold transition group-hover:translate-x-0.5 ${toneClasses.accent}`}
          >
            {ctaLabel}
          </p>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(62,57,137,0.22),transparent)] dark:bg-[linear-gradient(90deg,rgba(125,227,234,0.18),transparent)]" />
        </div>
      </div>
    </Link>
  );
}
