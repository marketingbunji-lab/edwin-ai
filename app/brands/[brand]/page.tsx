import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getBrandBySlug } from "../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../lib/supabaseBrands";
import { normalizeBrandColorPalette } from "../../../lib/brandColors";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

type TimelineStep = {
  step: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;

  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const steps: TimelineStep[] = [
    {
      step: "01",
      title: "Agente de Branding Estrategico",
      description:
        "Disena y ejecuta marcas academicas alineadas con objetivos de matricula, usando datos e insights de IA.",
      href: `/admin/brands/${brand.slug}/edit`,
      linkLabel: "Editar datos de marca",
    },
    {
      step: "02",
      title: "Agente de Buyer Persona",
      description:
        "Define perfiles de estudiante ideal, motivaciones, objeciones y mensajes clave para orientar la captacion.",
      href: `/admin/brands/${brand.slug}/buyer-person`,
      linkLabel: "Editar Buyer Persona",
    },
    {
      step: "03",
      title: "Agente de contenido",
      description:
        "Disena tu contenido base para alinear mensajes, formatos y canales para una comunicacion de marca consistente y escalable.",
      href: `/admin/brands/${brand.slug}/programs`,
      linkLabel: "Editar Agente de Contenido",
    },
    {
      step: "04",
      title: "Agente de recursos visuales",
      description:
        "Organiza los activos visuales, referencias graficas y materiales de marca para producir piezas consistentes.",
      href: `/admin/brands/${brand.slug}/visual-assets`,
      linkLabel: "Editar Visual Assets",
    },
    {
      step: "05",
      title: "Agente de landings",
      description:
        "Disena tu landing page para atraer y convertir leads en estudiantes.",
        href: `/admin/brands/${brand.slug}/landings/`,
      linkLabel: "Editar landings de marca",
    },
  ];
  const previewLogo = brand.logos?.light || brand.logo || "";
  const primaryColor = brand.primaryColor || "";
  const secondaryColor = brand.secondaryColor || "";
  const colorPalette = normalizeBrandColorPalette(brand);
  const previewBackground =
    colorPalette.primary?.darkest || primaryColor || "#020617";
  const previewPrimaryDark = colorPalette.primary?.dark || primaryColor || "#111827";
  const previewPrimaryLight =
    colorPalette.primary?.light || "rgba(255,255,255,0.16)";
  const previewSecondaryLight =
    colorPalette.secondary?.light || secondaryColor || "#A78BFA";

  return (
    <main className="admin-page">
      <div className="w-full">
        <Link
          href="/admin/brands"
          className="mb-6 inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a marcas
        </Link>

        <section
          id="brand-agent-preview"
          className="mb-8 grid gap-6 xl:grid-cols-3"
        >
          <div className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 xl:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
              Enrollment Automation
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
              Paso a paso, todo el ciclo de matricula del estudiante
            </h2>

            <div className="mt-8">
              <ol className="relative space-y-7">
                <span className="absolute left-[11px] top-3 h-[calc(100%-1.5rem)] w-px bg-slate-200 dark:bg-slate-800" />
                {steps.map((item, index) => {
                  const isActive = index === 0;

                  return (
                    <li key={item.step} className="relative flex gap-4">
                      <span
                        className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          isActive
                            ? "border-[var(--bunji-primary)] bg-white text-[var(--bunji-primary)] dark:bg-slate-950 dark:text-[var(--bunji-primary-muted)]"
                            : "border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </span>

                      <div className="pb-1">
                        <h3
                          className={`text-sm font-semibold ${
                            isActive
                              ? "text-slate-950 dark:text-slate-50"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-8 text-slate-500 dark:text-slate-500">
                          {item.description}
                        </p>
                        {item.href && item.linkLabel ? (
                          <Link
                            href={item.href}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--bunji-primary)] underline-offset-4 hover:underline dark:text-[var(--bunji-primary-muted)]"
                          >
                            {item.linkLabel}
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div
            className="relative overflow-hidden border border-white/10 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.32)] xl:col-span-1"
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
              style={{ backgroundColor: `${secondaryColor || previewSecondaryLight}44` }}
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
                <span className="text-sm font-semibold text-white/60">Logo</span>
              )}
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
              Brand Agent Preview
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              {brand.name}
            </h1>

            {brand.description ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Descripcion
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

            <div className="mt-4">
              <div>
                <Link
                  href={`/admin/brands/${brand.slug}/edit`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.12)] transition hover:scale-[1.01] hover:bg-[var(--bunji-primary-muted)]"
                >
                  Editar datos de marca
                </Link>
              </div>
            </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
