import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Brush,
  ExternalLink,
  FileStack,
  Pencil,
  Shapes,
  Users,
} from "lucide-react";
import {
  getBrandBySlug,
  getLandingsByBrand,
  getProgramsByBrand,
} from "../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../lib/supabaseBrands";
import { normalizeBrandColorPalette } from "../../../lib/brandColors";
import { getBrandAgentRecords } from "@/lib/brandAgentRecords";

export const dynamic = "force-dynamic";

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
  const { brand: brandSlug } = await params;

  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);
  const landings = getLandingsByBrand(brand.slug);
  const buyerPersonRecords = getBrandAgentRecords(brand.slug, "buyer-person");
  const visualAssets = getBrandAgentRecords(brand.slug, "visual-assets");
  const publishedLandings = landings.filter(
    (landing) => landing.status === "published",
  );

  const previewLogo = brand.logos?.light || brand.logo || "";
  const primaryColor = brand.primaryColor || "";
  const secondaryColor = brand.secondaryColor || "";
  const colorPalette = normalizeBrandColorPalette(brand);
  const previewBackground =
    colorPalette.primary?.darkest || primaryColor || "#020617";
  const previewPrimaryDark =
    colorPalette.primary?.dark || primaryColor || "#111827";
  const previewPrimaryLight =
    colorPalette.primary?.light || "rgba(255,255,255,0.16)";
  const previewSecondaryLight =
    colorPalette.secondary?.light || secondaryColor || "#A78BFA";

  const brandSetupSignals = [
    brand.description,
    brand.officialWebsite,
    previewLogo,
    primaryColor,
    secondaryColor,
  ].filter((value) => Boolean(value?.trim())).length;

  const brandSetupDone = brandSetupSignals >= 5;
  const buyerPersonaDone = buyerPersonRecords.length > 0;
  const programsDone = programs.length > 0;
  const assetsDone = visualAssets.length > 0;
  const landingDone = publishedLandings.length > 0;
  const universityContentBaseDone = false;
  const goldenCircleDone = false;

  const stages: WorkflowStage[] = [
    {
      title: "Brand Setup",
      href: `/admin/brands/${brand.slug}/edit`,
      ctaLabel: "Configurar marca",
      unlocks:
        "Desbloquea una base clara para definir mensajes, tono y lineamientos visuales consistentes.",
      icon: Pencil,
    },
    {
      title: "Buyer Persona",
      href: `/admin/brands/${brand.slug}/buyer-person/new`,
      ctaLabel: "Crear buyer persona",
      unlocks:
        "Desbloquea mensajes más precisos para contenidos, landings, anuncios y CRM.",
      icon: Users,
    },
    {
      title: "Content Base",
      href: `/admin/brands/${brand.slug}/programs/new`,
      ctaLabel: "Crear programa",
      unlocks:
        "Desbloquea una narrativa consistente para landings, campañas y activos por programa.",
      icon: FileStack,
    },
    {
      title: "Visual Assets",
      href: `/admin/brands/${brand.slug}/visual-assets`,
      ctaLabel: "Generar assets",
      unlocks:
        "Desbloquea creatividad reutilizable para campañas, anuncios, hero sections y materiales comerciales.",
      icon: Brush,
    },
    {
      title: "Landing Activation",
      href: `/admin/brands/${brand.slug}/landings`,
      ctaLabel: "Crear landing",
      unlocks:
        "Desbloquea captación activa, publicación pública y conexión directa con formularios y automatizaciones.",
      icon: Shapes,
    },
  ];

  const knowledgeBaseProgress = Math.round(
    ((Number(brandSetupDone) +
      Number(brandSetupDone && programsDone) +
      Number(brandSetupDone && programsDone && universityContentBaseDone) +
      Number(
        brandSetupDone &&
          programsDone &&
          universityContentBaseDone &&
          goldenCircleDone,
      )) /
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
            <Link
              href="/admin/brands"
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a marcas"
              title="Volver a marcas"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

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
              <div className="max-w-3xl">
                <p className="admin-eyebrow">Control Room</p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                  {brand.name}
                </h1>
                <p className="admin-muted mt-4 max-w-2xl text-base leading-7">
                  Este workspace orquesta el avance de la marca desde la
                  configuración base hasta la activación de landings. Cada
                  etapa alimenta a la siguiente para que el sistema se sienta
                  como un flujo y no como pantallas aisladas.
                </p>
              </div>

              <div className="mt-10 grid gap-5 xl:grid-cols-2">
                <StrategicWorkflowCard
                  href={`/admin/brands/${brand.slug}/knowledge-base`}
                  eyebrow="Knowledge Base"
                  title="Nutrir la Base de Conocimiento"
                  description="Organiza programas, diferenciales, estudiantes, históricos, expertos y competidores en una columna vertebral viva."
                  helperLabel="Porcentaje completado Base de Conocimiento"
                  helperValue={knowledgeBaseProgress}
                  ctaLabel="Construir conocimiento →"
                  icon={FileStack}
                  tone="knowledge"
                />

                <StrategicWorkflowCard
                  href={`/admin/brands/${brand.slug}/journey`}
                  eyebrow="Education Agents"
                  title="Desplegar Education Agents"
                  description="Usa agentes especializados por fase para convertir el conocimiento en tareas, entregables y siguientes acciones."
                  helperLabel="Siguiente acción"
                  helperValue={nextStage.title}
                  ctaLabel="Ver journey y agentes →"
                  icon={NextStageIcon}
                  tone="agents"
                />
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetric
                  label="Buyer Personas"
                  value={buyerPersonRecords.length}
                  helper="Perfiles de audiencia"
                />
                <SummaryMetric
                  label="Programs"
                  value={programs.length}
                  helper="Contenido estructurado"
                />
                <SummaryMetric
                  label="Visual Assets"
                  value={visualAssets.length}
                  helper="Recursos listos para creatividad"
                />
                <SummaryMetric
                  label="Landings"
                  value={publishedLandings.length}
                  helper={`${landings.length} totales en la marca`}
                />
              </div>
            </section>
          </div>

          <div
            className="relative h-fit self-start overflow-hidden border border-white/10 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.32)]"
            style={{
              background:
                `radial-gradient(circle at 18% 10%, ${previewSecondaryLight}55 0%, transparent 28%), ` +
                `radial-gradient(circle at 88% 16%, ${previewPrimaryLight}66 0%, transparent 34%), ` +
                `linear-gradient(145deg, ${previewBackground} 0%, ${previewPrimaryDark} 54%, ${previewBackground} 100%)`,
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
                maskImage:
                  "radial-gradient(circle at center, black 0%, transparent 76%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -right-20 top-24 h-56 w-56 rounded-full blur-3xl"
              style={{
                backgroundColor: `${secondaryColor || previewSecondaryLight}44`,
              }}
            />

            <div className="relative">
              <div className="mb-8 flex min-h-16 w-full items-center justify-between gap-4">
                <div className="flex h-16 max-w-48 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
                  {previewLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewLogo}
                      alt={brand.name}
                      className="max-h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white/60">
                      Logo
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                Brand Snapshot
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight">
                {brand.name}
              </h2>

              {brand.description ? (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Descripción
                  </p>
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-white/78">
                    {brand.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {brand.officialWebsite ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      Sitio oficial
                    </p>
                    <a
                      href={brand.officialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex max-w-full items-center gap-2 rounded-xl border border-white/15 bg-white/[0.10] px-3 py-2 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] underline-offset-4 transition hover:bg-white/[0.16] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="truncate">{brand.officialWebsite}</span>
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Slug
                  </p>
                  <p className="mt-2 truncate font-mono text-sm text-white/70">
                    {brand.slug}
                  </p>
                </div>
              </div>

              {primaryColor || secondaryColor ? (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                    Colores
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {primaryColor ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="h-10 w-10 rounded-lg border border-white/10"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                              Primario
                            </p>
                            <p className="mt-1 text-sm font-medium text-white/80">
                              {primaryColor}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {secondaryColor ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="h-10 w-10 rounded-lg border border-white/10"
                            style={{ backgroundColor: secondaryColor }}
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                              Secundario
                            </p>
                            <p className="mt-1 text-sm font-medium text-white/80">
                              {secondaryColor}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
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
}) {
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
                  completado
                </span>
              </div>
              <div className="mt-4">
                <div className="h-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,rgba(62,57,137,0.08),rgba(125,227,234,0.12))] ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_52%,white)] dark:bg-[linear-gradient(90deg,rgba(62,57,137,0.24),rgba(125,227,234,0.12))] dark:ring-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--bunji-primary),color-mix(in_srgb,var(--bunji-cyan)_72%,white))] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_22px_rgba(125,227,234,0.28)] transition-all duration-500"
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

function SummaryMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {helper}
      </p>
    </div>
  );
}
