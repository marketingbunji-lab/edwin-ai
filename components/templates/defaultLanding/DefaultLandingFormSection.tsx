/* eslint-disable @next/next/no-sync-scripts */
import type { Landing } from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import FormHiddenFieldInjector from "@/components/forms/FormHiddenFieldInjector";
import VerityLeadForm from "@/components/forms/VerityLeadForm";
import GenericLeadForm from "@/components/templates/GenericLeadForm";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import { landingContainerClass } from "./classes";

type Props = {
  formSection: NonNullable<Landing["formSection"]>;
  form: NonNullable<Landing["form"]>;
  fullTitle: string;
  title: string;
  ctaButton: string;
  submitLabel: string;
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  zipLabel: string;
  primaryColor: string;
  mode: "preview" | "export";
  hasConfiguredForm: boolean;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingFormSection({
  formSection,
  form,
  fullTitle,
  title,
  ctaButton,
  submitLabel,
  fullNameLabel,
  phoneLabel,
  emailLabel,
  zipLabel,
  primaryColor,
  mode,
  hasConfiguredForm,
  liveEdit,
}: Props) {
  const hiddenProgramFieldName = form.hiddenProgramFieldName?.trim() || "program";
  const hiddenProgramFieldValue = form.programName || fullTitle || title;
  const campusValue = form.campus || "";
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
  const sectionTitle = formSection.title || "";
  const sectionSubtitle = formSection.subtitle || "";
  const sectionDescription = formSection.description || "";
  const hasBackgroundImage = Boolean(formSection.backgroundImage?.trim());
  const usesLightText = formSection.textTheme === "light";
  const sectionBackground = hasBackgroundImage
    ? `${formSection.overlayColor?.trim() || "linear-gradient(90deg,rgba(8,16,33,0.88),rgba(8,16,33,0.60) 52%,rgba(8,16,33,0.34))"}, url("${formSection.backgroundImage}") center / cover no-repeat`
    : undefined;
  const eyebrowClass = usesLightText
    ? "text-white/82"
    : "text-[var(--landing-primary)]";
  const titleClass = usesLightText ? "text-white" : "text-slate-950";
  const subtitleClass = usesLightText
    ? "text-white/90"
    : "text-[var(--landing-primary)]";
  const descriptionClass = usesLightText ? "text-white/90" : "text-slate-700";

  return (
    <section
      id="default-form"
      className={`py-24 md:py-32 ${hasBackgroundImage ? "relative overflow-hidden" : "bg-[linear-gradient(180deg,var(--landing-page-bg),var(--landing-primary-lightest))]"}`}
      style={hasBackgroundImage ? { background: sectionBackground } : undefined}
    >
      <div className={`${landingContainerClass} grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,520px)]`}>
        <div className="max-w-2xl">
          {formSection.eyebrow ? (
            <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}>
              <LiveEditableText
                path="formSection.eyebrow"
                value={formSection.eyebrow}
                liveEdit={liveEdit}
                singleLine
              />
            </p>
          ) : null}

          {sectionTitle ? (
            <LiveEditableText
              as="h2"
              path="formSection.title"
              value={sectionTitle}
              liveEdit={liveEdit}
              singleLine
              className={`m-0 block text-4xl font-bold leading-tight tracking-tight md:text-5xl ${titleClass}`}
            />
          ) : null}

          {sectionSubtitle ? (
            <LiveEditableText
              as="p"
              path="formSection.subtitle"
              value={sectionSubtitle}
              liveEdit={liveEdit}
              className={`mt-5 block text-2xl font-semibold leading-tight ${subtitleClass}`}
            />
          ) : null}

          {sectionDescription ? (
            <LiveEditableText
              as="p"
              path="formSection.description"
              value={sectionDescription}
              liveEdit={liveEdit}
              className={`mt-6 block text-lg leading-8 ${descriptionClass}`}
            />
          ) : null}
        </div>

        <div className="relative text-slate-900">
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
                <ClientifyFormEmbed
                  code={`<script type="text/javascript" src="${form.scriptUrl}"></script>`}
                />
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
    </section>
  );
}
