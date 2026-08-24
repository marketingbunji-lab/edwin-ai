import fs from "node:fs";
import path from "node:path";
import {
  getVisualAssetsByCategory,
  type VisualAssetRecord,
} from "./brandAgentRecords";
import {
  defaultLandingLanguageForBrand,
  getLandingTemplateCopy,
  landingTemplateCopyByLanguage,
  normalizeLandingLanguage,
  type LandingLanguage,
} from "./landingLanguage";
import { enrichBrandColorPalette } from "./brandColors";

export type Brand = {
  slug: string;
  name: string;
  shortName?: string;
  logo: string;
  favicon?: string;
  logos?: {
    light?: string;
    dark?: string;
  };
  typography?: {
    fontFamily?: string;
    googleFontHref?: string;
  };
  identityManual?: string;
  primaryColor: string;
  secondaryColor: string;
  colorPalette?: BrandColorPalette;
  description?: string;
  officialWebsite?: string;
  siteName?: string;
  abstract?: string;
  keywords?: string[];
  robots?: string;
  generator?: string;
  imageBrand?: string;
  images?: string[];
  campuses?: BrandCampus[];
  legalLinks?: LegalLink[];
  certifications?: BrandCertification[];
  documents?: BrandDocuments;
};

export type BrandCampus = {
  name?: string;
  location?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
};

export type LegalLink = {
  label: string;
  url: string;
};

export type BrandColorScale = {
  lightest: string;
  light: string;
  dark: string;
  darkest: string;
};

export type BrandColorPalette = {
  primary?: BrandColorScale;
  secondary?: BrandColorScale;
};

export type BrandCertification = {
  name: string;
  url: string;
  logos?: {
    light?: string;
    dark?: string;
  };
};

export type BrandDocumentCategoryId =
  | "legal"
  | "catalogs"
  | "brandBook"
  | "curriculum"
  | "website";

export type BrandDocumentSourceMode = "file" | "link";

export type BrandDocumentCategory = {
  mode?: BrandDocumentSourceMode;
  fileName?: string;
  fileUrl?: string;
  link?: string;
  updatedAt?: string;
  deleted?: boolean;
};

export type BrandDocuments = Partial<
  Record<BrandDocumentCategoryId, BrandDocumentCategory>
>;

export type Program = {
  id: string;
  programName: string;
  sourceWebsite: string;
  catalog: string;
  updatedAt: string;
};

export type AccordionItem = {
  title?: string;
  content?: string;
  description?: string;
  url?: string;
  image?: string;
};

export type IconTextItem = {
  title?: string;
  text?: string;
  description?: string;
  icon?: string;
};

export type ProgramInfoItem = {
  key?: string;
  label?: string;
  value?: string;
};

export type LabelValueItem = {
  label?: string;
  value?: string;
};

export type ProgramExplorerTabGroupItem = {
  label?: string;
  value?: string;
};

export type ProgramExplorerTabGroup = {
  title?: string;
  items?: ProgramExplorerTabGroupItem[];
};

export type ProgramExplorerTab = {
  id?: string;
  label?: string;
  title?: string;
  description?: string;
  listStyle?: "bullets" | "steps";
  items?: string[];
  groups?: ProgramExplorerTabGroup[];
};

export type ProgramExplorerCard = {
  title?: string;
  icon?: string;
  items?: string[];
};

export type FormCampusOption = {
  label?: string;
  campus?: string;
  campaigntype?: string;
};

export type TitleDescriptionItem = {
  title?: string;
  description?: string;
  content?: string;
  text?: string;
  url?: string;
  image?: string;
  items?: string[];
};

export type OpportunityToWork = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  items?: Array<string | TitleDescriptionItem>;
};

export type GraduateProfile = {
  eyebrow?: string;
  title?: string;
  image?: string;
  items?: Array<string | TitleDescriptionItem>;
};

export type LandingCertificationSettings = {
  enabled?: boolean;
  title?: string;
  resolutionText?: string;
  items?: Array<string | LandingCertificationItem>;
};

export type LandingCertificationItem = {
  name?: string;
  title?: string;
  description?: string;
  url?: string;
  enabled?: boolean;
  resolutionText?: string;
};

export type LandingHero = {
  variant?: "default" | "option-b" | "menu";
  menuItems?: string[];
  eyebrow?: string;
  highlight?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  supportText?: string;
  modality?: string;
  semesterPrice?: string;
  price?: string;
  discountedPrice?: string;
  discountPercentage?: string;
  duration?: string;
  primaryCta?: {
    label?: string;
    url?: string;
  };
  secondaryCta?: {
    label?: string;
    url?: string;
  };
  overlayColor?: string;
  backgroundImage?: string;
  personImage?: string;
  videoUrl?: string;
};

