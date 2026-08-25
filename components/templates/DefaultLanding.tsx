import { getBrandLogo } from "@/lib/brandLogo";
import { normalizeBrandColorPalette } from "@/lib/brandColors";
import type {
  Brand,
  BrandCertification,
  IconTextItem,
  Landing,
  LandingCertificationItem,
  ProgramInfoItem,
  TitleDescriptionItem,
} from "@/lib/data";
import ClientifyFormEmbed from "@/components/forms/ClientifyFormEmbed";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import { getLandingTemplateCopy } from "@/lib/landingLanguage";
import GraduateProfileSection from "./GraduateProfileSection";
import OpportunityToWorkSection from "./OpportunityToWorkSection";
import DefaultLandingBenefitsSection from "./defaultLanding/DefaultLandingBenefitsSection";
import DefaultLandingBackToTopButton from "./defaultLanding/DefaultLandingBackToTopButton";
import DefaultLandingFloatingActionsStatic from "./defaultLanding/DefaultLandingFloatingActionsStatic";
import DefaultLandingCampusesSection from "./defaultLanding/DefaultLandingCampusesSection";
import DefaultLandingCertificationsSection from "./defaultLanding/DefaultLandingCertificationsSection";
import DefaultLandingCtaSection from "./defaultLanding/DefaultLandingCtaSection";
import DefaultLandingDetailCardsSection from "./defaultLanding/DefaultLandingDetailCardsSection";
import DefaultLandingExternshipSection from "./defaultLanding/DefaultLandingExternshipSection";
import DefaultLandingFaqSection from "./defaultLanding/DefaultLandingFaqSection";
import DefaultLandingFooterSection from "./defaultLanding/DefaultLandingFooterSection";
import DefaultLandingFormSection from "./defaultLanding/DefaultLandingFormSection";
import DefaultLandingHeroSection from "./defaultLanding/DefaultLandingHeroSection";
import DefaultLandingHeroSectionB from "./defaultLanding/DefaultLandingHeroSectionB";
import DefaultLandingOverviewSection from "./defaultLanding/DefaultLandingOverviewSection";
import DefaultLandingProgramExplorerSection from "./defaultLanding/DefaultLandingProgramExplorerSection";
import DefaultLandingProgramExplorerSectionStatic from "./defaultLanding/DefaultLandingProgramExplorerSectionStatic";
import DefaultLandingSupportSection from "./defaultLanding/DefaultLandingSupportSection";
import DefaultLandingTestimonialsSection from "./defaultLanding/DefaultLandingTestimonialsSection";
import DefaultLandingWhyStudySection from "./defaultLanding/DefaultLandingWhyStudySection";
import { landingContainerClass } from "./defaultLanding/classes";

type Props = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
  liveEdit?: LandingLiveEditConfig;
};

type HeroMenuItem = {
  id: string;
  label: string;
};

function toMenuLabel(value: string) {
  const label = value.trim().toLocaleLowerCase();

  return label ? `${label.charAt(0).toLocaleUpperCase()}${label.slice(1)}` : "";
}

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
  arrayPath = "whyStudy.items",
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
              titlePath: "",
              contentPath: `${arrayPath}.${index}`,
            }
          : null;
      }

      const title = item?.title?.trim() || "";
      const content = item?.content?.trim() || item?.description?.trim() || "";

      return content || title
        ? {
            title,
            content,
            titlePath: `${arrayPath}.${index}.title`,
            contentPath: `${arrayPath}.${index}.description`,
          }
        : null;
    })
    .filter(
      (
        item,
      ): item is {
        title: string;
        content: string;
        titlePath: string;
        contentPath: string;
      } => Boolean(item),
    );
}

