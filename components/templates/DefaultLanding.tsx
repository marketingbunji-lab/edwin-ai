import { getBrandLogo } from "@/lib/brandLogo";
import type {
  Brand,
  BrandCertification,
  IconTextItem,
  Landing,
  ProgramInfoItem,
} from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import { getLandingTemplateCopy } from "@/lib/landingLanguage";
import OpportunityToWorkSection from "./OpportunityToWorkSection";
import DefaultLandingBenefitsSection from "./defaultLanding/DefaultLandingBenefitsSection";
import DefaultLandingCampusesSection from "./defaultLanding/DefaultLandingCampusesSection";
import DefaultLandingCertificationsSection from "./defaultLanding/DefaultLandingCertificationsSection";
import DefaultLandingCtaSection from "./defaultLanding/DefaultLandingCtaSection";
import DefaultLandingDetailCardsSection from "./defaultLanding/DefaultLandingDetailCardsSection";
import DefaultLandingExternshipSection from "./defaultLanding/DefaultLandingExternshipSection";
import DefaultLandingFaqSection from "./defaultLanding/DefaultLandingFaqSection";
import DefaultLandingFooterSection from "./defaultLanding/DefaultLandingFooterSection";
import DefaultLandingHeroSection from "./defaultLanding/DefaultLandingHeroSection";
import DefaultLandingOverviewSection from "./defaultLanding/DefaultLandingOverviewSection";
import DefaultLandingRelatedProgramsSection from "./defaultLanding/DefaultLandingRelatedProgramsSection";
import DefaultLandingSupportSection from "./defaultLanding/DefaultLandingSupportSection";
import DefaultLandingTestimonialsSection from "./defaultLanding/DefaultLandingTestimonialsSection";
import DefaultLandingWhyStudySection from "./defaultLanding/DefaultLandingWhyStudySection";

type Props = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

function normalizeProgramInfo(programInfo?: Landing["programInfo"]) {
  if (!Array.isArray(programInfo)) {
    return [];
  }

  return programInfo
    .map((item, index): ProgramInfoItem | null => {
      if (typeof item === "string") {
        const value = item.trim();

        return value
          ? {
              key: `legacy-${index}`,
              label: `Item ${index + 1}`,
              value,
            }
          : null;
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const label = item.label?.trim() || `Item ${index + 1}`;
      const value = item.value?.trim() || "";

      return value
        ? {
            key: item.key?.trim() || `program-info-${index}`,
            label,
            value,
          }
        : null;
    })
    .filter((item): item is ProgramInfoItem => Boolean(item));
}

function getTextColor(hexColor: string) {
  const hex = hexColor.replace("#", "");

  if (hex.length !== 6) {
    return "#ffffff";
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#111827" : "#ffffff";
}

function getSoftBackground(hexColor: string) {
  return `${hexColor}14`;
}

function isDirectVideoUrl(url?: string) {
  return /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(url?.trim() ?? "");
}

function getOverlayColorValue(
  color?: string,
  fallback = "rgba(17, 24, 39, 0.82)",
) {
  const value = color?.trim();

  if (!value) return fallback;

  if (value.startsWith("#")) {
    const hex = value.slice(1);

    if (hex.length === 3) {
      const red = Number.parseInt(hex[0] + hex[0], 16);
      const green = Number.parseInt(hex[1] + hex[1], 16);
      const blue = Number.parseInt(hex[2] + hex[2], 16);

      return `rgba(${red}, ${green}, ${blue}, 0.72)`;
    }

    if (hex.length === 6) {
      const red = Number.parseInt(hex.slice(0, 2), 16);
      const green = Number.parseInt(hex.slice(2, 4), 16);
      const blue = Number.parseInt(hex.slice(4, 6), 16);

      return `rgba(${red}, ${green}, ${blue}, 0.72)`;
    }
  }

  return value;
}

function getCertificationLogo(
  certification: BrandCertification,
  mode?: "light" | "dark",
) {
  if (mode === "dark") {
    return certification.logos?.dark || certification.logos?.light || "";
  }

  return certification.logos?.light || certification.logos?.dark || "";
}

function normalizeAccordionItems(
  items?: NonNullable<Landing["whyStudy"]>["items"],
) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const value = item.trim();
        return value
          ? {
              title: `Item ${index + 1}`,
              content: value,
            }
          : null;
      }

      const title = item?.title?.trim() || `Item ${index + 1}`;
      const content = item?.content?.trim() || item?.description?.trim() || "";

      return content || title
        ? {
            title,
            content,
          }
        : null;
    })
    .filter((item): item is { title: string; content: string } => Boolean(item));
}