export type Landing = {
  slug: string;
  brand: string;
  sourceProgramId?: string;
  sourceProgramSlug?: string;
  language?: LandingLanguage;
  title: string;
  fullTitle: string;
  sourceWebsite?: string;
  programUrl?: string;
  catalog?: string;
  shortTitle?: string;
  programType?: string;
  degreeLevel?: string;
  academicArea?: string;
  faculty?: string;
  snies?: string;
  cipCode?: string;
  schedule?: string;
  template: string;
  status: string;
  updatedAt: string;
  logoMode?: "light" | "dark";
  certifications?: LandingCertificationSettings;
  delivery?: {
    modality?: string;
    schedule?: string;
    language?: string;
    campuses?: string[];
    onlineAvailable?: boolean;
    hybridAvailable?: boolean;
    onCampusAvailable?: boolean;
  };
  duration?: {
    value?: string;
    unit?: string;
    display?: string;
    credits?: string;
    semesters?: string;
    hours?: string;
    externshipHours?: string;
  };
  tuition?: {
    amount?: string;
    currency?: string;
    period?: string;
    display?: string;
    financialAidAvailable?: boolean;
    financialAidText?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  hero?: LandingHero;
  summaryCards?: LabelValueItem[];
  programInfo?: Array<string | ProgramInfoItem>;
  overview?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    items?: Array<string | TitleDescriptionItem>;
  };
  programExplorer?: {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    cardsTitle?: string;
    tabs?: ProgramExplorerTab[];
    cards?: ProgramExplorerCard[];
  };
  graduateProfile?: GraduateProfile;
  opportunityToWork?: OpportunityToWork;
  whyStudy?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    items?: Array<string | AccordionItem>;
  };
  curriculum?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    downloadUrl?: string;
    buttonUrl?: string;
    buttonTitle?: string;
    items?: Array<string | AccordionItem>;
  };
  handsOnTraining?: {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: Array<string | AccordionItem>;
  };
  externship?: {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    hours?: string;
    partners?: string[];
  };
  careerOutcomes?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    items?: Array<string | TitleDescriptionItem>;
  };
  studentSupport?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    videoUrl?: string;
    items?: Array<string | IconTextItem>;
  };
  supportSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    videoUrl?: string;
    items?: Array<string | IconTextItem>;
  };
  benefits?: {
    eyebrow?: string;
    title?: string;
    items?: Array<string | IconTextItem>;
  };
  admissions?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: Array<string | TitleDescriptionItem>;
  };
  financialAid?: {
    enabled?: boolean;
    variant?: "default" | "option-b";
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: Array<string | TitleDescriptionItem>;
  };
  testimonials?: Array<{
    name?: string;
    role?: string;
    quote?: string;
    image?: string;
  }>;
  faq?: Array<{
    question?: string;
    answer?: string;
  }>;
  relatedPrograms?: Array<{
    title?: string;
    url?: string;
    image?: string;
  }>;
  contact?: {
    advisorName?: string;
    advisorTitle?: string;
    phone?: string;
    email?: string;
    image?: string;
  };
  cta?: {
    variant?: "default" | "minimal";
    title?: string;
    description?: string;
    button?: string;
    secondaryButton?: string;
    image?: string;
  };
  form?: {
    title?: string;
    description?: string;
    type?: string;
    scriptUrl?: string;
    scriptCode?: string;
    formId?: string;
    programName?: string;
    campus?: string;
    campusOptions?: FormCampusOption[];
    language?: string;
    campaigntype?: string;
    campaigncode?: string;
    leadsource?: string;
    leadid?: string;
    tenantid?: string;
    schoolname?: string;
    channel?: string;
    veritySysKey?: string;
    verityLeadPostUrl?: string;
    hiddenProgramFieldName?: string;
    submitLabel?: string;
  };
  formSection?: {
    enabled?: boolean;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    overlayColor?: string;
    textTheme?: "light" | "dark";
  };
  tracking?: {
    googleAdsProgram?: string;
    facebookEventName?: string;
    utmCampaign?: string;
  };
  branding?: {
    themeVariant?: string;
    backgroundBody?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    textColor?: string;
  };
  footerScripts?: string[];
};

function normalizeComparableText(value?: string) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function localizeGenericValue(
  value: string | undefined,
  localizedValue: string,
  genericValues: string[],
) {
  const normalizedValue = normalizeComparableText(value);

  if (!normalizedValue) {
    return localizedValue;
  }

  const normalizedGenericValues = genericValues
    .map((item) => normalizeComparableText(item))
    .filter(Boolean);

  return normalizedGenericValues.includes(normalizedValue)
    ? localizedValue
    : value || localizedValue;
}

function hasOwnField<T extends object>(target: T | undefined, field: keyof T) {
  return Boolean(target && Object.prototype.hasOwnProperty.call(target, field));
}

const brandsDir = path.join(process.cwd(), "data", "brands");
const programsDir = path.join(process.cwd(), "data", "programs");
const legacyLandingsDir = path.join(process.cwd(), "data", "landings");
const programsRegistryFile = "programs.json";

function toTitleDescriptionItems(
  items?: Array<string | TitleDescriptionItem>,
): TitleDescriptionItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: "",
          description: item,
        };
      }

      return {
        title: item.title || "",
        description: item.description || item.content || item.text || "",
        url: item.url || "",
        image: item.image || "",
        items: item.items ?? [],
      };
    })
    .filter(
      (item) =>
        Boolean(item.title?.trim()) ||
        Boolean(item.description?.trim()) ||
        Boolean(item.url?.trim()) ||
        Boolean(item.image?.trim()) ||
        Boolean(item.items?.some((bullet) => bullet.trim())),
    );
}

function normalizeTextMatch(value?: string) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getMatchTokens(value?: string) {
  return new Set(
    (normalizeTextMatch(value) ?? "")
      .split(" ")
      .map((token) => token.trim())
      .filter(
        (token) =>
          token.length >= 3 && !["program", "training", "plus"].includes(token),
      ),
  );
}

function getSlugFromProgramUrl(url?: string) {
  const value = url?.trim();

  if (!value) return "";

  const segments = value.split("/").filter(Boolean);
  return segments.at(-1)?.trim().toLowerCase() || "";
}

