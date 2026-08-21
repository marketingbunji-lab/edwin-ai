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
import { getBrandAgentRecords } from "@/lib/brandAgentRecords";
import {
  getDashboardTranslator,
  type DashboardLanguage,
} from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import {
  getBrandBySlug,
  getEditableLandingsByBrand,
  getProgramsByBrand,
} from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


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
  const landings = getEditableLandingsByBrand(brand.slug);
  const buyerPersonRecords = getBrandAgentRecords(brand.slug, "buyer-person");
  const visualAssets = getBrandAgentRecords(brand.slug, "visual-assets");
  const publishedLandings = landings.filter(
    (landing) => landing.status === "published",
  );
  const uniqueProgramTypes = Array.from(
    new Set(
      landings
        .map((program) => program.programType?.trim() || "")
        .filter(Boolean),
    ),
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
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
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

              <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                {t("brandOverviewPage.controlRoom")}
              </h1>
            </div>
          </div>
        </div>

        <section
          id="brand-orchestration-control-room"
          className="mb-8 w-full max-w-[980px]"
        >
          <section className="admin-panel p-6 sm:p-8">
            <div className="grid gap-5 xl:grid-cols-2">
                <StrategicWorkflowCard
                  href={`/admin/brands/${brand.slug}/knowledge-base`}
                  eyebrow={t("brandOverviewPage.knowledgeBase")}
                  title={t("brandOverviewPage.buildKnowledgeBase")}
                  description={t(
                    "brandOverviewPage.buildKnowledgeBaseDescription",
                  )}
                  programCount={programs.length}
                  programTypes={uniqueProgramTypes}
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
                  activeLandingCount={publishedLandings.length}
                  totalAssetCount={visualAssets.length}
                  activeLandingsHref={`/admin/brands/${brand.slug}/landings`}
                  assetsHref={`/admin/brands/${brand.slug}/visual-assets`}
                  ctaLabel={t("brandOverviewPage.viewJourneyAndAgents")}
                  icon={NextStageIcon}
                  tone="agents"
                  language={language}
                />
            </div>
          </section>
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
  programCount,
  programTypes,
  activeLandingCount,
  totalAssetCount,
  activeLandingsHref,
  assetsHref,
  ctaLabel,
  icon: Icon,
  tone,
  language,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  programCount?: number;
  programTypes?: string[];
  activeLandingCount?: number;
  totalAssetCount?: number;
  activeLandingsHref?: string;
  assetsHref?: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "knowledge" | "agents";
  language: DashboardLanguage;
}) {
  const t = getDashboardTranslator(language);
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
    <article
      className={`relative overflow-hidden rounded-[28px] border p-7 dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(15,23,42,0.74))] ${toneClasses.shell}`}
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

        {tone === "knowledge" && programCount !== undefined ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white/72 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t("universityPage.programsLabel")}
              </p>
              <p className="mt-3 text-3xl font-bold leading-none text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                {programCount}
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {t("universityPage.goToProgramsBase")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/72 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t("universityPage.programTypesLabel")}
              </p>
              <p className="mt-3 text-lg font-bold leading-snug text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                {programTypes?.length
                  ? programTypes.join(", ")
                  : t("universityPage.pendingStructure")}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t("universityPage.portfolioDetected")}
              </p>
            </div>
          </div>
        ) : activeLandingCount !== undefined && totalAssetCount !== undefined ? (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href={activeLandingsHref ?? href}
              className="rounded-2xl border border-slate-200/80 bg-white/72 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--bunji-cyan)_58%,white)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bunji-primary)] dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t("brandOverviewPage.activeLandings")}
              </p>
              <p className="mt-3 text-3xl font-bold leading-none text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                {activeLandingCount}
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {t("brandOverviewPage.publishedAndAvailable")}
              </p>
            </Link>

            <Link
              href={assetsHref ?? href}
              className="rounded-2xl border border-slate-200/80 bg-white/72 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--bunji-cyan)_58%,white)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bunji-primary)] dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {t("brandOverviewPage.totalAssets")}
              </p>
              <p className="mt-3 text-3xl font-bold leading-none text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)]">
                {totalAssetCount}
              </p>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {t("brandOverviewPage.brandAndProgramAssets")}
              </p>
            </Link>
          </div>
        ) : null}

        <Link
          href={href}
          className="group mt-7 flex items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bunji-primary)] focus-visible:ring-offset-4"
        >
          <p
            className={`text-sm font-semibold transition group-hover:translate-x-0.5 ${toneClasses.accent}`}
          >
            {ctaLabel}
          </p>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(62,57,137,0.22),transparent)] dark:bg-[linear-gradient(90deg,rgba(125,227,234,0.18),transparent)]" />
        </Link>
      </div>
    </article>
  );
}
