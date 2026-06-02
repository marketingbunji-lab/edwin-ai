import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpenText,
  Compass,
  FileStack,
  GraduationCap,
  History,
  Lightbulb,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getEditableLandingsByBrand, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";
import {
  getUniversityProfileByBrand,
  hasUniversityProfileContent,
  type DescriptionItem,
} from "@/lib/universityProfiles";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandUniversityContentBasePage({
  params,
}: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const profile = getUniversityProfileByBrand(brand.slug);
  const hasProfile = hasUniversityProfileContent(profile);
  const programs = getProgramsByBrand(brand.slug);
  const landingPrograms = getEditableLandingsByBrand(brand.slug);
  const uniqueProgramTypes = Array.from(
    new Set(
      landingPrograms
        .map((program) => program.programType?.trim() || "")
        .filter(Boolean),
    ),
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/knowledge-base`}
                className="admin-button-secondary admin-button-icon"
                aria-label={t("universityPage.backToKnowledgeBase")}
                title={t("universityPage.backToKnowledgeBase")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {t("universityPage.context")}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {brand.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/university/edit`}
                className="admin-button-secondary"
              >
                <Pencil className="h-4 w-4" />
                {t("universityPage.edit")}
              </Link>
              <Link
                href={`/admin/brands/${brand.slug}/university/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                {t("universityPage.configureSection")}
              </Link>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="admin-panel-soft p-6">
              <div className="admin-icon-tile">
                <FileStack className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                {t("universityPage.snapshotEyebrow")}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                {t("universityPage.snapshotTitle")}
              </h2>
              <p className="admin-muted mt-3">
                {brand.description ||
                  t("universityPage.snapshotEmptyDescription")}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MetricCard
                  label={t("universityPage.programsLabel")}
                  value={String(programs.length)}
                  helper={t("universityPage.goToProgramsBase")}
                  href={`/admin/brands/${brand.slug}/programs`}
                />
                <MetricCard
                  label={t("universityPage.programTypesLabel")}
                  value={
                    uniqueProgramTypes.length > 0
                      ? uniqueProgramTypes.join(", ")
                      : t("universityPage.pendingStructure")
                  }
                  helper={t("universityPage.portfolioDetected")}
                />
              </div>
            </div>

            <div className="admin-panel-soft p-6">
              <div className="admin-icon-tile">
                <Compass className="h-5 w-5" />
              </div>
              <p className="admin-eyebrow mt-5">Institutional Essence</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                {language === "en"
                  ? "What it is, what it does, and who it serves"
                  : "Lo que es, que hace y para quien"}
              </h2>
              {hasProfile && profile ? (
                <div className="mt-5 grid gap-3">
                  <InfoBlock
                    label={language === "en" ? "What it is" : "Lo que es"}
                    value={profile.institutionalEssence.whatItIs}
                  />
                  <InfoBlock
                    label={language === "en" ? "What it does" : "Que hace"}
                    value={profile.institutionalEssence.whatItDoes}
                  />
                  <InfoBlock
                    label={language === "en" ? "Who it serves" : "Para quien"}
                    value={profile.institutionalEssence.whoItServes}
                  />
                </div>
              ) : (
                <p className="admin-muted mt-3">
                  {language === "en"
                    ? "This institutional layer is ready to be configured without duplicating brand or program data."
                    : "Esta capa institucional queda lista para configurarse sin duplicar datos de marca o programas."}
                </p>
              )}
            </div>
          </div>

          {hasProfile && profile ? (
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <StatementCard
                icon={Target}
                eyebrow="Mission"
                title={language === "en" ? "Mission" : "Mision"}
                statement={profile.mission.statement}
                items={profile.mission.keyFocusAreas}
              />
              <StatementCard
                icon={Sparkles}
                eyebrow="Vision"
                title={language === "en" ? "Vision" : "Vision"}
                statement={profile.vision.statement}
                helper={profile.vision.targetYear}
                items={profile.vision.aspirations}
              />
              <ItemsSection
                title={language === "en" ? "Core values" : "Valores centrales"}
                icon={Lightbulb}
                items={profile.coreValues}
              />
              <ItemsSection
                title={
                  language === "en"
                    ? "Guiding principles"
                    : "Principios orientadores"
                }
                icon={Compass}
                items={profile.guidingPrinciples}
              />
              <StatementCard
                icon={BookOpenText}
                eyebrow="Philosophy"
                title={
                  language === "en"
                    ? "Institutional philosophy"
                    : "Filosofia institucional"
                }
                statement={profile.institutionalPhilosophy.educationalModel}
                items={[
                  profile.institutionalPhilosophy.learningApproach,
                  profile.institutionalPhilosophy.studentCenteredFocus,
                ]}
              />
              <TimelineSection
                title={language === "en" ? "History" : "Historia"}
                overview={profile.history.overview}
                milestones={profile.history.milestones}
              />
              <ItemsSection
                title={
                  language === "en"
                    ? "Strategic objectives"
                    : "Objetivos estrategicos"
                }
                icon={Target}
                items={profile.strategicObjectives}
              />
              <ListSection
                title={
                  language === "en"
                    ? "Student experience"
                    : "Experiencia del estudiante"
                }
                icon={Users}
                intro={profile.studentExperience.campusLife}
                groups={[
                  {
                    label:
                      language === "en"
                        ? "Student support"
                        : "Servicios de apoyo",
                    items: profile.studentExperience.studentSupportServices,
                  },
                  {
                    label:
                      language === "en"
                        ? "Leadership"
                        : "Oportunidades de liderazgo",
                    items: profile.studentExperience.leadershipOpportunities,
                  },
                  {
                    label:
                      language === "en"
                        ? "International programs"
                        : "Programas internacionales",
                    items: profile.studentExperience.internationalPrograms,
                  },
                ]}
              />
              <ListSection
                title={
                  language === "en"
                    ? "Research and innovation"
                    : "Investigacion e innovacion"
                }
                icon={Lightbulb}
                groups={[
                  {
                    label:
                      language === "en"
                        ? "Research areas"
                        : "Areas de investigacion",
                    items: profile.researchAndInnovation.researchAreas,
                  },
                  {
                    label:
                      language === "en"
                        ? "Innovation initiatives"
                        : "Iniciativas de innovacion",
                    items: profile.researchAndInnovation.innovationInitiatives,
                  },
                  {
                    label:
                      language === "en"
                        ? "Industry partnerships"
                        : "Alianzas con industria",
                    items: profile.researchAndInnovation.industryPartnerships,
                  },
                ]}
              />
              <ListSection
                title={
                  language === "en"
                    ? "Community engagement"
                    : "Relacion con la comunidad"
                }
                icon={Users}
                groups={[
                  {
                    label:
                      language === "en" ? "Social impact" : "Impacto social",
                    items: profile.communityEngagement.socialImpactPrograms,
                  },
                  {
                    label:
                      language === "en"
                        ? "Community partnerships"
                        : "Alianzas comunitarias",
                    items: profile.communityEngagement.communityPartnerships,
                  },
                  {
                    label:
                      language === "en"
                        ? "Sustainability"
                        : "Sostenibilidad",
                    items:
                      profile.communityEngagement.sustainabilityInitiatives,
                  },
                ]}
              />
              <ListSection
                title={
                  language === "en" ? "Graduate profile" : "Perfil del egresado"
                }
                icon={GraduationCap}
                intro={profile.graduateProfile.description}
                groups={[
                  {
                    label:
                      language === "en" ? "Competencies" : "Competencias",
                    items: profile.graduateProfile.competencies,
                  },
                  {
                    label:
                      language === "en"
                        ? "Professional skills"
                        : "Habilidades profesionales",
                    items: profile.graduateProfile.professionalSkills,
                  },
                  {
                    label:
                      language === "en"
                        ? "Ethical commitments"
                        : "Compromisos eticos",
                    items: profile.graduateProfile.ethicalCommitments,
                  },
                ]}
              />
              <ListSection
                title={
                  language === "en" ? "Faculty profile" : "Perfil docente"
                }
                icon={BookOpenText}
                intro={profile.facultyProfile.overview}
                groups={[
                  {
                    label:
                      language === "en" ? "Qualifications" : "Formacion",
                    items: profile.facultyProfile.qualifications,
                  },
                  {
                    label:
                      language === "en"
                        ? "Teaching strengths"
                        : "Fortalezas pedagogicas",
                    items: profile.facultyProfile.teachingStrengths,
                  },
                ]}
              />
              <ItemsSection
                title={
                  language === "en"
                    ? "Competitive advantages"
                    : "Ventajas competitivas"
                }
                icon={Sparkles}
                items={profile.competitiveAdvantages}
              />
              <ListSection
                title={
                  language === "en" ? "Brand identity" : "Identidad de marca"
                }
                icon={Sparkles}
                intro={profile.brandIdentity.brandPromise}
                groups={[
                  {
                    label:
                      language === "en"
                        ? "Brand personality"
                        : "Personalidad de marca",
                    items: profile.brandIdentity.brandPersonality,
                  },
                  {
                    label:
                      language === "en"
                        ? "Unique value proposition"
                        : "Propuesta unica de valor",
                    items: [profile.brandIdentity.uniqueValueProposition],
                  },
                ]}
              />
            </div>
          ) : (
            <section className="admin-empty-state mt-6">
              <div className="admin-icon-tile mx-auto">
                <BookOpenText className="h-5 w-5" />
              </div>
              <p className="admin-eyebrow mt-5">University Content Base</p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                {language === "en"
                  ? "Institutional profile not configured yet"
                  : "Perfil institucional aun no configurado"}
              </h2>
              <p className="admin-muted mx-auto mt-3 max-w-2xl">
                {language === "en"
                  ? "Use this layer for mission, vision, values, culture, student experience, and institutional differentiators."
                  : "Usa esta capa para mision, vision, valores, cultura, experiencia estudiantil y diferenciales institucionales."}
              </p>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  helper,
  href,
}: {
  label: string;
  value: string;
  helper: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[var(--bunji-primary)]">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {helper}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
      {content}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function StatementCard({
  icon: Icon,
  eyebrow,
  title,
  statement,
  helper,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  statement: string;
  helper?: string;
  items: string[];
}) {
  const filteredItems = items.filter(Boolean);

  if (!statement && !helper && filteredItems.length === 0) return null;

  return (
    <section className="admin-panel-soft p-6">
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>
      <p className="admin-eyebrow mt-5">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      {helper ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bunji-primary)]">
          {helper}
        </p>
      ) : null}
      {statement ? <p className="admin-muted mt-3">{statement}</p> : null}
      <PillList items={filteredItems} />
    </section>
  );
}

function ItemsSection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: DescriptionItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="admin-panel-soft p-6">
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div
            key={`${item.title}-${item.description}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            {item.title ? (
              <p className="font-semibold text-slate-950 dark:text-slate-50">
                {item.title}
              </p>
            ) : null}
            {item.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineSection({
  title,
  overview,
  milestones,
}: {
  title: string;
  overview: string;
  milestones: Array<{ year: string; event: string }>;
}) {
  if (!overview && milestones.length === 0) return null;

  return (
    <section className="admin-panel-soft p-6">
      <div className="admin-icon-tile">
        <History className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      {overview ? <p className="admin-muted mt-3">{overview}</p> : null}
      <div className="mt-5 space-y-3">
        {milestones.map((item) => (
          <div
            key={`${item.year}-${item.event}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bunji-primary)]">
              {item.year}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {item.event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListSection({
  title,
  icon: Icon,
  intro = "",
  groups,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  intro?: string;
  groups: Array<{ label: string; items: string[] }>;
}) {
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter(Boolean),
    }))
    .filter((group) => group.items.length > 0);

  if (!intro && visibleGroups.length === 0) return null;

  return (
    <section className="admin-panel-soft p-6">
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      {intro ? <p className="admin-muted mt-3">{intro}</p> : null}
      <div className="mt-5 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {group.label}
            </p>
            <PillList items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PillList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