function resolveRelatedProgramImage(
  brandSlug: string,
  item: { title?: string; url?: string; image?: string },
) {
  const currentImage = item.image?.trim();

  if (currentImage) {
    return currentImage;
  }

  const brandFolder = getProgramDataFolder(brandSlug);

  if (!fs.existsSync(brandFolder)) {
    return "";
  }

  const targetSlug = getSlugFromProgramUrl(item.url);
  const targetTitle = normalizeTextMatch(item.title);
  const targetTokens = getMatchTokens(item.title);
  const files = fs
    .readdirSync(brandFolder)
    .filter((file) => file.endsWith(".json") && file !== programsRegistryFile);
  let bestImage = "";
  let bestScore = 0;

  for (const file of files) {
    const filePath = path.join(brandFolder, file);
    const content = fs.readFileSync(filePath, "utf8");
    const landing = JSON.parse(content) as Landing;
    const slug =
      landing.slug?.trim().toLowerCase() || file.replace(/\.json$/i, "");
    const title = normalizeTextMatch(landing.title);
    const fullTitle = normalizeTextMatch(landing.fullTitle);
    const sourceWebsite = normalizeTextMatch(landing.sourceWebsite);
    const slugTokens = getMatchTokens(slug);
    const titleTokens = getMatchTokens(landing.title);
    const fullTitleTokens = getMatchTokens(landing.fullTitle);

    if (
      (targetSlug && slug === targetSlug) ||
      (targetTitle && (title === targetTitle || fullTitle === targetTitle))
    ) {
      return landing.hero?.backgroundImage?.trim() || "";
    }

    if (
      targetTitle &&
      (title?.includes(targetTitle) ||
        fullTitle?.includes(targetTitle) ||
        targetTitle.includes(title || "") ||
        targetTitle.includes(fullTitle || "") ||
        sourceWebsite?.includes(targetTitle))
    ) {
      return landing.hero?.backgroundImage?.trim() || "";
    }

    if (targetTokens.size > 0) {
      const candidateTokens = new Set([
        ...slugTokens,
        ...titleTokens,
        ...fullTitleTokens,
      ]);
      let score = 0;

      targetTokens.forEach((token) => {
        if (candidateTokens.has(token)) {
          score += 1;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestImage = landing.hero?.backgroundImage?.trim() || "";
      }
    }
  }

  return bestScore >= 2 ? bestImage : "";
}

function getProgramVisualAssetCandidates(brandSlug: string, landing: Landing) {
  const assets = getVisualAssetsByCategory(brandSlug, "programs-assets");
  const targetSlug = landing.slug?.trim().toLowerCase() || "";
  const targetTitle = normalizeTextMatch(landing.title);
  const targetFullTitle = normalizeTextMatch(landing.fullTitle);
  const targetProgramName = normalizeTextMatch(landing.form?.programName);
  const targetTokens = new Set([
    ...getMatchTokens(landing.slug),
    ...getMatchTokens(landing.title),
    ...getMatchTokens(landing.fullTitle),
    ...getMatchTokens(landing.form?.programName),
  ]);

  const isUsableImageAsset = (asset: VisualAssetRecord) =>
    Boolean(asset.url?.trim()) &&
    asset.category === "programs-assets" &&
    asset.assetCategory !== "videos" &&
    asset.assetCategory !== "documents";

  const exactMatches = assets.filter((asset) => {
    if (!isUsableImageAsset(asset)) {
      return false;
    }

    return asset.programId?.trim().toLowerCase() === targetSlug;
  });

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  const scoredMatches = assets
    .filter(isUsableImageAsset)
    .map((asset) => {
      const normalizedProgramId = normalizeTextMatch(asset.programId);
      const normalizedProgramName = normalizeTextMatch(asset.programName);
      const normalizedAssetName = normalizeTextMatch(asset.name);
      const candidateTokens = new Set([
        ...getMatchTokens(asset.programId),
        ...getMatchTokens(asset.programName),
        ...getMatchTokens(asset.name),
      ]);

      let score = 0;

      if (
        normalizedProgramId &&
        (normalizedProgramId === targetSlug ||
          normalizedProgramId === targetTitle ||
          normalizedProgramId === targetFullTitle ||
          normalizedProgramId === targetProgramName)
      ) {
        score += 5;
      }

      if (
        normalizedProgramName &&
        (normalizedProgramName === targetTitle ||
          normalizedProgramName === targetFullTitle ||
          normalizedProgramName === targetProgramName)
      ) {
        score += 5;
      }

      if (
        normalizedProgramName &&
        targetTitle &&
        (normalizedProgramName.includes(targetTitle) ||
          targetTitle.includes(normalizedProgramName))
      ) {
        score += 3;
      }

      if (
        normalizedProgramName &&
        targetFullTitle &&
        (normalizedProgramName.includes(targetFullTitle) ||
          targetFullTitle.includes(normalizedProgramName))
      ) {
        score += 3;
      }

      if (
        normalizedAssetName &&
        targetTitle &&
        (normalizedAssetName.includes(targetTitle) ||
          targetTitle.includes(normalizedAssetName))
      ) {
        score += 1;
      }

      targetTokens.forEach((token) => {
        if (candidateTokens.has(token)) {
          score += 1;
        }
      });

      return { asset, score };
    })
    .filter((item) => item.score >= 3)
    .sort((left, right) => right.score - left.score);

  return scoredMatches.map((item) => item.asset);
}

function pickNextProgramVisualAsset(
  assets: VisualAssetRecord[],
  usedAssetIds: Set<string>,
  preferredCategories: string[],
) {
  for (const category of preferredCategories) {
    const matchedAsset = assets.find(
      (asset) =>
        !usedAssetIds.has(asset.id) &&
        asset.assetCategory?.trim() === category &&
        Boolean(asset.url?.trim()),
    );

    if (matchedAsset) {
      usedAssetIds.add(matchedAsset.id);
      return matchedAsset;
    }
  }

  const fallbackAsset = assets.find(
    (asset) => !usedAssetIds.has(asset.id) && Boolean(asset.url?.trim()),
  );

  if (!fallbackAsset) {
    return null;
  }

  usedAssetIds.add(fallbackAsset.id);
  return fallbackAsset;
}

function toIconTextItems(items?: Array<string | IconTextItem>): IconTextItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: "",
          text: item,
          description: item,
        };
      }

      return {
        title: item.title || "",
        text: item.text || item.description || "",
        description: item.description || item.text || "",
        icon: item.icon || "",
      };
    })
    .filter(
      (item) =>
        Boolean(item.title?.trim()) ||
        Boolean(item.text?.trim()) ||
        Boolean(item.description?.trim()) ||
        Boolean(item.icon?.trim()),
    );
}

function toProgramInfoItems(
  items?: Array<string | ProgramInfoItem>,
): ProgramInfoItem[] {
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => {
    if (typeof item === "string") {
      const [label, ...rest] = item.split(":");

      return rest.length
        ? {
            label: label.trim(),
            value: rest.join(":").trim(),
          }
        : {
            label: `Item ${index + 1}`,
            value: item,
          };
    }

    return {
      key: item.key || "",
      label: item.label || `Item ${index + 1}`,
      value: item.value || "",
    };
  });
}

