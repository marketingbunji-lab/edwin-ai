/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import type { Landing } from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import FormHiddenFieldInjector from "@/components/forms/FormHiddenFieldInjector";
import VerityLeadForm from "@/components/forms/VerityLeadForm";
import GenericLeadForm from "@/components/templates/GenericLeadForm";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import type { LabelValueItem } from "@/lib/data";
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
};

export default function DefaultLandingHeroSectionOptionB({
  menuItems,
  menuCtaLabel,
  logo,
  brandName,
  eyebrowText,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroSupportText,
  price,
  discountedPrice,
  discountPercentage,
  discountSuffix,
  resolutionText,
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
  zipLabel,
  primaryColor,
  mode,
  hasConfiguredForm,
  backgroundImage,
  heroOverlayColor,
  liveEdit,
}: Props) {
  const hiddenProgramFieldName = form.hiddenProgramFieldName?.trim() || "program";
  const hiddenProgramFieldValue = form.programName || fullTitle || title;
  const campusValue = form.campus || "";
  const heroBackground = backgroundImage
    ? `radial-gradient(circle at 8% 14%, color-mix(in srgb, var(--landing-secondary) 52%, transparent) 0%, transparent 34%), linear-gradient(115deg, rgba(2, 6, 23, 0.96) 0%, var(--landing-primary-darkest) 42%, ${heroOverlayColor} 66%, rgba(2, 6, 23, 0.72) 100%), url("${backgroundImage}") center / cover`
    : `radial-gradient(circle at 12% 12%, var(--landing-secondary-dark) 0%, transparent 30%), linear-gradient(115deg, var(--landing-primary-darkest) 0%, var(--landing-primary-dark) 52%, var(--landing-primary) 100%)`;
  const hasDiscountPricing = Boolean(discountedPrice?.trim());
  const hasBasePrice = Boolean(price?.trim());
  const hasDiscountBadge = Boolean(discountPercentage?.trim());
  const showPricingBlock = hasBasePrice || hasDiscountPricing || hasDiscountBadge;
  const primaryDisplayedPrice = discountedPrice?.trim() || price?.trim();
  const isVerityForm = Boolean(
    form.verityLeadPostUrl?.trim() && form.veritySysKey?.trim(),
  );
  const hiddenFormFields = [
    {
      name: hiddenProgramFieldName,
      value: hiddenProgramFieldValue,
    },
    {
      name: "campus",
      value: campusValue,
    },
  ].filter((field) => field.name.trim());
  const hiddenFieldInjectionScript = hiddenFormFields.length
    ? `(function(){var fields=${JSON.stringify(hiddenFormFields)};var tries=0;var maxTries=20;function bindDataLayer(form){if(form.dataset.formSubmissionBound==="true"){return;}form.addEventListener("submit",function(){if(window.dataLayer&&Array.isArray(window.dataLayer)){window.dataLayer.push(Object.assign({event:"formSubmission",formId:form.id||""},Object.fromEntries(new FormData(form).entries())));}});form.dataset.formSubmissionBound="true";}function upsert(doc){var forms=Array.prototype.slice.call(doc.querySelectorAll('form'));forms.forEach(function(form){fields.forEach(function(field){var selector='input[type="hidden"][name="'+field.name.replace(/"/g,'\\"')+'"]';var hidden=form.querySelector(selector);if(!hidden){hidden=doc.createElement('input');hidden.type='hidden';hidden.name=field.name;form.appendChild(hidden);}hidden.value=field.value;});bindDataLayer(form);});return forms.length>0;}function apply(){var docs=[document];Array.prototype.forEach.call(document.querySelectorAll('iframe'),function(iframe){try{var idoc=iframe.contentDocument||(iframe.contentWindow&&iframe.contentWindow.document);if(idoc){docs.push(idoc);}}catch(e){}});var applied=false;docs.forEach(function(doc){applied=upsert(doc)||applied;});return applied;}apply();var interval=window.setInterval(function(){tries+=1;var applied=apply();if(applied||tries>=maxTries){window.clearInterval(interval);}},1000);}());`
    : "";

  return (
    <section
      className="relative overflow-hidden text-[var(--landing-primary-text)]"
      style={{ background: heroBackground }}
    >
      <div className={`${landingContainerClass} py-24 md:py-32`}>
        {menuItems.length > 0 ? (
          <div className="mb-10 overflow-hidden rounded-[28px] border border-white/25 bg-white/10 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.16)] backdrop-blur-xl">
            <nav
              aria-label="Navegación de secciones"
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {logo ? (
                  <img
                    src={logo}
                    alt={brandName}
                    className="h-12 w-auto max-w-[150px] object-contain object-left"
                  />
                ) : null}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {menuItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm font-medium lowercase text-white/88 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="#default-form"
                className="inline-flex items-center rounded-full border border-white/35 bg-white/14 px-4 py-2 text-sm font-semibold lowercase text-white transition hover:bg-white/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {menuCtaLabel}
              </a>
            </nav>
          </div>
        ) : null}

        <div className="grid items-center gap-14 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] max-sm:pb-[72px]">
          <div>
            <p className="mb-[18px] inline-flex items-center rounded-full border border-white/70 bg-white/10 px-[14px] py-2 text-[13px] font-extrabold text-[var(--landing-primary-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
              <LiveEditableText
                path="hero.eyebrow"
                value={eyebrowText}
                liveEdit={liveEdit}
                singleLine
              />
            </p>

            {heroTitle ? (
              <LiveEditableText
                as="h1"
                path="hero.title"
                value={heroTitle}
                liveEdit={liveEdit}
                singleLine
                className="m-0 block max-w-[940px] text-6xl font-bold leading-tight tracking-tight text-[var(--landing-primary-text)] md:text-8xl"
              />
            ) : null}

            {heroSubtitle ? (
              <LiveEditableText
                as="p"
                path="hero.subtitle"
                value={heroSubtitle}
                liveEdit={liveEdit}
                singleLine
                className="mt-[18px] text-2xl font-bold leading-tight tracking-tight text-inherit opacity-90 md:text-3xl"
              />
            ) : null}

            {heroDescription ? (
              <LiveEditableText
                as="p"
                path="hero.description"
                value={heroDescription}
                liveEdit={liveEdit}
                className="mt-6 mb-6 block max-w-[720px] text-lg leading-8 text-[var(--landing-primary-text)] opacity-90"
              />
            ) : null}

            {heroSupportText ? (
              <LiveEditableText
                as="p"
                path="hero.supportText"
                value={heroSupportText}
                liveEdit={liveEdit}
                className="mt-[18px] block max-w-[680px] text-lg leading-8 text-inherit opacity-90"
              />
            ) : null}

            {showPricingBlock ? (
              <div className="mb-8 mt-8 row items-end gap-x-4 gap-y-2 text-white">
                {hasDiscountPricing && hasBasePrice ? (
                  <p className="mb-2 text-xl font-medium leading-none text-white/55 line-through md:text-lg">
                    {price}
                  </p>
                ) : null}

                {primaryDisplayedPrice ? (
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                    <p className="text-4xl font-semibold leading-none tracking-tight text-white md:text-4xl">
                      {primaryDisplayedPrice}
                    </p>

                    {hasDiscountPricing && hasDiscountBadge ? (
                      <span className="mb-1 inline-flex items-center rounded-full border border-emerald-300/45 bg-emerald-400/18 px-3 py-1 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(16,185,129,0.16)] backdrop-blur">
                        {discountPercentage} {discountSuffix}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {summaryItems.length > 0 ? (
              <DefaultLandingSummaryCardsSection items={summaryItems} embedded />
            ) : null}

            {resolutionText ? (
              <p className="mt-4 max-w-[860px] text-[11px] leading-5 text-white/58 md:text-xs">
                {resolutionText}
              </p>
            ) : null}
          </div>

          <div
            id="default-form"
            className="relative isolate overflow-hidden rounded-3xl border border-white/50 bg-white/90 p-6 text-slate-900 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.34))]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-48 w-48 rounded-full bg-white/50 blur-3xl"
            />
            <div className="relative mb-5 text-center">
              <h2 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
                <LiveEditableText
                  path="form.title"
                  value={formTitle}
                  liveEdit={liveEdit}
                  singleLine
                />
              </h2>
              <p className="leading-6 text-slate-600">
                <LiveEditableText
                  path="form.description"
                  value={formDescription}
                  liveEdit={liveEdit}
                />
              </p>
            </div>
            <div className="relative">
              {isVerityForm ? (
                <VerityLeadForm
                  form={form}
                  buttonText={ctaButton || submitLabel}
                  fullNameLabel={fullNameLabel}
                  phoneLabel={phoneLabel}
                  emailLabel={emailLabel}
                  zipLabel={zipLabel}
                />
              ) : hasConfiguredForm && mode === "export" ? (
                <>
                  {form.scriptCode ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: form.scriptCode,
                      }}
                    />
                  ) : form.scriptUrl ? (
                    <script type="text/javascript" src={form.scriptUrl} />
                  ) : null}
                  {hiddenFieldInjectionScript ? (
                    <script
                      type="text/javascript"
                      dangerouslySetInnerHTML={{
                        __html: hiddenFieldInjectionScript,
                      }}
                    />
                  ) : null}
                </>
              ) : hasConfiguredForm && form.scriptCode ? (
                <>
                  <ClientifyFormEmbed code={form.scriptCode} />
                  <FormHiddenFieldInjector
                    fieldName={hiddenProgramFieldName}
                    fieldValue={hiddenProgramFieldValue}
                  />
                  <FormHiddenFieldInjector fieldName="campus" fieldValue={campusValue} />
                </>
              ) : hasConfiguredForm && form.scriptUrl ? (
                <>
                  <Script src={form.scriptUrl} strategy="afterInteractive" />
                  <FormHiddenFieldInjector
                    fieldName={hiddenProgramFieldName}
                    fieldValue={hiddenProgramFieldValue}
                  />
                  <FormHiddenFieldInjector fieldName="campus" fieldValue={campusValue} />
                </>
              ) : (
                <GenericLeadForm
                  programName={hiddenProgramFieldValue}
                  primaryColor={primaryColor}
                  buttonText={ctaButton || submitLabel}
                  submitLabel={submitLabel}
                  campusValue={campusValue}
                  hiddenProgramFieldName={hiddenProgramFieldName}
                  fullNameLabel={fullNameLabel}
                  phoneLabel={phoneLabel}
                  emailLabel={emailLabel}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
