import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import type { Landing, LabelValueItem } from "@/lib/data";
import { landingContainerClass } from "./classes";
import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Monitor,
} from "../templateIcons";

type Props = {
  menuItems: Array<{
    id: string;
    label: string;
  }>;
  menuCtaLabel: string;
  logo: string;
  brandName: string;
  eyebrowText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroSupportText: string;
  price: string;
  discountedPrice: string;
  discountPercentage: string;
  discountSuffix: string;
  resolutionText: string;
  summaryItems: LabelValueItem[];
  fullTitle: string;
  title: string;
  form: NonNullable<Landing["form"]>;
  ctaButton: string;
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  zipLabel: string;
  primaryColor: string;
  mode: "preview" | "export";
  hasConfiguredForm: boolean;
  backgroundImage: string;
  heroOverlayColor: string;
  liveEdit?: LandingLiveEditConfig;
  showMenu?: boolean;
};

function normalizeSummaryLabel(label?: string) {
  return (label || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function DefaultLandingHeroSectionB({
  eyebrowText,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroSupportText,
  resolutionText,
  summaryItems,
  mode,
  backgroundImage,
  heroOverlayColor,
  liveEdit,
}: Props) {
  const heroBackground = backgroundImage
    ? `url("${backgroundImage}") center / cover no-repeat`
    : "none";
  const heroSpacingClass =
    mode === "preview"
      ? "pt-5 pb-24 md:pb-28"
      : "pt-[108px] pb-24 sm:pt-[120px] lg:pt-[170px] md:pb-32";
  const highlightItem =
    summaryItems.find((item) =>
      /titulo|degree|credential/.test(normalizeSummaryLabel(item.label)),
    ) ?? summaryItems[0];
  const detailItems = summaryItems
    .filter((item) => item !== highlightItem)
    .slice(0, 4);
  const metaLines = [heroDescription, heroSupportText].filter((value) =>
    value?.trim(),
  );

  const getItemIcon = (label?: string) => {
    const normalizedLabel = normalizeSummaryLabel(label);

    if (!normalizedLabel) return BookOpen;
    if (/duracion|duration|semestre|semester|time/.test(normalizedLabel))
      return Clock;
    if (/credito|credit|snies|registro|acredit/.test(normalizedLabel))
      return Award;
    if (/modalidad|modality|format|virtual|online/.test(normalizedLabel))
      return Monitor;
    if (/area|knowledge|disciplina|field/.test(normalizedLabel))
      return BookOpen;
    if (/titulo|degree|credential/.test(normalizedLabel)) return GraduationCap;
    return CalendarDays;
  };

  return (
    <section
      data-live-image-path={
        liveEdit?.enabled && backgroundImage
          ? "hero.backgroundImage"
          : undefined
      }
      data-live-image-label="Imagen de fondo del hero"
      data-live-image-value={backgroundImage}
      title={
        liveEdit?.enabled && backgroundImage
          ? "Click para reemplazar esta imagen"
          : undefined
      }
      className={`relative overflow-hidden text-[var(--landing-primary-text)] ${
        liveEdit?.enabled && backgroundImage
          ? "cursor-pointer outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-[-8px]"
          : ""
      }`}
      style={{ background: heroBackground }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, rgba(8,16,33,0.94) 0%, rgba(8,16,33,0.72) 40%, rgba(8,16,33,0.28) 66%, rgba(8,16,33,0) 100%), linear-gradient(180deg, rgba(8,16,33,0.18), ${heroOverlayColor})`,
        }}
      />
      <div className={`${landingContainerClass} ${heroSpacingClass}`}>
        <div className="relative z-10 grid min-w-0 items-center gap-8 py-4 lg:min-h-[520px] lg:content-center max-sm:pb-[72px]">
          <div className="min-w-0">
            {eyebrowText ? (
              <p className="mb-[18px] inline-flex items-center rounded-full border border-white/70 bg-white/10 px-[14px] py-2 text-[13px] font-extrabold text-[var(--landing-primary-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
                <LiveEditableText
                  path="hero.eyebrow"
                  value={eyebrowText}
                  liveEdit={liveEdit}
                  singleLine
                />
              </p>
            ) : null}

            {heroTitle ? (
              <LiveEditableText
                as="h1"
                path="hero.title"
                value={heroTitle}
                liveEdit={liveEdit}
                singleLine
                className="m-0 block max-w-full text-5xl font-bold leading-tight tracking-tight text-[var(--landing-primary-text)] sm:max-w-[940px] sm:text-6xl md:text-8xl"
              />
            ) : null}

            {heroSubtitle ? (
              <LiveEditableText
                as="p"
                path="hero.subtitle"
                value={heroSubtitle}
                liveEdit={liveEdit}
                singleLine
                className="mt-[18px] max-w-full text-xl font-bold leading-tight tracking-tight text-inherit opacity-90 sm:text-2xl md:text-3xl"
              />
            ) : null}

            {metaLines.length > 0 ? (
              <div className="mt-6 max-w-[600px]">
                <div className="mb-4 h-[3px] w-12 rounded-full bg-[var(--landing-secondary)]" />
                {heroDescription ? (
                  <LiveEditableText
                    as="p"
                    path="hero.description"
                    value={heroDescription}
                    liveEdit={liveEdit}
                    className="text-sm leading-[1.55] text-white/82"
                  />
                ) : null}
                {heroSupportText ? (
                  <LiveEditableText
                    as="p"
                    path="hero.supportText"
                    value={heroSupportText}
                    liveEdit={liveEdit}
                    className="mt-1.5 text-sm leading-[1.55] text-white/62"
                  />
                ) : null}
              </div>
            ) : null}

            {highlightItem ? (
              <article className="mt-6 w-full max-w-[560px] rounded-[20px] border border-white/18 bg-white/10 p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-[20px]">
                <div className="border-b border-white/14 pb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--landing-secondary)]">
                    <LiveEditableText
                      path={`summaryCards.${summaryItems.indexOf(highlightItem)}.label`}
                      value={highlightItem.label || ""}
                      liveEdit={liveEdit}
                      singleLine
                    />
                  </p>
                  <p className="mt-1.5 text-[22px] font-bold leading-[1.15] text-white">
                    <LiveEditableText
                      path={`summaryCards.${summaryItems.indexOf(highlightItem)}.value`}
                      value={highlightItem.value || ""}
                      liveEdit={liveEdit}
                      singleLine
                    />
                  </p>
                </div>

                {detailItems.length > 0 ? (
                  <div className="grid gap-x-4 gap-y-5 pt-5 sm:grid-cols-2">
                    {detailItems.map((item) => {
                      const Icon = getItemIcon(item.label);
                      const itemIndex = summaryItems.indexOf(item);

                      return (
                        <div
                          key={`${item.label}-${itemIndex}`}
                          className="flex gap-3"
                        >
                          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] border border-white/14 bg-white/10 text-white">
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-white/62">
                              <LiveEditableText
                                path={`summaryCards.${itemIndex}.label`}
                                value={item.label || ""}
                                liveEdit={liveEdit}
                                singleLine
                              />
                            </p>
                            <p className="mt-1 text-[15px] font-bold leading-[1.2] text-white">
                              <LiveEditableText
                                path={`summaryCards.${itemIndex}.value`}
                                value={item.value || ""}
                                liveEdit={liveEdit}
                                singleLine
                              />
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            ) : null}

            {resolutionText ? (
              <p className="mt-4 max-w-[860px] text-[11px] leading-5 text-white/58 md:text-xs">
                <LiveEditableText
                  path="certifications.resolutionText"
                  value={resolutionText}
                  liveEdit={liveEdit}
                />
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