function normalizeIconTextItems(
  items?: NonNullable<Landing["benefits"]>["items"],
  arrayPath = "benefits.items",
) {
  if (!Array.isArray(items)) return [];

  return items
    .map(
      (
        item,
        index,
      ):
        | (IconTextItem & {
            titlePath: string;
            textPath: string;
          })
        | null => {
        if (typeof item === "string") {
          const value = item.trim();
          return value
            ? {
                title: "",
                text: value,
                titlePath: "",
                textPath: `${arrayPath}.${index}`,
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
              titlePath: `${arrayPath}.${index}.title`,
              textPath: `${arrayPath}.${index}.text`,
            }
          : null;
      },
    )
    .filter(
      (
        item,
      ): item is IconTextItem & {
        titlePath: string;
        textPath: string;
      } => Boolean(item),
    );
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
        items?: string[];
      }
  >,
  arrayPath = "curriculum.items",
) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const value = item.trim();

        return value
          ? {
              title: "",
              description: value,
              url: "",
              image: "",
              items: [],
              titlePath: "",
              descriptionPath: `${arrayPath}.${index}`,
              bulletPath: "",
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
      const bullets = Array.isArray(item?.items)
        ? item.items.map((bullet) => bullet.trim()).filter(Boolean)
        : [];

      if (!title && !description && !url && !image && bullets.length === 0) {
        return null;
      }

      return {
        title,
        description,
        url,
        image,
        items: bullets,
        titlePath: `${arrayPath}.${index}.title`,
        descriptionPath: `${arrayPath}.${index}.description`,
        bulletPath: `${arrayPath}.${index}.items`,
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
        items: string[];
        titlePath: string;
        descriptionPath: string;
        bulletPath: string;
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

function hasMeaningfulTitleDescriptionItems(
  items?: Array<string | TitleDescriptionItem>,
) {
  return Boolean(
    items?.some((item) => {
      if (typeof item === "string") {
        return Boolean(item.trim());
      }

      return Boolean(
        item?.title?.trim() ||
        item?.description?.trim() ||
        item?.content?.trim() ||
        item?.text?.trim() ||
        item?.url?.trim() ||
        item?.image?.trim(),
      );
    }),
  );
}

function hasProgramExplorerContent(explorer?: Landing["programExplorer"]) {
  return Boolean(
    explorer?.enabled &&
    ((explorer.tabs ?? []).some(
      (tab) =>
        tab.title?.trim() ||
        tab.description?.trim() ||
        tab.items?.some((item) => item.trim()) ||
        tab.groups?.some(
          (group) =>
            group.title?.trim() ||
            group.items?.some(
              (item) => item.label?.trim() || item.value?.trim(),
            ),
        ),
    ) ||
      (explorer.cards ?? []).some(
        (card) => card.title?.trim() || card.items?.some((item) => item.trim()),
      )),
  );
}

export default function DefaultLanding({
  brand,
  landing,
  mode = "preview",
  liveEdit,
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
  const supportSectionPath = landing.supportSection
    ? "supportSection"
    : "studentSupport";
  const benefits = landing.benefits ?? {};
  const cta = landing.cta ?? {};
  const form = landing.form ?? {};
  const formSection = landing.formSection ?? {};
  const overview = landing.overview ?? {};
  const programExplorer = landing.programExplorer ?? {};
  const graduateProfile = landing.graduateProfile ?? {};
  const curriculum = landing.curriculum ?? {};
  const handsOnTraining = landing.handsOnTraining ?? {};
  const externship = landing.externship ?? {};
  const admissions = landing.admissions ?? {};
  const financialAid = landing.financialAid ?? {};
  const contact = landing.contact ?? {};
  const programInfo = normalizeProgramInfo(landing.programInfo);
  const whyStudyItems = normalizeAccordionItems(whyStudy.items);
  const supportItems = normalizeIconTextItems(
    supportSection.items,
    `${supportSectionPath}.items`,
  );
  const benefitItems = normalizeIconTextItems(benefits.items, "benefits.items");
  const curriculumItems = normalizeDetailCardItems(
    curriculum.items,
    "curriculum.items",
  );
  const handsOnTrainingItems = normalizeDetailCardItems(
    handsOnTraining.items,
    "handsOnTraining.items",
  );
  const admissionsItems = normalizeDetailCardItems(
    admissions.items,
    "admissions.items",
  );
  const financialAidItems = normalizeDetailCardItems(
    financialAid.items,
    "financialAid.items",
  );
  const overviewItems = normalizeDetailCardItems(
    overview.items,
    "overview.items",
  );
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
            `${item.name || item.title || ""}|${item.url || ""}` ===
              certificationKey,
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
  const ctaImage = cta.image?.trim() || "";
  const ctaVariant = cta.variant === "minimal" ? "minimal" : "default";
  const formTitle = form.title ?? copy.formTitle;
  const formDescription = form.description ?? copy.formDescription;
  const hasAdmissionsSection = Boolean(
    admissions.description?.trim() || admissionsItems.length > 0,
  );
  const hasProgramExplorerSection = hasProgramExplorerContent(programExplorer);
  const hasConfiguredForm = Boolean(form.scriptCode || form.scriptUrl);
  const hasStandaloneFormSection = Boolean(formSection.enabled);
  const hasForm = true;
  const hasCta = Boolean(ctaTitle || ctaButton);
  const eyebrowText = hero.eyebrow?.trim() || "";
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
  const heroVariant = hero.variant || "default";
  const hasOverviewSection = Boolean(
    overview.title?.trim() ||
    overview.description?.trim() ||
    overview.image?.trim() ||
    overviewItems.length > 0,
  );
  const hasWhyStudySection = Boolean(
    whyStudy.title?.trim() ||
    whyStudy.description?.trim() ||
    whyStudy.image?.trim() ||
    whyStudyItems.length > 0,
  );
  const hasGraduateProfileSection = Boolean(
    graduateProfile.title?.trim() ||
    graduateProfile.image?.trim() ||
    hasMeaningfulTitleDescriptionItems(graduateProfile.items),
  );
  const careerSectionData = landing.opportunityToWork ?? landing.careerOutcomes;
  const hasCareerSection = Boolean(
    careerSectionData?.subtitle?.trim() ||
    careerSectionData?.image?.trim() ||
    hasMeaningfulTitleDescriptionItems(careerSectionData?.items),
  );
  const hasCurriculumSection = Boolean(
    curriculum.enabled !== false &&
    (curriculum.description?.trim() ||
      curriculum.buttonUrl?.trim() ||
      curriculum.downloadUrl?.trim() ||
      curriculumItems.length > 0),
  );
  const hasHandsOnSection = Boolean(
    handsOnTraining.enabled &&
    (handsOnTraining.description?.trim() || handsOnTrainingItems.length > 0),
  );
  const hasExternshipSection = Boolean(
    externship.enabled &&
    (externship.description?.trim() ||
      externship.image?.trim() ||
      externship.hours?.trim() ||
      externship.partners?.some((partner) => partner.trim())),
  );
  const hasBenefitsSection = benefitItems.length > 0;
  const hasFinancialAidSection = Boolean(
    financialAid.enabled &&
    (financialAid.description?.trim() || financialAidItems.length > 0),
  );
  const hasTestimonialsSection = Boolean(
    (landing.testimonials ?? []).some(
      (item) => item.name?.trim() || item.role?.trim() || item.quote?.trim(),
    ),
  );
  const hasFaqSection = Boolean(
    (landing.faq ?? []).some(
      (item) => item.question?.trim() && item.answer?.trim(),
    ),
  );
  const hasCampusesSection = Boolean(
    campuses.length > 0 &&
    landing.delivery?.campuses?.some((campus) => campus.trim()),
  );
  const configuredHeroMenuItems = hero.menuItems;
  const shouldFilterHeroMenu = Array.isArray(configuredHeroMenuItems);
  const heroMenuItems: HeroMenuItem[] = [
    hasOverviewSection
      ? {
          id: "landing-overview",
          label: toMenuLabel(overview.title || copy.overviewTitle),
        }
      : null,
    hasProgramExplorerSection
      ? {
          id: "landing-program-explorer",
          label: toMenuLabel(programExplorer.title || "Conoce el programa"),
        }
      : null,
    hasGraduateProfileSection
      ? {
          id: "landing-graduate-profile",
          label: toMenuLabel(
            graduateProfile.title || copy.graduateProfileEyebrow,
          ),
        }
      : null,
    hasWhyStudySection
      ? {
          id: "landing-why-study",
          label: toMenuLabel(whyStudy.title || copy.whyStudyTitle),
        }
      : null,
    hasCareerSection
      ? {
          id: "landing-career-opportunities",
          label: toMenuLabel(
            landing.opportunityToWork?.title ||
              landing.careerOutcomes?.title ||
              copy.careerOpportunitiesTitle,
          ),
        }
      : null,
    hasCurriculumSection
      ? {
          id: "landing-curriculum",
          label: toMenuLabel(curriculum.title || copy.curriculumTitle),
        }
      : null,
    hasHandsOnSection
      ? {
          id: "landing-hands-on-training",
          label: toMenuLabel(
            handsOnTraining.title || copy.handsOnTrainingTitle,
          ),
        }
      : null,
    hasExternshipSection
      ? {
          id: "landing-externship",
          label: toMenuLabel(externship.title || copy.externshipTitle),
        }
      : null,
    hasSupportSection
      ? {
          id: "landing-support",
          label: toMenuLabel(supportTitle || copy.studentSupportTitle),
        }
      : null,
    hasBenefitsSection
      ? {
          id: "landing-benefits",
          label: toMenuLabel(benefits.title || copy.programBenefitsTitle),
        }
      : null,
    hasAdmissionsSection
      ? {
          id: "landing-admissions",
          label: toMenuLabel(admissions.title || copy.admissionsTitle),
        }
      : null,
    hasFinancialAidSection
      ? {
          id: "landing-financial-aid",
          label: toMenuLabel(financialAid.title || copy.financialAidTitle),
        }
      : null,
    hasTestimonialsSection
      ? {
          id: "landing-testimonials",
          label: toMenuLabel(copy.studentStoriesTitle),
        }
      : null,
    hasFaqSection
      ? {
          id: "landing-faq",
          label: toMenuLabel(copy.faqTitle),
        }
      : null,
    hasCampusesSection
      ? {
          id: "landing-campuses",
          label: toMenuLabel(copy.campusesTitle),
        }
      : null,
  ]
    .filter((item): item is HeroMenuItem => Boolean(item))
    .filter(
      (item) =>
        !shouldFilterHeroMenu || configuredHeroMenuItems.includes(item.id),
    );
  const isPreviewMode = mode === "preview";
  return (
    <div
      className={`${isPreviewMode ? "overflow-x-visible" : "overflow-x-hidden"} bg-[#f8fbff] text-slate-900`}
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
          "--landing-soft-bg":
            colorPalette.primary?.lightest || getSoftBackground(primaryColor),
          "--landing-accent-bg":
            colorPalette.secondary?.lightest ||
            getSoftBackground(secondaryColor),
        } as React.CSSProperties
      }
    >
      {googleFontHref ? (
        <style>{`@import url("${googleFontHref}");`}</style>
      ) : null}

      {heroVariant === "option-b" && (heroMenuItems.length > 0 || ctaButton) ? (
        <>
          <div
            className={`z-50 bg-[color-mix(in_srgb,var(--landing-primary-darkest)_88%,transparent)] shadow-[0_18px_48px_rgba(2,6,23,0.22)] backdrop-blur-xl ${
              isPreviewMode ? "sticky top-0" : "fixed inset-x-0 top-0"
            }`}
          >
            <div className={`${landingContainerClass} py-3`}>
              <nav
                aria-label="Navegación de secciones"
                className="grid w-full grid-cols-[auto_auto] items-center justify-between gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                {heroLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroLogo}
                    alt={brandName}
                    data-landing-logo-mode-control={
                      liveEdit?.enabled ? "true" : undefined
                    }
                    className={`h-12 w-auto max-w-[220px] rounded-lg object-contain object-left sm:h-[60px] sm:max-w-[260px] lg:h-[84px] lg:max-w-[340px] ${
                      liveEdit?.enabled
                        ? "outline outline-2 outline-dashed outline-[var(--bunji-primary,#6d5dfc)]/45 outline-offset-4 transition hover:bg-[var(--bunji-primary,#6d5dfc)]/10"
                        : ""
                    }`}
                  />
                ) : null}

                {heroMenuItems.length > 0 ? (
                  <div className="hidden min-w-0 flex-wrap items-center gap-x-5 gap-y-2 md:flex lg:gap-x-5">
                    {heroMenuItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="landing-export-header-link whitespace-nowrap text-sm font-semibold leading-snug text-white/88 no-underline transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ) : null}

                {heroMenuItems.length > 0 ? (
                  <details className="group relative z-20 block justify-self-end md:hidden">
                    <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--landing-secondary-light)] bg-[var(--landing-secondary)] text-[var(--landing-secondary-text)] shadow-[0_12px_28px_rgba(2,6,23,0.18)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                      <span className="sr-only">Abrir menú</span>
                      <span className="grid gap-1.5">
                        <span className="block h-0.5 w-5 rounded-full bg-current transition group-open:translate-y-2 group-open:rotate-45" />
                        <span className="block h-0.5 w-5 rounded-full bg-current transition group-open:opacity-0" />
                        <span className="block h-0.5 w-5 rounded-full bg-current transition group-open:-translate-y-2 group-open:-rotate-45" />
                      </span>
                    </summary>
                    <div className="absolute right-0 mt-3 grid w-[min(78vw,300px)] gap-1 rounded-2xl border border-white/18 bg-[color-mix(in_srgb,var(--landing-primary-darkest)_94%,transparent)] p-2 shadow-2xl shadow-slate-950/35 backdrop-blur-xl">
                      {heroMenuItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="landing-export-mobile-link rounded-xl px-4 py-3 text-sm font-semibold leading-snug text-white/90 no-underline transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : null}

                {ctaButton ? (
                  <a
                    href="#default-form"
                    className="landing-export-header-cta hidden min-h-11 items-center justify-center justify-self-start rounded-full border border-[var(--landing-secondary-light)] bg-[linear-gradient(135deg,var(--landing-secondary),var(--landing-secondary-dark))] px-5 py-2.5 text-sm font-extrabold text-[var(--landing-secondary-text)] no-underline shadow-[0_14px_34px_color-mix(in_srgb,var(--landing-secondary)_35%,transparent)] transition hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex lg:justify-self-end"
                  >
                    {landing.language === "en"
                      ? "Enroll now"
                      : "Inscríbete ahora"}
                  </a>
                ) : null}
              </nav>
            </div>
          </div>
        </>
      ) : null}

      <div id="landing-hero" className="scroll-mt-24">
        {heroVariant === "option-b" ? (
          <DefaultLandingHeroSectionB
            menuItems={heroMenuItems}
            menuCtaLabel={
              landing.language === "en" ? "Enroll now" : "Inscribete ahora"
            }
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
            formTitle={formTitle}
            formDescription={formDescription}
            submitLabel={form.submitLabel?.trim() || copy.formSubmitLabel}
            fullNameLabel={copy.formFullNameLabel}
            phoneLabel={copy.formPhoneLabel}
            emailLabel={copy.formEmailLabel}
            zipLabel={landing.language === "es" ? "Código postal" : "ZIP Code"}
            primaryColor={primaryColor}
            mode={mode}
            hasConfiguredForm={hasConfiguredForm}
            backgroundImage={hero.backgroundImage || ""}
            heroOverlayColor={heroOverlayColor}
            liveEdit={liveEdit}
            showMenu={false}
          />
        ) : (
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
            formTitle={formTitle}
            formDescription={formDescription}
            submitLabel={form.submitLabel?.trim() || copy.formSubmitLabel}
            fullNameLabel={copy.formFullNameLabel}
            phoneLabel={copy.formPhoneLabel}
            emailLabel={copy.formEmailLabel}
            zipLabel={landing.language === "es" ? "Código postal" : "ZIP Code"}
            primaryColor={primaryColor}
            mode={mode}
            hasConfiguredForm={hasConfiguredForm}
            backgroundImage={hero.backgroundImage || ""}
            heroOverlayColor={heroOverlayColor}
            liveEdit={liveEdit}
            showForm={!hasStandaloneFormSection}
          />
        )}
      </div>

      {hasStandaloneFormSection ? (
        <DefaultLandingFormSection
          formSection={formSection}
          form={form}
          fullTitle={fullTitle}
          title={title}
          ctaButton={ctaButton}
          submitLabel={form.submitLabel?.trim() || copy.formSubmitLabel}
          fullNameLabel={copy.formFullNameLabel}
          phoneLabel={copy.formPhoneLabel}
          emailLabel={copy.formEmailLabel}
          zipLabel={landing.language === "es" ? "CÃ³digo postal" : "ZIP Code"}
          primaryColor={primaryColor}
          mode={mode}
          hasConfiguredForm={hasConfiguredForm}
          liveEdit={liveEdit}
        />
      ) : null}

      <DefaultLandingCertificationsSection
        activeCertifications={activeCertifications}
        getCertificationLogo={getCertificationLogo}
        logoMode={landing.logoMode}
        title={copy.certificationsRowTitle}
      />

      {hasOverviewSection ? (
        <div id="landing-overview" className="scroll-mt-24">
          <DefaultLandingOverviewSection
            eyebrow={overview.eyebrow || ""}
            title={overview.title || ""}
            description={overview.description || ""}
            image={overview.image || ""}
            items={overviewItems}
            liveEdit={liveEdit}
            eyebrowPath="overview.eyebrow"
          />
        </div>
      ) : null}

      {hasProgramExplorerSection ? (
        <div id="landing-program-explorer" className="scroll-mt-24">
          {mode === "export" ? (
            <DefaultLandingProgramExplorerSectionStatic
              explorer={programExplorer}
              planDownloadUrl={
                curriculum.buttonUrl || curriculum.downloadUrl || ""
              }
              liveEdit={liveEdit}
            />
          ) : (
            <DefaultLandingProgramExplorerSection
              explorer={programExplorer}
              planDownloadUrl={
                curriculum.buttonUrl || curriculum.downloadUrl || ""
              }
              liveEdit={liveEdit}
            />
          )}
        </div>
      ) : null}

      {hasGraduateProfileSection ? (
        <div id="landing-graduate-profile" className="scroll-mt-24">
          <GraduateProfileSection
            graduateProfile={graduateProfile}
            eyebrow={graduateProfile.eyebrow || ""}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            liveEdit={liveEdit}
            eyebrowPath="graduateProfile.eyebrow"
          />
        </div>
      ) : null}

      {hasWhyStudySection ? (
        <div id="landing-why-study" className="scroll-mt-24">
          <DefaultLandingWhyStudySection
            brandName={brandName}
            eyebrow={whyStudy.eyebrow || ""}
            sectionId={landing.slug}
            title={whyStudy.title || ""}
            description={whyStudy.description || ""}
            image={whyStudy.image || ""}
            logo={logo}
            heroTitle={title}
            items={whyStudyItems}
            cards={whyStudy.cards ?? []}
            liveEdit={liveEdit}
            eyebrowPath="whyStudy.eyebrow"
          />
        </div>
      ) : null}

      {hasCareerSection ? (
        <div id="landing-career-opportunities" className="scroll-mt-24">
          <OpportunityToWorkSection
            opportunityToWork={careerSectionData}
            eyebrow={careerSectionData?.eyebrow || ""}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            liveEdit={liveEdit}
            basePath={
              landing.opportunityToWork ? "opportunityToWork" : "careerOutcomes"
            }
          />
        </div>
      ) : null}

      {hasCurriculumSection ? (
        <div id="landing-curriculum" className="scroll-mt-24">
          <DefaultLandingDetailCardsSection
            eyebrow={curriculum.eyebrow || ""}
            title={curriculum.title || ""}
            description={curriculum.description || ""}
            items={curriculumItems}
            buttonUrl={curriculum.buttonUrl || ""}
            downloadUrl={curriculum.downloadUrl || ""}
            buttonLabel={curriculum.buttonTitle || copy.curriculumButton}
            viewMoreLabel={copy.sectionViewMore}
            liveEdit={liveEdit}
            eyebrowPath="curriculum.eyebrow"
            titlePath="curriculum.title"
            descriptionPath="curriculum.description"
            buttonLabelPath="curriculum.buttonTitle"
            buttonUrlPath="curriculum.buttonUrl"
            itemsPath="curriculum.items"
          />
        </div>
      ) : null}

      {hasHandsOnSection ? (
        <div id="landing-hands-on-training" className="scroll-mt-24">
          <DefaultLandingDetailCardsSection
            eyebrow={handsOnTraining.eyebrow || ""}
            title={handsOnTraining.title || ""}
            description={handsOnTraining.description || ""}
            items={handsOnTrainingItems}
            soft
            viewMoreLabel={copy.sectionViewMore}
            liveEdit={liveEdit}
            titlePath="handsOnTraining.title"
            descriptionPath="handsOnTraining.description"
            itemsPath="handsOnTraining.items"
          />
        </div>
      ) : null}

      {hasExternshipSection ? (
        <div id="landing-externship" className="scroll-mt-24">
          <DefaultLandingExternshipSection
            eyebrow={externship.eyebrow || ""}
            enabled={Boolean(externship.enabled)}
            title={externship.title || ""}
            description={externship.description || ""}
            image={externship.image || ""}
            hours={externship.hours || ""}
            hoursLabel={copy.externshipHoursLabel}
            partners={externship.partners ?? []}
            partnerLabel={copy.externshipPartnerLabel}
            liveEdit={liveEdit}
          />
        </div>
      ) : null}

      {hasSupportSection ? (
        <div id="landing-support" className="scroll-mt-24">
          <DefaultLandingSupportSection
            eyebrow={supportSection.eyebrow || ""}
            title={supportTitle}
            description={supportDescription}
            videoUrl={supportVideoUrl}
            items={supportItems}
            isDirectVideoUrl={isDirectVideoUrl}
            liveEdit={liveEdit}
            eyebrowPath={`${supportSectionPath}.eyebrow`}
            titlePath={`${supportSectionPath}.title`}
            descriptionPath={`${supportSectionPath}.description`}
            itemsPath={`${supportSectionPath}.items`}
          />
        </div>
      ) : null}

      {hasBenefitsSection ? (
        <div id="landing-benefits" className="scroll-mt-24">
          <DefaultLandingBenefitsSection
            eyebrow={benefits.eyebrow || ""}
            title={benefits.title || ""}
            items={benefitItems}
            liveEdit={liveEdit}
            eyebrowPath="benefits.eyebrow"
          />
        </div>
      ) : null}

      {hasAdmissionsSection ? (
        <div id="landing-admissions" className="scroll-mt-24">
          <DefaultLandingDetailCardsSection
            eyebrow={admissions.eyebrow || ""}
            title={admissions.title || ""}
            description={admissions.description || ""}
            items={admissionsItems}
            viewMoreLabel={copy.sectionViewMore}
            liveEdit={liveEdit}
            eyebrowPath="admissions.eyebrow"
            titlePath="admissions.title"
            descriptionPath="admissions.description"
            itemsPath="admissions.items"
          />
        </div>
      ) : null}

      {hasFinancialAidSection ? (
        <div id="landing-financial-aid" className="scroll-mt-24">
          <DefaultLandingDetailCardsSection
            eyebrow={financialAid.eyebrow || ""}
            title={financialAid.title || ""}
            description={financialAid.description || ""}
            items={financialAidItems}
            variant={
              financialAid.variant === "option-b" ? "secondary-b" : "secondary"
            }
            viewMoreLabel={copy.sectionViewMore}
            liveEdit={liveEdit}
            eyebrowPath="financialAid.eyebrow"
            titlePath="financialAid.title"
            descriptionPath="financialAid.description"
            itemsPath="financialAid.items"
          />
        </div>
      ) : null}

      {hasTestimonialsSection ? (
        <div id="landing-testimonials" className="scroll-mt-24">
          <DefaultLandingTestimonialsSection
            eyebrow=""
            title={copy.studentStoriesTitle}
            items={landing.testimonials ?? []}
            liveEdit={liveEdit}
          />
        </div>
      ) : null}

      {hasFaqSection ? (
        <div id="landing-faq" className="scroll-mt-24">
          <DefaultLandingFaqSection
            eyebrow=""
            items={landing.faq ?? []}
            title={copy.faqTitle}
            liveEdit={liveEdit}
          />
        </div>
      ) : null}

      <div id="landing-cta" className="scroll-mt-24">
        <DefaultLandingCtaSection
          title={ctaTitle}
          description={ctaDescription}
          button={ctaButton}
          secondaryButton={ctaSecondaryButton}
          image={ctaImage}
          variant={ctaVariant}
          hasForm={hasForm && hasCta}
          liveEdit={liveEdit}
        />
      </div>

      {hasCampusesSection ? (
        <div id="landing-campuses" className="scroll-mt-24">
          <DefaultLandingCampusesSection
            eyebrow=""
            campuses={campuses}
            campusFilters={landing.delivery?.campuses ?? []}
            primaryColor={primaryColor}
            primaryTextColor={primaryTextColor}
            isDirectVideoUrl={isDirectVideoUrl}
            title={copy.campusesTitle}
            description={copy.campusesDescription}
            videoLabel={copy.campusesVideoLabel}
          />
        </div>
      ) : null}

      <DefaultLandingFooterSection
        logo={footerLogo}
        brandName={brandName}
        description={brand.description || ""}
        legalText={brand.footerLegalText || ""}
        advisorName={
          brand.showFooterContact === false ? "" : contact.advisorName || ""
        }
        advisorTitle={
          brand.showFooterContact === false ? "" : contact.advisorTitle || ""
        }
        phone={brand.showFooterContact === false ? "" : contact.phone || ""}
        email={brand.showFooterContact === false ? "" : contact.email || ""}
        legalLinks={legalLinks}
        phoneLabel={copy.footerPhoneLabel}
        emailLabel={copy.footerEmailLabel}
        legalLinksAriaLabel={copy.legalLinksAriaLabel}
        mode={mode}
      />

      {mode === "export" ? (
        <DefaultLandingFloatingActionsStatic />
      ) : (
        <DefaultLandingBackToTopButton showWhatsApp={!liveEdit?.enabled} />
      )}

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