function toCertificationItems(
  items?: Array<string | LandingCertificationItem>,
): LandingCertificationItem[] {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    if (typeof item === "string") {
      return {
        title: item,
        name: item,
        description: "",
        url: "",
        enabled: true,
        resolutionText: "",
      };
    }

    return {
      title: item.title || item.name || "",
      name: item.name || item.title || "",
      description: item.description || item.resolutionText || "",
      url: item.url || "",
      enabled: item.enabled ?? true,
      resolutionText: item.resolutionText || "",
    };
  });
}

export function normalizeLandingSchema(landing: Landing): Landing {
  const programInfo = toProgramInfoItems(landing.programInfo);
  const careerSource =
    landing.careerOutcomes ?? landing.opportunityToWork ?? {};
  const supportSource = (landing.studentSupport ??
    landing.supportSection ??
    {}) as NonNullable<Landing["studentSupport"]>;
  const hero = landing.hero ?? {};
  const durationDisplay = landing.duration?.display || hero.duration || "";
  const tuitionDisplay =
    landing.tuition?.display || hero.price || hero.semesterPrice || "";
  const deliveryModality = landing.delivery?.modality || hero.modality || "";
  const deliverySchedule = landing.delivery?.schedule || landing.schedule || "";
  const language =
    normalizeLandingLanguage(landing.language) ||
    normalizeLandingLanguage(landing.delivery?.language) ||
    defaultLandingLanguageForBrand(landing.brand);
  const copy = getLandingTemplateCopy(language, landing.brand);
  const englishCopy = landingTemplateCopyByLanguage.en;
  const spanishCopy = landingTemplateCopyByLanguage.es;
  const programVisualAssets = getProgramVisualAssetCandidates(
    landing.brand,
    landing,
  );
  const hasExplicitSectionImages = Boolean(
    landing.overview?.image ||
    landing.graduateProfile?.image ||
    landing.whyStudy?.image ||
    landing.externship?.image ||
    careerSource.image ||
    landing.contact?.image,
  );
  const hasExactProgramVisualAsset = programVisualAssets.some(
    (asset) =>
      asset.programId?.trim().toLowerCase() ===
      landing.slug?.trim().toLowerCase(),
  );
  const heroUsesManagedAsset = Boolean(
    hero.backgroundImage?.includes("/edwin-ai-assets/"),
  );
  const heroSharesLegacyImageWithOverview = Boolean(
    hero.backgroundImage &&
    landing.overview?.image &&
    hero.backgroundImage === landing.overview.image &&
    !hero.backgroundImage.includes("/edwin-ai-assets/"),
  );
  const shouldPromoteProgramAssetToHero = Boolean(
    programVisualAssets.length > 0 &&
    !heroUsesManagedAsset &&
    (!hero.backgroundImage ||
      (heroSharesLegacyImageWithOverview && hasExactProgramVisualAsset) ||
      (!hasExplicitSectionImages &&
        (hasExactProgramVisualAsset || programVisualAssets.length === 1))),
  );
  const usedProgramAssetIds = new Set<string>();
  const heroAsset = shouldPromoteProgramAssetToHero
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "heroImages",
        "lifestyleImages",
        "classroomImages",
        "galleryImages",
        "handsOnTrainingImages",
      ])
    : null;
  const overviewAsset = !landing.overview?.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "lifestyleImages",
        "classroomImages",
        "galleryImages",
        "heroImages",
      ])
    : null;
  const graduateProfileAsset = !landing.graduateProfile?.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "lifestyleImages",
        "classroomImages",
        "facultyImages",
        "testimonialImages",
        "galleryImages",
      ])
    : null;
  const whyStudyAsset = !landing.whyStudy?.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "classroomImages",
        "lifestyleImages",
        "galleryImages",
        "heroImages",
      ])
    : null;
  const handsOnAsset = !landing.externship?.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "handsOnTrainingImages",
        "classroomImages",
        "galleryImages",
        "lifestyleImages",
      ])
    : null;
  const careerAsset = !careerSource.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "careerImages",
        "testimonialImages",
        "lifestyleImages",
        "galleryImages",
      ])
    : null;
  const contactAsset = !landing.contact?.image
    ? pickNextProgramVisualAsset(programVisualAssets, usedProgramAssetIds, [
        "testimonialImages",
        "facultyImages",
        "lifestyleImages",
        "galleryImages",
      ])
    : null;
  const overviewItems = {
    title: landing.overview?.title || "",
    description: landing.overview?.description || "",
    image: landing.overview?.image || "",
    items: toTitleDescriptionItems(landing.overview?.items),
  };
  const graduateProfileItems = toTitleDescriptionItems(
    landing.graduateProfile?.items,
  );
  const whyStudyItems = toTitleDescriptionItems(landing.whyStudy?.items);
  const curriculumItems = toTitleDescriptionItems(landing.curriculum?.items);
  const handsOnTrainingItems = toTitleDescriptionItems(
    landing.handsOnTraining?.items,
  );
  const externshipPartners = landing.externship?.partners ?? [];
  const careerItems = toTitleDescriptionItems(careerSource.items);
  const supportItems = toIconTextItems(supportSource.items);
  const benefitItems = toIconTextItems(landing.benefits?.items);
  const admissionsItems = toTitleDescriptionItems(landing.admissions?.items);
  const financialAidItems = toTitleDescriptionItems(
    landing.financialAid?.items,
  );
  const hasOverviewContent = Boolean(
    overviewItems.title.trim() ||
    overviewItems.description.trim() ||
    overviewItems.image.trim() ||
    overviewItems.items.length > 0,
  );
  const hasGraduateProfileContent = Boolean(
    landing.graduateProfile?.title?.trim() ||
    landing.graduateProfile?.image?.trim() ||
    graduateProfileItems.length > 0,
  );
  const hasWhyStudyContent = Boolean(
    landing.whyStudy?.title?.trim() ||
    landing.whyStudy?.description?.trim() ||
    landing.whyStudy?.image?.trim() ||
    whyStudyItems.length > 0,
  );
  const hasCurriculumContent = Boolean(
    landing.curriculum?.description?.trim() ||
    landing.curriculum?.downloadUrl?.trim() ||
    landing.curriculum?.buttonUrl?.trim() ||
    curriculumItems.length > 0,
  );
  const hasHandsOnTrainingContent = Boolean(
    landing.handsOnTraining?.enabled &&
    (landing.handsOnTraining?.description?.trim() ||
      handsOnTrainingItems.length > 0),
  );
  const hasExternshipContent = Boolean(
    landing.externship?.enabled &&
    (landing.externship?.description?.trim() ||
      landing.externship?.image?.trim() ||
      landing.externship?.hours?.trim() ||
      externshipPartners.some((partner) => partner.trim())),
  );
  const hasCareerContent = Boolean(
    careerSource.subtitle?.trim() ||
    careerSource.image?.trim() ||
    careerItems.length > 0,
  );
  const hasSupportContent = Boolean(
    supportSource.description?.trim() ||
    supportSource.videoUrl?.trim() ||
    supportItems.length > 0,
  );
  const hasAdmissionsContent = Boolean(
    landing.admissions?.description?.trim() || admissionsItems.length > 0,
  );
  const hasFinancialAidContent = Boolean(
    landing.financialAid?.enabled &&
    (landing.financialAid?.description?.trim() || financialAidItems.length > 0),
  );

  return {
    ...landing,
    template: "DefaultLanding",
    status: landing.status || "draft",
    updatedAt: landing.updatedAt || new Date().toISOString().slice(0, 10),
    logoMode: landing.logoMode || "dark",
    sourceWebsite: landing.sourceWebsite || "",
    programUrl: landing.programUrl || landing.sourceWebsite || "",
    catalog: landing.catalog || "",
    title: landing.title || "",
    fullTitle: landing.fullTitle || landing.title || "",
    shortTitle: landing.shortTitle || landing.title || "",
    programType: landing.programType || "",
    degreeLevel: landing.degreeLevel || "",
    academicArea: landing.academicArea || "",
    faculty: landing.faculty || "",
    snies: landing.snies || "",
    cipCode: landing.cipCode || "",
    schedule: deliverySchedule,
    language,
    delivery: {
      modality: deliveryModality,
      schedule: deliverySchedule,
      language,
      campuses: landing.delivery?.campuses ?? [],
      onlineAvailable: Boolean(landing.delivery?.onlineAvailable),
      hybridAvailable: Boolean(landing.delivery?.hybridAvailable),
      onCampusAvailable: Boolean(landing.delivery?.onCampusAvailable),
    },
    duration: {
      value: landing.duration?.value || "",
      unit: landing.duration?.unit || "",
      display: durationDisplay,
      credits: landing.duration?.credits || "",
      semesters: landing.duration?.semesters || "",
      hours: landing.duration?.hours || "",
      externshipHours: landing.duration?.externshipHours || "",
    },
    tuition: {
      amount: landing.tuition?.amount || "",
      currency: landing.tuition?.currency || "",
      period: landing.tuition?.period || "",
      display: tuitionDisplay,
      financialAidAvailable: Boolean(landing.tuition?.financialAidAvailable),
      financialAidText: landing.tuition?.financialAidText || "",
    },
    seo: {
      metaTitle: landing.seo?.metaTitle || landing.fullTitle || landing.title,
      metaDescription: landing.seo?.metaDescription || hero.description || "",
      keywords: landing.seo?.keywords ?? [],
    },
    hero: {
      variant:
        hero.variant === "menu"
          ? "option-b"
          : hero.variant === "option-b"
            ? "option-b"
            : "default",
      menuItems: hero.menuItems,
      eyebrow: hero.eyebrow || "",
      highlight: hero.highlight || "",
      title: hero.title || landing.fullTitle || landing.title,
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      supportText: hero.supportText || "",
      modality: hero.modality || deliveryModality,
      semesterPrice: hero.semesterPrice || tuitionDisplay,
      price: hero.price || tuitionDisplay,
      discountedPrice: hero.discountedPrice || "",
      discountPercentage: hero.discountPercentage || "",
      duration: hero.duration || durationDisplay,
      primaryCta: {
        label: localizeGenericValue(
          hero.primaryCta?.label,
          copy.heroPrimaryCtaLabel,
          [englishCopy.heroPrimaryCtaLabel, spanishCopy.heroPrimaryCtaLabel],
        ),
        url: hero.primaryCta?.url || "#form",
      },
      secondaryCta: {
        label: hero.secondaryCta?.label || "",
        url: hero.secondaryCta?.url || "",
      },
      backgroundImage:
        heroAsset?.url?.trim() || "" || hero.backgroundImage || "",
      personImage: hero.personImage || "",
      videoUrl: hero.videoUrl || "",
      overlayColor: hero.overlayColor || "",
    },
    summaryCards: landing.summaryCards ?? [],
    programInfo,
    overview: {
      eyebrow: hasOverviewContent ? landing.overview?.eyebrow || "" : "",
      title: hasOverviewContent
        ? localizeGenericValue(landing.overview?.title, copy.overviewTitle, [
            englishCopy.overviewTitle,
            spanishCopy.overviewTitle,
          ])
        : "",
      description: hasOverviewContent
        ? landing.overview?.description || ""
        : "",
      image: hasOverviewContent
        ? landing.overview?.image || overviewAsset?.url?.trim() || ""
        : "",
      items: hasOverviewContent ? overviewItems.items : [],
    },
    programExplorer: {
      enabled: Boolean(landing.programExplorer?.enabled),
      eyebrow: landing.programExplorer?.eyebrow || "",
      title: landing.programExplorer?.title || "",
      description: landing.programExplorer?.description || "",
      cardsTitle: landing.programExplorer?.cardsTitle || "",
      tabs: landing.programExplorer?.tabs ?? [],
      cards: landing.programExplorer?.cards ?? [],
    },
    graduateProfile: {
      eyebrow: hasGraduateProfileContent
        ? landing.graduateProfile?.eyebrow || ""
        : "",
      title: hasGraduateProfileContent
        ? landing.graduateProfile?.title || ""
        : "",
      image: hasGraduateProfileContent
        ? landing.graduateProfile?.image ||
          graduateProfileAsset?.url?.trim() ||
          ""
        : "",
      items: hasGraduateProfileContent ? graduateProfileItems : [],
    },
    whyStudy: {
      eyebrow: hasWhyStudyContent ? landing.whyStudy?.eyebrow || "" : "",
      title: hasWhyStudyContent
        ? localizeGenericValue(landing.whyStudy?.title, copy.whyStudyTitle, [
            englishCopy.whyStudyTitle,
            spanishCopy.whyStudyTitle,
          ])
        : "",
      description: hasWhyStudyContent
        ? landing.whyStudy?.description || ""
        : "",
      image: hasWhyStudyContent
        ? landing.whyStudy?.image || whyStudyAsset?.url?.trim() || ""
        : "",
      items: hasWhyStudyContent ? whyStudyItems : [],
    },
    curriculum: {
      eyebrow: hasCurriculumContent ? landing.curriculum?.eyebrow || "" : "",
      title: hasCurriculumContent
        ? localizeGenericValue(
            landing.curriculum?.title,
            copy.curriculumTitle,
            [englishCopy.curriculumTitle, spanishCopy.curriculumTitle],
          )
        : "",
      description: hasCurriculumContent
        ? landing.curriculum?.description || ""
        : "",
      downloadUrl: hasCurriculumContent
        ? landing.curriculum?.downloadUrl || ""
        : "",
      buttonUrl: hasCurriculumContent
        ? landing.curriculum?.buttonUrl || landing.curriculum?.downloadUrl || ""
        : "",
      buttonTitle: hasCurriculumContent
        ? landing.curriculum?.buttonTitle || ""
        : "",
      items: hasCurriculumContent ? curriculumItems : [],
    },
    handsOnTraining: {
      enabled: Boolean(landing.handsOnTraining?.enabled),
      eyebrow: hasHandsOnTrainingContent
        ? landing.handsOnTraining?.eyebrow || ""
        : "",
      title: hasHandsOnTrainingContent
        ? localizeGenericValue(
            landing.handsOnTraining?.title,
            copy.handsOnTrainingTitle,
            [
              englishCopy.handsOnTrainingTitle,
              spanishCopy.handsOnTrainingTitle,
            ],
          )
        : "",
      description: hasHandsOnTrainingContent
        ? landing.handsOnTraining?.description || ""
        : "",
      items: hasHandsOnTrainingContent ? handsOnTrainingItems : [],
    },
    externship: {
      enabled: Boolean(landing.externship?.enabled),
      eyebrow: hasExternshipContent ? landing.externship?.eyebrow || "" : "",
      title: hasExternshipContent
        ? localizeGenericValue(
            landing.externship?.title,
            copy.externshipTitle,
            [englishCopy.externshipTitle, spanishCopy.externshipTitle],
          )
        : "",
      description: hasExternshipContent
        ? landing.externship?.description || ""
        : "",
      image: hasExternshipContent
        ? landing.externship?.image || handsOnAsset?.url?.trim() || ""
        : "",
      hours: hasExternshipContent ? landing.externship?.hours || "" : "",
      partners: hasExternshipContent ? externshipPartners : [],
    },
    careerOutcomes: {
      eyebrow: hasCareerContent ? careerSource.eyebrow || "" : "",
      title: hasCareerContent
        ? localizeGenericValue(
            careerSource.title,
            copy.careerOpportunitiesTitle,
            [
              englishCopy.careerOpportunitiesTitle,
              spanishCopy.careerOpportunitiesTitle,
            ],
          )
        : "",
      subtitle: hasCareerContent ? careerSource.subtitle || "" : "",
      image: hasCareerContent
        ? careerSource.image || careerAsset?.url?.trim() || ""
        : "",
      items: hasCareerContent ? careerItems : [],
    },
    opportunityToWork: {
      eyebrow: hasCareerContent ? careerSource.eyebrow || "" : "",
      title: hasCareerContent
        ? localizeGenericValue(
            careerSource.title,
            copy.careerOpportunitiesTitle,
            [
              englishCopy.careerOpportunitiesTitle,
              spanishCopy.careerOpportunitiesTitle,
            ],
          )
        : "",
      subtitle: hasCareerContent ? careerSource.subtitle || "" : "",
      image: hasCareerContent
        ? careerSource.image || careerAsset?.url?.trim() || ""
        : "",
      items: hasCareerContent ? careerItems : [],
    },
    studentSupport: {
      eyebrow: hasSupportContent ? supportSource.eyebrow || "" : "",
      title: hasSupportContent
        ? localizeGenericValue(supportSource.title, copy.studentSupportTitle, [
            englishCopy.studentSupportTitle,
            spanishCopy.studentSupportTitle,
          ])
        : "",
      description: hasSupportContent ? supportSource.description || "" : "",
      videoUrl: hasSupportContent ? supportSource.videoUrl || "" : "",
      items: hasSupportContent ? supportItems : [],
    },
    supportSection: {
      eyebrow: hasSupportContent ? supportSource.eyebrow || "" : "",
      title: hasSupportContent
        ? localizeGenericValue(supportSource.title, copy.studentSupportTitle, [
            englishCopy.studentSupportTitle,
            spanishCopy.studentSupportTitle,
          ])
        : "",
      description: hasSupportContent ? supportSource.description || "" : "",
      videoUrl: hasSupportContent ? supportSource.videoUrl || "" : "",
      items: hasSupportContent ? supportItems : [],
    },
    benefits: {
      eyebrow: benefitItems.length ? landing.benefits?.eyebrow || "" : "",
      title: benefitItems.length
        ? localizeGenericValue(
            landing.benefits?.title,
            copy.programBenefitsTitle,
            [
              englishCopy.programBenefitsTitle,
              spanishCopy.programBenefitsTitle,
            ],
          )
        : "",
      items: benefitItems,
    },
    admissions: {
      eyebrow: hasAdmissionsContent ? landing.admissions?.eyebrow || "" : "",
      title: hasAdmissionsContent
        ? localizeGenericValue(
            landing.admissions?.title,
            copy.admissionsTitle,
            [englishCopy.admissionsTitle, spanishCopy.admissionsTitle],
          )
        : "",
      description: hasAdmissionsContent
        ? landing.admissions?.description || ""
        : "",
      items: hasAdmissionsContent ? admissionsItems : [],
    },
    financialAid: {
      enabled: Boolean(landing.financialAid?.enabled),
      variant:
        landing.financialAid?.variant === "option-b" ? "option-b" : "default",
      eyebrow: hasFinancialAidContent
        ? landing.financialAid?.eyebrow || ""
        : "",
      title: hasFinancialAidContent
        ? localizeGenericValue(
            landing.financialAid?.title,
            copy.financialAidTitle,
            [englishCopy.financialAidTitle, spanishCopy.financialAidTitle],
          )
        : "",
      description: hasFinancialAidContent
        ? landing.financialAid?.description || ""
        : "",
      items: hasFinancialAidContent ? financialAidItems : [],
    },
    testimonials: landing.testimonials ?? [],
    faq: landing.faq ?? [],
    certifications: {
      enabled: Boolean(landing.certifications?.enabled),
      title: localizeGenericValue(
        landing.certifications?.title,
        copy.certificationsTitle,
        [englishCopy.certificationsTitle, spanishCopy.certificationsTitle],
      ),
      resolutionText: landing.certifications?.resolutionText || "",
      items: toCertificationItems(landing.certifications?.items),
    },
    relatedPrograms: (landing.relatedPrograms ?? []).map((item) => ({
      ...item,
      image: resolveRelatedProgramImage(landing.brand, item),
    })),
    contact: {
      advisorName: landing.contact?.advisorName || "",
      advisorTitle: landing.contact?.advisorTitle || "",
      phone: landing.contact?.phone || "",
      email: landing.contact?.email || "",
      image: landing.contact?.image || contactAsset?.url?.trim() || "",
    },
    cta: {
      variant: landing.cta?.variant === "minimal" ? "minimal" : "default",
      title: localizeGenericValue(landing.cta?.title, copy.ctaTitle, [
        englishCopy.ctaTitle,
        spanishCopy.ctaTitle,
      ]),
      description: landing.cta?.description || "",
      button: localizeGenericValue(landing.cta?.button, copy.ctaButton, [
        englishCopy.ctaButton,
        spanishCopy.ctaButton,
      ]),
      secondaryButton: landing.cta?.secondaryButton || "",
      image: landing.cta?.image || "",
    },
    form: {
      title: hasOwnField(landing.form, "title")
        ? landing.form?.title || ""
        : localizeGenericValue(landing.form?.title, copy.formTitle, [
            englishCopy.formTitle,
            spanishCopy.formTitle,
          ]),
      description: hasOwnField(landing.form, "description")
        ? landing.form?.description || ""
        : localizeGenericValue(
            landing.form?.description,
            copy.formDescription,
            [englishCopy.formDescription, spanishCopy.formDescription],
          ),
      scriptUrl: landing.form?.scriptUrl || "",
      scriptCode: landing.form?.scriptCode || "",
      formId: landing.form?.formId || "",
      programName:
        landing.form?.programName || landing.fullTitle || landing.title,
      campus: landing.form?.campus || "",
      campusOptions: (landing.form?.campusOptions ?? []).map((option) => ({
        label: option?.label || "",
        campus: option?.campus || "",
        campaigntype: option?.campaigntype || "",
      })),
      language:
        landing.form?.language || (language === "es" ? "Spanish" : "English"),
      campaigntype: landing.form?.campaigntype || "",
      campaigncode: landing.form?.campaigncode || "",
      leadsource: landing.form?.leadsource || "",
      leadid: landing.form?.leadid || "",
      tenantid: landing.form?.tenantid || "",
      schoolname: landing.form?.schoolname || "",
      channel: landing.form?.channel || "",
      veritySysKey: landing.form?.veritySysKey || "",
      verityLeadPostUrl: landing.form?.verityLeadPostUrl || "",
      hiddenProgramFieldName: landing.form?.hiddenProgramFieldName || "program",
      submitLabel: localizeGenericValue(
        landing.form?.submitLabel,
        copy.formSubmitLabel,
        [englishCopy.formSubmitLabel, spanishCopy.formSubmitLabel],
      ),
      type: landing.form?.type,
    },
    formSection: {
      enabled: Boolean(landing.formSection?.enabled),
      eyebrow: landing.formSection?.eyebrow || "",
      title: landing.formSection?.title || "",
      subtitle: landing.formSection?.subtitle || "",
      description: landing.formSection?.description || "",
      backgroundImage: landing.formSection?.backgroundImage || "",
      overlayColor: landing.formSection?.overlayColor || "",
      textTheme: landing.formSection?.textTheme || "dark",
    },
    tracking: {
      googleAdsProgram: landing.tracking?.googleAdsProgram || "",
      facebookEventName: landing.tracking?.facebookEventName || "Lead",
      utmCampaign: landing.tracking?.utmCampaign || "",
    },
    branding: {
      themeVariant: landing.branding?.themeVariant || "",
      backgroundBody: landing.branding?.backgroundBody || "",
      primaryColor: landing.branding?.primaryColor || "",
      secondaryColor: landing.branding?.secondaryColor || "",
      accentColor: landing.branding?.accentColor || "",
      textColor: landing.branding?.textColor || "",
    },
    footerScripts: landing.footerScripts ?? [],
  };
}

