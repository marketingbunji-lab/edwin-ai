import { getBrandLogo } from "@/lib/brandLogo";
import { normalizeBrandColorPalette } from "@/lib/brandColors";
import type {
  Brand,
  BrandCertification,
  IconTextItem,
  Landing,
  LandingCertificationItem,
  ProgramInfoItem,
} from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import { getLandingTemplateCopy } from "@/lib/landingLanguage";
import GraduateProfileSection from "./GraduateProfileSection";
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

      const title = item?.title?.trim() || "";
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
    .map((item): IconTextItem | null => {
      if (typeof item === "string") {
        const value = item.trim();
        return value
          ? {
              title: "",
              text: value,
            }
          : null;
      }

      const title = item?.title?.trim() || "";
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

function normalizeDetailCardItems(
  items?: Array<
    | string
    | {
        title?: string;
        description?: string;
        content?: string;
        text?: string;
        url?: string;
        image?: string;
      }
  >,
) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        const value = item.trim();

        return value
          ? {
              title: "",
              description: value,
              url: "",
              image: "",
            }
          : null;
      }

      const title = item?.title?.trim() || "";
      const description =
        item?.description?.trim() ||
        item?.content?.trim() ||
        item?.text?.trim() ||
        "";
      const url = item?.url?.trim() || "";
      const image = item?.image?.trim() || "";

      if (!title && !description && !url && !image) {
        return null;
      }

      return {
        title,
        description,
        url,
        image,
      };
    })
    .filter(
      (
        item,
      ): item is {
        title: string;
        description: string;
        url: string;
        image: string;
      } => Boolean(item),
    );
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