function normalizeIconTextItems(
  items?: NonNullable<Landing["benefits"]>["items"],
) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): IconTextItem | null => {
      if (typeof item === "string") {
        const value = item.trim();
        return value
          ? {
              title: `Item ${index + 1}`,
              text: value,
            }
          : null;
      }

      const title = item?.title?.trim() || `Item ${index + 1}`;
      const text = item?.text?.trim() || item?.description?.trim() || "";

      return title || text
        ? {
            ...item,
            title,
            text,
          }
        : null;
    })
    .filter((item): item is IconTextItem => Boolean(item));
}

function isLocationMetaLabel(label?: string) {
  const normalizedLabel = label
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedLabel === "location" || normalizedLabel === "ubicacion";
}

function isLanguageMetaLabel(label?: string) {
  const normalizedLabel = label
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedLabel === "language" || normalizedLabel === "idioma";
}

function isFormatLabel(label?: string) {
  const normalizedLabel = label
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalizedLabel === "format" || normalizedLabel === "formato";
}

export default function DefaultLanding({
  brand,
  landing,
  mode = "preview",
}: Props) {
  const primaryColor = brand.primaryColor || "#111827";
  const secondaryColor = brand.secondaryColor || "#F8D74A";
  const primaryTextColor = getTextColor(primaryColor);
  const secondaryTextColor = getTextColor(secondaryColor);
  const brandName = brand.name || brand.slug;
  const logo = getBrandLogo(brand, landing.logoMode || "light") || brand.logo;
  const heroLogo = brand.logos?.light || logo;
  const footerLogo = brand.logos?.light || logo;
  const copy = getLandingTemplateCopy(landing.language, brand.slug);
  const fontFamily =
    brand.typography?.fontFamily?.trim() || "Inter, Arial, sans-serif";
  const googleFontHref = brand.typography?.googleFontHref?.trim() || "";
  const hero = landing.hero ?? {};
  const whyStudy = landing.whyStudy ?? {};
  const supportSection = landing.supportSection ?? landing.studentSupport ?? {};
  const benefits = landing.benefits ?? {};
  const cta = landing.cta ?? {};
  const form = landing.form ?? {};
  const overview = landing.overview ?? {};
  const curriculum = landing.curriculum ?? {};
  const handsOnTraining = landing.handsOnTraining ?? {};
  const externship = landing.externship ?? {};
  const admissions = landing.admissions ?? {};
  const financialAid = landing.financialAid ?? {};
  const contact = landing.contact ?? {};
  const programInfo = normalizeProgramInfo(landing.programInfo);
  const whyStudyItems = normalizeAccordionItems(whyStudy.items);
  const supportItems = normalizeIconTextItems(supportSection.items);
  const benefitItems = normalizeIconTextItems(benefits.items);
  const curriculumItems = (curriculum.items ?? []).filter(
    (item) =>
      typeof item === "string" ||
      item?.title?.trim() ||
      item?.description?.trim(),
  ) as Array<{ title?: string; description?: string; url?: string; image?: string }>;
  const handsOnTrainingItems = (handsOnTraining.items ?? []).filter(
    (item) =>
      typeof item === "string" ||
      item?.title?.trim() ||
      item?.description?.trim(),
  ) as Array<{ title?: string; description?: string; url?: string; image?: string }>;
  const admissionsItems = (admissions.items ?? []).filter(
    (item) =>
      typeof item === "string" ||
      item?.title?.trim() ||
      item?.description?.trim(),
  ) as Array<{ title?: string; description?: string; url?: string; image?: string }>;
  const financialAidItems = (financialAid.items ?? []).filter(
    (item) =>
      typeof item === "string" ||
      item?.title?.trim() ||
      item?.description?.trim(),
  ) as Array<{ title?: string; description?: string; url?: string; image?: string }>;
  const legalLinks = brand.legalLinks ?? [];
  const campuses = (brand.campuses ?? []).filter(
    (campus) =>
      campus.name?.trim() ||
      campus.description?.trim() ||
      campus.image?.trim() ||
      campus.videoUrl?.trim(),
  );
  const footerScripts = landing.footerScripts ?? [];
  const certificationSettings = landing.certifications ?? {};
  const brandCertifications = brand.certifications ?? [];
  const activeCertifications = brandCertifications
    .map((certification, index) => {
      const items = landing.certifications?.items ?? [];
      const certificationKey = `${certification.name || ""}|${certification.url || ""}`;
      const landingItem =
        items.find(
          (item) =>
            typeof item !== "string" &&
            `${item.name || item.title || ""}|${item.url || ""}` === certificationKey,
        ) ?? items[index];

      return {
        certification,
        index,
        enabled:
          typeof landingItem === "string"
            ? certificationSettings.enabled
            : Boolean(landingItem?.enabled),
      };
    })
    .filter((item) => item.enabled);
  const title = landing.title || landing.fullTitle || "";
  const fullTitle = landing.fullTitle || title;
  const heroTitle = hero.title || fullTitle;
  const heroDescription = hero.description || "";
  const heroOverlayColor = getOverlayColorValue(
    hero.overlayColor,
    getOverlayColorValue(primaryColor),
  );
  const supportTitle = supportSection.title || "";
  const supportDescription = supportSection.description?.trim() || "";
  const supportVideoUrl = supportSection.videoUrl?.trim() || "";
  const ctaTitle = cta.title || "";
  const ctaButton = cta.button || "";
  const ctaDescription = cta.description?.trim() || "";
  const ctaSecondaryButton = cta.secondaryButton?.trim() || "";
  const hasAdmissionsSection = Boolean(
    admissions.description?.trim() || admissionsItems.length > 0,
  );
  const hasConfiguredForm = Boolean(form.scriptCode || form.scriptUrl);
  const hasForm = true;
  const hasCta = Boolean(ctaTitle || ctaButton);
  const eyebrowText =
    hero.eyebrow || hero.modality
      ? `${hero.modality ? `${hero.modality} ${copy.studyAt.toLowerCase()} ` : ""}${brandName}`
      : `${copy.studyAt} ${brandName}`;
  const formatProgramInfo = programInfo.find((item) =>
    isFormatLabel(item.label),
  );
  const hasFormatSummaryCard = (landing.summaryCards ?? []).some((item) =>
    isFormatLabel(item.label),
  );
  const heroSummaryItems = [
    ...(landing.summaryCards ?? []),
    !hasFormatSummaryCard && formatProgramInfo?.value?.trim()
      ? {
          label: formatProgramInfo.label?.trim() || "Format",
          value: formatProgramInfo.value.trim(),
        }
      : null,
  ].filter((item): item is { label: string; value: string } => {
    if (!item?.label?.trim() || !item.value?.trim()) {
      return false;
    }

    if (isLocationMetaLabel(item.label) || isLanguageMetaLabel(item.label)) {
      return false;
    }

    return true;
  });
  const visibleHeroProgramInfoLabels = new Set(
    programInfo
      .slice(0, 4)
      .map((item) => item.label?.trim().toLowerCase())
      .filter(Boolean),
  );
  return (
    <div
      className="bg-white text-slate-900"
      style={
        {
          fontFamily,
          "--landing-primary": primaryColor,
          "--landing-primary-text": primaryTextColor,
          "--landing-secondary": secondaryColor,
          "--landing-secondary-text": secondaryTextColor,
          "--landing-soft-bg": getSoftBackground(primaryColor),
          "--landing-accent-bg": getSoftBackground(secondaryColor),
        } as React.CSSProperties
      }
    >
      {googleFontHref ? <style>{`@import url("${googleFontHref}");`}</style> : null}

      <DefaultLandingHeroSection
        logo={heroLogo}
        brandName={brandName}
        eyebrowText={eyebrowText}
        heroTitle={heroTitle}
        heroSubtitle={hero.subtitle || ""}
        heroDescription={heroDescription}
        heroSupportText={hero.supportText || ""}
        summaryItems={heroSummaryItems}
        fullTitle={fullTitle}
        title={title}
        form={form}
        ctaButton={ctaButton}
        formTitle={form.title?.trim() || copy.formTitle}
        formDescription={form.description?.trim() || copy.formDescription}
        submitLabel={form.submitLabel?.trim() || copy.formSubmitLabel}
        fullNameLabel={copy.formFullNameLabel}
        phoneLabel={copy.formPhoneLabel}
        emailLabel={copy.formEmailLabel}
        primaryColor={primaryColor}
        mode={mode}
        hasConfiguredForm={hasConfiguredForm}
        primaryCtaLabel={hero.primaryCta?.label?.trim() || ""}
        primaryCtaUrl={hero.primaryCta?.url?.trim() || ""}
        secondaryCtaLabel={hero.secondaryCta?.label?.trim() || ""}
        secondaryCtaUrl={hero.secondaryCta?.url?.trim() || ""}
        backgroundImage={hero.backgroundImage || ""}
        heroOverlayColor={heroOverlayColor}
      />

      <DefaultLandingCertificationsSection
        activeCertifications={activeCertifications}
        getCertificationLogo={getCertificationLogo}
        logoMode={landing.logoMode}
        title={copy.certificationsRowTitle}
      />

      <DefaultLandingOverviewSection
        title={overview.title || ""}
        description={overview.description || ""}
        image={overview.image || ""}
      />


      <DefaultLandingWhyStudySection
        brandName={brandName}
        sectionId={landing.slug}
        title={whyStudy.title || ""}
        description={whyStudy.description || ""}
        image={whyStudy.image || ""}
        logo={logo}
        heroTitle={title}
        items={whyStudyItems}
      />

      <OpportunityToWorkSection
        opportunityToWork={landing.opportunityToWork ?? landing.careerOutcomes}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      <DefaultLandingDetailCardsSection
        title={curriculum.title || ""}
        description={curriculum.description || ""}
        items={curriculumItems}
        downloadUrl={curriculum.downloadUrl || ""}
        buttonLabel={copy.curriculumButton}
        viewMoreLabel={copy.sectionViewMore}
      />

      <DefaultLandingDetailCardsSection
        title={handsOnTraining.title || ""}
        description={handsOnTraining.description || ""}
        items={handsOnTrainingItems}
        soft
        viewMoreLabel={copy.sectionViewMore}
      />

      <DefaultLandingExternshipSection
        enabled={Boolean(externship.enabled)}
        title={externship.title || ""}
        description={externship.description || ""}
        image={externship.image || ""}
        hours={externship.hours || ""}
        partners={externship.partners ?? []}
      />

      <DefaultLandingSupportSection
        title={supportTitle}
        description={supportDescription}
        videoUrl={supportVideoUrl}
        items={supportItems}
        isDirectVideoUrl={isDirectVideoUrl}
      />

      <DefaultLandingBenefitsSection
        title={benefits.title || ""}
        items={benefitItems}
      />

      {hasAdmissionsSection ? (
        <DefaultLandingDetailCardsSection
          title={admissions.title || ""}
          description={admissions.description || ""}
          items={admissionsItems}
          viewMoreLabel={copy.sectionViewMore}
        />
      ) : null}

      {financialAid.enabled ? (
        <DefaultLandingDetailCardsSection
          title={financialAid.title || ""}
          description={financialAid.description || ""}
          items={financialAidItems}
          soft
          viewMoreLabel={copy.sectionViewMore}
        />
      ) : null}

      <DefaultLandingTestimonialsSection items={landing.testimonials ?? []} />

      <DefaultLandingFaqSection items={landing.faq ?? []} title={copy.faqTitle} />

      <DefaultLandingRelatedProgramsSection
        items={landing.relatedPrograms ?? []}
        title={copy.relatedProgramsTitle}
        actionLabel={copy.relatedProgramsAction}
      />

      <DefaultLandingCtaSection
        title={ctaTitle}
        description={ctaDescription}
        button={ctaButton}
        secondaryButton={ctaSecondaryButton}
        hasForm={hasForm && hasCta}
      />

      <DefaultLandingCampusesSection
        brandName={brandName}
        campuses={campuses}
        primaryColor={primaryColor}
        primaryTextColor={primaryTextColor}
        isDirectVideoUrl={isDirectVideoUrl}
        title={copy.campusesTitle}
        description={copy.campusesDescription}
        videoLabel={copy.campusesVideoLabel}
      />

      <DefaultLandingFooterSection
        logo={footerLogo}
        brandName={brandName}
        description={brand.description || ""}
        advisorName={contact.advisorName || ""}
        advisorTitle={contact.advisorTitle || ""}
        phone={contact.phone || ""}
        email={contact.email || ""}
        legalLinks={legalLinks}
        phoneLabel={copy.footerPhoneLabel}
        emailLabel={copy.footerEmailLabel}
        legalLinksAriaLabel={copy.legalLinksAriaLabel}
      />

      {footerScripts.map((script, index) =>
        mode === "export" ? (
          <div
            key={`footer-script-${index}`}
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ) : null,
      )}
      {footerScripts.map((script, index) =>
        mode === "preview" ? (
          <ClientifyFormEmbed
            key={`footer-script-preview-${index}`}
            code={script}
            className="hidden"
          />
        ) : null,
      )}
    </div>
  );
}