export function serializeLandingForStorage(landing: Landing): Landing {
  const canonicalLanding = { ...normalizeLandingSchema(landing) };

  delete canonicalLanding.opportunityToWork;
  delete canonicalLanding.supportSection;

  if (
    canonicalLanding.delivery?.schedule &&
    canonicalLanding.schedule === canonicalLanding.delivery.schedule
  ) {
    delete canonicalLanding.schedule;
  }

  if (
    canonicalLanding.programUrl &&
    canonicalLanding.sourceWebsite &&
    canonicalLanding.programUrl === canonicalLanding.sourceWebsite
  ) {
    delete canonicalLanding.programUrl;
  }

  if (canonicalLanding.hero) {
    const hero = { ...canonicalLanding.hero };

    if (
      canonicalLanding.tuition?.display &&
      hero.semesterPrice === canonicalLanding.tuition.display
    ) {
      delete hero.semesterPrice;
    }

    if (
      canonicalLanding.tuition?.display &&
      hero.price === canonicalLanding.tuition.display
    ) {
      delete hero.price;
    }

    if (
      canonicalLanding.duration?.display &&
      hero.duration === canonicalLanding.duration.display
    ) {
      delete hero.duration;
    }

    if (
      canonicalLanding.delivery?.modality &&
      hero.modality === canonicalLanding.delivery.modality
    ) {
      delete hero.modality;
    }

    canonicalLanding.hero = hero;
  }

  return canonicalLanding;
}