function hasGenericEyebrow(text?: string) {
  const normalizedText = text
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!normalizedText) {
    return true;
  }

  return (
    normalizedText.startsWith("study at ") ||
    normalizedText.startsWith("estudia en ")
  );
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
  const colorPalette = normalizeBrandColorPalette(brand);
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
  const graduateProfile = landing.graduateProfile ?? {};
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
  const curriculumItems = normalizeDetailCardItems(curriculum.items);
  const handsOnTrainingItems = normalizeDetailCardItems(handsOnTraining.items);
  const admissionsItems = normalizeDetailCardItems(admissions.items);
  const financialAidItems = normalizeDetailCardItems(financialAid.items);
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
  const hasSupportSection = Boolean(
    supportDescription || supportVideoUrl || supportItems.length > 0,
  );
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
    hero.eyebrow?.trim() && !hasGenericEyebrow(hero.eyebrow)
      ? hero.eyebrow.trim()
      : hero.modality
        ? `${hero.modality} ${copy.heroModalityConnector} ${brandName}`
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
  const firstCertificationResolutionItem = certificationSettings.items?.find(
    (item): item is LandingCertificationItem =>
      typeof item !== "string" &&
      item.enabled !== false &&
      Boolean(item.resolutionText?.trim()),
  );
  const heroResolutionText =
    certificationSettings.resolutionText?.trim() ||
    firstCertificationResolutionItem?.resolutionText?.trim() ||
    "";
  return (
    <div
      className="bg-[#f8fbff] text-slate-900"
      style={
        {
          fontFamily,
          "--landing-primary": primaryColor,
          "--landing-primary-text": primaryTextColor,
          "--landing-primary-lightest": colorPalette.primary?.lightest,
          "--landing-primary-light": colorPalette.primary?.light,
          "--landing-primary-dark": colorPalette.primary?.dark,
          "--landing-primary-darkest": colorPalette.primary?.darkest,
          "--landing-secondary": secondaryColor,
          "--landing-secondary-text": secondaryTextColor,
          "--landing-secondary-lightest": colorPalette.secondary?.lightest,
          "--landing-secondary-light": colorPalette.secondary?.light,
          "--landing-secondary-dark": colorPalette.secondary?.dark,
          "--landing-secondary-darkest": colorPalette.secondary?.darkest,
          "--landing-page-bg": "#f8fbff",
          "--landing-soft-bg": colorPalette.primary?.lightest || getSoftBackground(primaryColor),
          "--landing-accent-bg": colorPalette.secondary?.lightest || getSoftBackground(secondaryColor),
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
        price={hero.price || ""}
        discountedPrice={hero.discountedPrice || ""}
        discountPercentage={hero.discountPercentage || ""}
        discountSuffix={landing.language === "en" ? "OFF" : "DTO"}
        resolutionText={heroResolutionText}
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
        eyebrow={copy.overviewEyebrow}
        title={overview.title || ""}
        description={overview.description || ""}
        image={overview.image || ""}
      />


      <DefaultLandingWhyStudySection
        brandName={brandName}
        eyebrow={`${copy.whyChoosePrefix} ${brandName}`}
        sectionId={landing.slug}
        title={whyStudy.title || ""}
        description={whyStudy.description || ""}
        image={whyStudy.image || ""}
        logo={logo}
        heroTitle={title}
        items={whyStudyItems}
      />

      <GraduateProfileSection
        graduateProfile={graduateProfile}
        eyebrow={copy.graduateProfileEyebrow}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      <OpportunityToWorkSection
        opportunityToWork={landing.opportunityToWork ?? landing.careerOutcomes}
        eyebrow={copy.careerOpportunitiesEyebrow}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      <DefaultLandingDetailCardsSection
        eyebrow={copy.contentEyebrow}
        title={curriculum.title || ""}
        description={curriculum.description || ""}
        items={curriculumItems}
        buttonUrl={curriculum.buttonUrl || ""}
        downloadUrl={curriculum.downloadUrl || ""}
        buttonLabel={curriculum.buttonTitle || copy.curriculumButton}
        viewMoreLabel={copy.sectionViewMore}
      />

      <DefaultLandingDetailCardsSection
        eyebrow={copy.experienceEyebrow}
        title={handsOnTraining.title || ""}
        description={handsOnTraining.description || ""}
        items={handsOnTrainingItems}
        soft
        viewMoreLabel={copy.sectionViewMore}
      />

      <DefaultLandingExternshipSection
        eyebrow={copy.externshipEyebrow}
        enabled={Boolean(externship.enabled)}
        title={externship.title || ""}
        description={externship.description || ""}
        image={externship.image || ""}
        hours={externship.hours || ""}
        hoursLabel={copy.externshipHoursLabel}
        partners={externship.partners ?? []}
        partnerLabel={copy.externshipPartnerLabel}
      />

      {hasSupportSection ? (
        <DefaultLandingSupportSection
          eyebrow={copy.studentExperienceEyebrow}
          title={supportTitle}
          description={supportDescription}
          videoUrl={supportVideoUrl}
          items={supportItems}
          isDirectVideoUrl={isDirectVideoUrl}
        />
      ) : null}

      <DefaultLandingBenefitsSection
        eyebrow={copy.benefitsEyebrow}
        title={benefits.title || ""}
        items={benefitItems}
      />

      {hasAdmissionsSection ? (
        <DefaultLandingDetailCardsSection
          eyebrow={copy.contentEyebrow}
          title={admissions.title || ""}
          description={admissions.description || ""}
          items={admissionsItems}
          viewMoreLabel={copy.sectionViewMore}
        />
      ) : null}

      {financialAid.enabled ? (
        <DefaultLandingDetailCardsSection
          eyebrow={copy.financialSupportEyebrow}
          title={financialAid.title || ""}
          description={financialAid.description || ""}
          items={financialAidItems}
          variant="secondary"
          viewMoreLabel={copy.sectionViewMore}
        />
      ) : null}

      <DefaultLandingTestimonialsSection
        eyebrow={copy.studentStoriesEyebrow}
        title={copy.studentStoriesTitle}
        items={landing.testimonials ?? []}
      />

      <DefaultLandingFaqSection
        eyebrow={copy.faqEyebrow}
        items={landing.faq ?? []}
        title={copy.faqTitle}
      />

      <DefaultLandingCtaSection
        title={ctaTitle}
        description={ctaDescription}
        button={ctaButton}
        secondaryButton={ctaSecondaryButton}
        hasForm={hasForm && hasCta}
      />

      <DefaultLandingCampusesSection
        eyebrow={`${copy.campusesEyebrowPrefix} ${brandName}`}
        campuses={campuses}
        campusFilters={landing.delivery?.campuses ?? []}
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
