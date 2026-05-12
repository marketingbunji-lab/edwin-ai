/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import type { Landing } from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import GenericLeadForm from "@/components/templates/GenericLeadForm";
import type { LabelValueItem } from "@/lib/data";
import DefaultLandingSummaryCardsSection from "./DefaultLandingSummaryCardsSection";
import {
  landingContainerClass,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "./classes";

type Props = {
  logo: string;
  brandName: string;
  eyebrowText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroSupportText: string;
  summaryItems: LabelValueItem[];
  fullTitle: string;
  title: string;
  form: NonNullable<Landing["form"]>;
  ctaButton: string;
  primaryColor: string;
  mode: "preview" | "export";
  hasConfiguredForm: boolean;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  backgroundImage: string;
  heroOverlayColor: string;
};

export default function DefaultLandingHeroSection({
  logo,
  brandName,
  eyebrowText,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroSupportText,
  summaryItems,
  fullTitle,
  title,
  form,
  ctaButton,
  primaryColor,
  mode,
  hasConfiguredForm,
  primaryCtaLabel,
  primaryCtaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  backgroundImage,
  heroOverlayColor,
}: Props) {
  const hasHeroActions = Boolean(
    (primaryCtaLabel && primaryCtaUrl) || (secondaryCtaLabel && secondaryCtaUrl),
  );
  const heroBackground = backgroundImage
    ? `linear-gradient(115deg, ${heroOverlayColor} 0%, ${heroOverlayColor} 42%, rgba(17, 24, 39, 0.28) 100%), url("${backgroundImage}") center / cover`
    : `linear-gradient(115deg, ${heroOverlayColor} 0%, var(--landing-primary) 50%, color-mix(in srgb, var(--landing-primary) 75%, transparent) 100%)`;

  return (
    <section
      className="relative text-[var(--landing-primary-text)]"
      style={{ background: heroBackground }}
    >
      <div className={`${landingContainerClass} py-[80px] max-sm:py-[34px]`}>
        <div className="grid items-center gap-12 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] max-sm:pb-[72px]">
          <div>
            {logo ? (
              <img
                src={logo}
                alt={brandName}
                className="mb-9 max-h-24 w-[min(260px,70vw)] object-contain object-left"
              />
            ) : null}

            <p className="mb-[18px] inline-flex items-center rounded-full bg-[var(--landing-secondary)] px-[14px] py-2 text-[13px] font-extrabold text-[var(--landing-secondary-text)]">
              {eyebrowText}
            </p>

            {heroTitle ? (
              <h1 className="m-0 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.98] text-[var(--landing-primary-text)]">
                {heroTitle}
              </h1>
            ) : null}

            {heroSubtitle ? (
              <p
                className="mt-[18px] text-2xl font-bold leading-[1.35] text-inherit opacity-90"
              >
                {heroSubtitle}
              </p>
            ) : null}

            {heroDescription ? (
              <p className="mt-6 max-w-[720px] text-xl leading-[1.55] text-[var(--landing-primary-text)] opacity-90">
                {heroDescription}
              </p>
            ) : null}

            {heroSupportText ? (
              <p className="mt-[18px] max-w-[680px] text-base leading-[1.7] text-inherit opacity-90">
                {heroSupportText}
              </p>
            ) : null}

            {hasHeroActions ? (
              <div className="mb-7 mt-7 flex flex-wrap gap-3">
                {primaryCtaLabel && primaryCtaUrl ? (
                  <a href={primaryCtaUrl} className={landingPrimaryButtonClass}>
                    {primaryCtaLabel}
                  </a>
                ) : null}
                {secondaryCtaLabel && secondaryCtaUrl ? (
                  <a href={secondaryCtaUrl} className={landingSecondaryButtonClass}>
                    {secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            ) : null}

            {summaryItems.length > 0 ? (
              <DefaultLandingSummaryCardsSection
                items={summaryItems}
                embedded
              />
            ) : null}
          </div>

          <div
            id="default-form"
            className="rounded-3xl bg-white p-6 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          >
            {form.programName || fullTitle ? (
              <h2 className="mb-2 text-2xl leading-[1.15]">
                {form.programName || fullTitle}
              </h2>
            ) : null}
            {fullTitle ? <p className="mb-[18px] leading-6 text-slate-600">{fullTitle}</p> : null}
            {hasConfiguredForm && mode === "export" ? (
              form.scriptCode ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: form.scriptCode,
                  }}
                />
              ) : form.scriptUrl ? (
                <script type="text/javascript" src={form.scriptUrl} />
              ) : null
            ) : hasConfiguredForm && form.scriptCode ? (
              <ClientifyFormEmbed code={form.scriptCode} />
            ) : hasConfiguredForm && form.scriptUrl ? (
              <Script src={form.scriptUrl} strategy="afterInteractive" />
            ) : (
              <GenericLeadForm
                programName={form.programName || fullTitle || title}
                primaryColor={primaryColor}
                buttonText={ctaButton || "Submit"}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