function normalizeBrand(brand: Brand): Brand {
  return enrichBrandColorPalette({
    ...brand,
    shortName: brand.shortName?.trim() || brand.name,
    favicon: brand.favicon?.trim() || "",
    campuses: (brand.campuses ?? []).map((campus) => ({
      name: campus.name ?? "",
      location: campus.location ?? "",
      description: campus.description ?? "",
      image: campus.image ?? "",
      videoUrl: campus.videoUrl ?? "",
    })),
    certifications: (brand.certifications ?? []).map((certification) => ({
      ...certification,
      logos: {
        light: certification.logos?.light ?? "",
        dark: certification.logos?.dark ?? "",
      },
    })),
  });
}

export function getBrands(): Brand[] {
  const files = fs.readdirSync(brandsDir);

  return files.map((file) => {
    const filePath = path.join(brandsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    return normalizeBrand(JSON.parse(content) as Brand);
  });
}

export function getBrandBySlug(slug: string): Brand | null {
  const filePath = path.join(brandsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");
  return normalizeBrand(JSON.parse(content) as Brand);
}

function readLandingFilesFromFolder(brandFolder: string): Landing[] {
  if (!fs.existsSync(brandFolder)) return [];

  return fs
    .readdirSync(brandFolder)
    .filter((file) => file.endsWith(".json") && file !== programsRegistryFile)
    .map((file) => {
      const filePath = path.join(brandFolder, file);
      const content = fs.readFileSync(filePath, "utf8");
      return normalizeLandingSchema(JSON.parse(content) as Landing);
    });
}

export function getProgramDataByBrand(brandSlug: string): Landing[] {
  return readLandingFilesFromFolder(getProgramDataFolder(brandSlug));
}

export function getEditableLandingsByBrand(brandSlug: string): Landing[] {
  return readLandingFilesFromFolder(getEditableLandingFolder(brandSlug));
}

export function getLandingsByBrand(brandSlug: string): Landing[] {
  const editableLandings = getEditableLandingsByBrand(brandSlug);
  const editableSlugs = new Set(
    editableLandings.map((landing) => landing.slug),
  );
  const legacyProgramLandings = getProgramDataByBrand(brandSlug).filter(
    (landing) => !editableSlugs.has(landing.slug),
  );

  return [...editableLandings, ...legacyProgramLandings];
}

export function getProgramsByBrand(brandSlug: string): Program[] {
  const inferredPrograms = getProgramDataByBrand(brandSlug).map((landing) =>
    landingToProgram(landing),
  );
  const filePath = path.join(programsDir, brandSlug, programsRegistryFile);

  if (!fs.existsSync(filePath)) {
    return inferredPrograms;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const savedPrograms = JSON.parse(content) as Program[];
  const savedProgramIds = new Set(savedPrograms.map((program) => program.id));

  return [
    ...savedPrograms,
    ...inferredPrograms.filter((program) => !savedProgramIds.has(program.id)),
  ];
}

export function getLandingBySlug(
  brandSlug: string,
  landingSlug: string,
): Landing | null {
  const filePath = getEditableLandingPath(brandSlug, landingSlug);

  if (!fs.existsSync(filePath)) {
    return getProgramDataBySlug(brandSlug, landingSlug);
  }

  const content = fs.readFileSync(filePath, "utf8");
  return normalizeLandingSchema(JSON.parse(content) as Landing);
}

export function getProgramDataBySlug(
  brandSlug: string,
  programSlug: string,
): Landing | null {
  const filePath = getProgramDataPath(brandSlug, programSlug);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf8");
  return normalizeLandingSchema(JSON.parse(content) as Landing);
}

function getProgramDataFolder(brandSlug: string) {
  return path.join(programsDir, brandSlug);
}

function getEditableLandingFolder(brandSlug: string) {
  return path.join(legacyLandingsDir, brandSlug);
}

function getProgramDataPath(brandSlug: string, programSlug: string) {
  return path.join(programsDir, brandSlug, `${programSlug}.json`);
}

function getEditableLandingPath(brandSlug: string, landingSlug: string) {
  return path.join(legacyLandingsDir, brandSlug, `${landingSlug}.json`);
}

function landingToProgram(landing: Landing): Program {
  return {
    id: landing.slug,
    programName: landing.fullTitle || landing.title,
    sourceWebsite: landing.sourceWebsite || `/${landing.brand}/${landing.slug}`,
    catalog: landing.catalog || "",
    updatedAt: landing.updatedAt,
  };
}
