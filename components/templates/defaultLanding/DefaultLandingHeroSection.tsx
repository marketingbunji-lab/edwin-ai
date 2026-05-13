/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import type { Landing } from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import GenericLeadForm from "@/components/templates/GenericLeadForm";
import type { LabelValueItem } from "@/lib/data";
import DefaultLandingSummaryCardsSection from "./DefaultLandingSummaryCardsSection";
import {
  landingContainerClass,
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
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  primaryColor: string;
  mode: "preview" | "export";
  hasConfiguredForm: boolean;
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
  formTitle,
  formDescription,
  submitLabel,
  fullNameLabel,
  phoneLabel,
  emailLabel,
  primaryColor,
  mode,
  hasConfiguredForm,
  backgroundImage,
  heroOverlayColor,
}: Props) {
  const heroBackground = backgroundImage
    ? `radial-gradient(circle at 8% 16%, color-mix(in srgb, var(--landing-secondary) 36%, transparent) 0%, transparent 32%), linear-gradient(115deg, var(--landing-primary-darkest) 0%, ${heroOverlayColor} 44%, rgba(17, 24, 39, 0.18) 100%), url("${backgroundImage}") center / cover`
    : `radial-gradient(circle at 12% 12%, var(--landing-secondary-dark) 0%, transparent 28%), linear-gradient(115deg, var(--landing-primary-darkest) 0%, var(--landing-primary) 54%, var(--landing-primary-dark) 100%)`;

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

            <p className="mb-[18px] inline-flex items-center rounded-full border border-white/70 bg-white/10 px-[14px] py-2 text-[13px] font-extrabold text-[var(--landing-primary-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
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
              <p className="mt-6 mb-6 max-w-[720px] text-xl leading-[1.55] text-[var(--landing-primary-text)] opacity-90">
                {heroDescription}
              </p>
            ) : null}

            {heroSupportText ? (
              <p className="mt-[18px] max-w-[680px] text-base leading-[1.7] text-inherit opacity-90">
                {heroSupportText}
              </p>
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
            className="rounded-3xl border border-white/80 bg-[linear-gradient(180deg,#fff,var(--landing-primary-lightest))] p-6 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-5 text-center">
            <h2 className="mb-2 text-2xl leading-[1.15]">
              {formTitle}
            </h2>
            <p className="leading-6 text-slate-600">
              {formDescription}
            </p>
            </div>
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
                buttonText={ctaButton || submitLabel}
                submitLabel={submitLabel}
                fullNameLabel={fullNameLabel}
                phoneLabel={phoneLabel}
                emailLabel={emailLabel}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
