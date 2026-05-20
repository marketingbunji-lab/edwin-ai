import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Brush,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  FileStack,
  Pencil,
  Shapes,
  Users,
  Clock3,
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

type WorkflowStatus = "done" | "in_progress" | "empty";

type WorkflowStage = {
  step: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  href: string;
  ctaLabel: string;
  unlocks: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
};

function getStatusLabel(status: WorkflowStatus) {
  if (status === "done") {
    return "Done";
  }

  if (status === "in_progress") {
    return "In progress";
  }

  return "Empty";
}

function getStatusStyles(status: WorkflowStatus) {
  if (status === "done") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
  }

  if (status === "in_progress") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300";
  }

  return "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";
}

function getStatusIcon(status: WorkflowStatus) {
  if (status === "done") {
    return CheckCircle2;
  }

  if (status === "in_progress") {
    return Clock3;
  }

  return CircleDashed;
}

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
  const brandSetupStarted = brandSetupSignals >= 2 || Boolean(brand.name?.trim());
  const buyerPersonaDone = buyerPersonRecords.length > 0;
  const programsDone = programs.length > 0;
  const assetsDone = visualAssets.length > 0;
  const landingDone = publishedLandings.length > 0;

  const stages: WorkflowStage[] = [
    {
      step: "01",
      title: "Brand Setup",
      description:
        "Consolidamos identidad, sitio oficial, logo y sistema visual para darle contexto confiable al resto de agentes.",
      status: brandSetupDone
        ? "done"
        : brandSetupStarted
          ? "in_progress"
          : "empty",
      href: `/admin/brands/${brand.slug}/edit`,
      ctaLabel: "Configurar marca",
      unlocks:
        "Desbloquea una base clara para definir mensajes, tono y lineamientos visuales consistentes.",
      summary: `${brandSetupSignals}/5 señales base completadas`,
      icon: Pencil,
    },
    {
      step: "02",
      title: "Buyer Persona",
      description:
        "Definimos a quién le hablamos, qué le mueve a avanzar y qué objeciones debemos resolver en el journey.",
      status: buyerPersonaDone
        ? "done"
        : brandSetupDone
          ? "in_progress"
          : "empty",
      href: `/admin/brands/${brand.slug}/buyer-person/new`,
      ctaLabel: "Crear buyer persona",
      unlocks:
        "Desbloquea mensajes más precisos para contenidos, landings, anuncios y CRM.",
      summary: `${buyerPersonRecords.length} perfiles creados`,
      icon: Users,
    },
    {
      step: "03",
      title: "Content Base",
      description:
        "Estructuramos la información de programas y el contenido central que alimenta copies, beneficios y bloques de conversión.",
      status: programsDone
        ? "done"
        : buyerPersonaDone
          ? "in_progress"
          : "empty",
      href: `/admin/brands/${brand.slug}/programs/new`,
      ctaLabel: "Crear programa",
      unlocks:
        "Desbloquea una narrativa consistente para landings, campañas y activos por programa.",
      summary: `${programs.length} programas estructurados`,
      icon: FileStack,
    },
    {
      step: "04",
      title: "Visual Assets",
      description:
        "Organizamos piezas visuales y referencias para que creatividad, diseño y agentes trabajen con un lenguaje común.",
      status: assetsDone
        ? "done"
        : programsDone
          ? "in_progress"
          : "empty",
      href: `/admin/brands/${brand.slug}/visual-assets`,
      ctaLabel: "Generar assets",
      unlocks:
        "Desbloquea creatividad reutilizable para campañas, anuncios, hero sections y materiales comerciales.",
      summary: `${visualAssets.length} assets disponibles`,
      icon: Brush,
    },
    {
      step: "05",
      title: "Landing Activation",
      description:
        "Diseñamos, publicamos y conectamos las landings para convertir tráfico en leads listos para CRM y campañas.",
      status: landingDone
        ? "done"
        : assetsDone || landings.length > 0
          ? "in_progress"
          : "empty",
      href: `/admin/brands/${brand.slug}/landings`,
      ctaLabel: "Crear landing",
      unlocks:
        "Desbloquea captación activa, publicación pública y conexión directa con formularios y automatizaciones.",
      summary: `${publishedLandings.length}/${landings.length} landings publicadas`,
      icon: Shapes,
    },
  ];

  const completedStages = stages.filter((stage) => stage.status === "done").length;
  const progressPercentage = Math.round((completedStages / stages.length) * 100);
  const nextStage =
    stages.find((stage) => stage.status !== "done") ?? stages[stages.length - 1];
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

            <Link
              href={nextStage.href}
              className="admin-button-primary"
            >
              <NextStageIcon className="h-4 w-4" />
              {nextStage.ctaLabel}
            </Link>
          </div>
        </div>

        <section
          id="brand-orchestration-control-room"
          className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]"
        >
          <div className="space-y-6">
            <section className="admin-panel p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
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

                <div className="min-w-[220px] rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Progreso
                  </p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                    {progressPercentage}%
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {completedStages} de {stages.length} etapas completadas
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[var(--bunji-primary)] transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

            <section className="space-y-4">
              {stages.map((stage) => {
                const StageStatusIcon = getStatusIcon(stage.status);
                const StageIcon = stage.icon;
                const isNextStage = nextStage.step === stage.step;

                return (
                  <article
                    key={stage.step}
                    className={`admin-panel p-6 transition-all ${
                      isNextStage
                        ? "ring-1 ring-[var(--bunji-primary-soft)] dark:ring-[var(--bunji-primary-muted)]/30"
                        : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="admin-icon-tile mt-1">
                          <StageIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                              Etapa {stage.step}
                            </span>
                            {isNextStage ? (
                              <span className="rounded-full border border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--bunji-primary)] dark:border-[var(--bunji-primary-muted)]/30 dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)]">
                                Siguiente paso
                              </span>
                            ) : null}
                          </div>

                          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                            {stage.title}
                          </h2>
                          <p className="admin-muted mt-3 max-w-3xl leading-7">
                            {stage.description}
                          </p>

                          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                Estado derivado
                              </p>
                              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                {stage.summary}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                Qué desbloquea
                              </p>
                              <p className="mt-2 text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                                {stage.unlocks}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full max-w-[240px] flex-col items-stretch gap-3 sm:w-auto">
                        <div
                          className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${getStatusStyles(
                            stage.status,
                          )}`}
                        >
                          <StageStatusIcon className="h-4 w-4" />
                          {getStatusLabel(stage.status)}
                        </div>

                        <Link href={stage.href} className="admin-button-primary">
                          <StageIcon className="h-4 w-4" />
                          {stage.ctaLabel}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
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

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Próxima acción recomendada
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {nextStage.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  {nextStage.unlocks}
                </p>
                <Link
                  href={nextStage.href}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.12)] transition hover:scale-[1.01] hover:bg-[var(--bunji-primary-muted)]"
                >
                  <NextStageIcon className="h-4 w-4" />
                  {nextStage.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
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
