import { ExternalLink } from "lucide-react";
import { normalizeBrandColorPalette } from "@/lib/brandColors";
import type { Brand } from "@/lib/data";
import type { DashboardLanguage } from "@/lib/dashboardI18n";

type Props = {
  brand: Brand;
  language: DashboardLanguage;
  className?: string;
};

export default function BrandSnapshotCard({
  brand,
  language,
  className = "",
}: Props) {
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

  return (
    <aside
      className={`relative h-fit overflow-hidden rounded-xl border border-white/10 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.32)] ${className}`}
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
              <span className="text-sm font-semibold text-white/60">Logo</span>
            )}
          </div>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
          {ui(language, "brandSnapshot")}
        </p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight">
          {brand.name}
        </h2>

        {brand.description ? (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {ui(language, "description")}
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
                {ui(language, "officialWebsite")}
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
              {ui(language, "colors")}
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
                        {ui(language, "primary")}
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
                        {ui(language, "secondary")}
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
    </aside>
  );
}

function ui(
  language: DashboardLanguage,
  key:
    | "brandSnapshot"
    | "description"
    | "officialWebsite"
    | "colors"
    | "primary"
    | "secondary",
) {
  const map = {
    en: {
      brandSnapshot: "Brand Snapshot",
      description: "Description",
      officialWebsite: "Official website",
      colors: "Colors",
      primary: "Primary",
      secondary: "Secondary",
    },
    es: {
      brandSnapshot: "Brand Snapshot",
      description: "Descripcion",
      officialWebsite: "Sitio oficial",
      colors: "Colores",
      primary: "Primario",
      secondary: "Secundario",
    },
  } as const;

  return map[language][key];
}
