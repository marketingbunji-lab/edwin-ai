/* eslint-disable @next/next/no-img-element */
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import type { Landing, LabelValueItem } from "@/lib/data";
import DefaultLandingSummaryCardsSection from "./DefaultLandingSummaryCardsSection";
import { landingContainerClass } from "./classes";

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

export default function DefaultLandingHeroSectionB({
  menuItems,
  menuCtaLabel,
  logo,
  brandName,
  eyebrowText,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroSupportText,
  resolutionText,
  summaryItems,
  mode,
  backgroundImage,
  liveEdit,
  showMenu = true,
}: Props) {
  const heroBackground = backgroundImage
    ? `url("${backgroundImage}") center / cover no-repeat`
    : "none";
  const heroSpacingClass =
    mode === "preview"
      ? "pt-5 pb-24 md:pb-32"
      : "pt-[108px] pb-24 sm:pt-[120px] lg:pt-[170px] md:pb-32";

  return (
    <section
      data-live-image-path={liveEdit?.enabled && backgroundImage ? "hero.backgroundImage" : undefined}
      data-live-image-label="Imagen de fondo del hero"
      data-live-image-value={backgroundImage}
      title={liveEdit?.enabled && backgroundImage ? "Click para reemplazar esta imagen" : undefined}
      className={`relative overflow-hidden text-[var(--landing-primary-text)] ${
        liveEdit?.enabled && backgroundImage
          ? "cursor-pointer outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-[-8px]"
          : ""
      }`}
      style={{ background: heroBackground }}
    >
      <div className={`${landingContainerClass} ${heroSpacingClass}`}>
        {showMenu && (menuItems.length > 0 || menuCtaLabel) ? (
          <div className="sticky top-2 z-50 mb-10 overflow-hidden rounded-[24px] border border-white/25 bg-slate-950/35 p-2 shadow-[0_18px_40px_rgba(2,6,23,0.22)] backdrop-blur-xl sm:top-4 sm:rounded-[28px] sm:p-3">
            <nav
              aria-label="Navegación de secciones"
              className="grid w-full items-center gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto]"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={brandName}
                  data-landing-logo-mode-control={liveEdit?.enabled ? "true" : undefined}
                  className={`h-auto max-w-full rounded-lg object-contain object-left ${
                    liveEdit?.enabled
                      ? "outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-4 transition hover:bg-[var(--bunji-primary,#6d5dfc)]/10"
                      : ""
                  }`}
                  style={{ width: "clamp(180px, 24vw, 340px)" }}
                />
              ) : null}

              <div className="grid w-full min-w-0 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:flex md:flex-wrap lg:gap-x-5">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="min-w-0 max-w-full whitespace-normal break-words text-sm font-semibold leading-snug text-white/88 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <a
                href="#default-form"
                className="inline-flex min-h-11 items-center justify-center justify-self-start rounded-full border border-[var(--landing-secondary-light)] bg-[linear-gradient(135deg,var(--landing-secondary),var(--landing-secondary-dark))] px-5 py-2.5 text-sm font-extrabold text-[var(--landing-secondary-text)] shadow-[0_14px_34px_color-mix(in_srgb,var(--landing-secondary)_35%,transparent)] transition hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:justify-self-end"
              >
                {menuCtaLabel}
              </a>
            </nav>
          </div>
        ) : null}

        <div className="grid min-w-0 items-center gap-14 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] max-sm:pb-[72px]">
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

            {heroDescription ? (
              <LiveEditableText
                as="p"
                path="hero.description"
                value={heroDescription}
                liveEdit={liveEdit}
                className="mt-6 mb-6 block max-w-full text-lg leading-8 text-[var(--landing-primary-text)] opacity-90 sm:max-w-[720px]"
              />
            ) : null}

            {heroSupportText ? (
              <LiveEditableText
                as="p"
                path="hero.supportText"
                value={heroSupportText}
                liveEdit={liveEdit}
                className="mt-[18px] block max-w-full text-lg leading-8 text-inherit opacity-90 sm:max-w-[680px]"
              />
            ) : null}

            {summaryItems.length > 0 ? (
              <DefaultLandingSummaryCardsSection
                items={summaryItems}
                embedded
                liveEdit={liveEdit}
              />
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

          <div className="min-w-0" />
        </div>
      </div>
    </section>
  );
}
