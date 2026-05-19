import fs from "node:fs";
import path from "node:path";
import type { VisualAssetImageCategory } from "./visualAssetCategories";

export type BrandAgentCollection = "buyer-person" | "visual-assets";
export type VisualAssetCategory = "brand-assets" | "programs-assets";

export type BuyerPersonRecord = {
  id: string;
  profileName: string;
  profileImage: string;
  description: string;
  stage: string;
  priority: number;
  status: string;
  demographics: {
    ageRange: string;
    gender: string;
    location: string[];
    educationLevel: string;
    employmentStatus: string;
    incomeRange: string;
    familySituation: string;
    languagePreference: string[];
  };
  psychographics: {
    personalityTraits: string[];
    values: string[];
    interests: string[];
  };
  goals: {
    primary: string[];
    secondary: string[];
    successDefinition: string;
  };
  painPoints: string[];
  motivations: string[];
  objections: string[];
  decisionFactors: string[];
  buyerJourney: {
    stage: string;
    awarenessTriggers: string[];
    informationNeeds: string[];
  };
  searchBehavior: {
    keywords: string[];
    commonQuestions: string[];
  };
  emotionalTriggers: string[];
  preferredCommunication: {
    channels: string[];
    preferredContactTime: string[];
    tone: string[];
  };
  messagingRecommendations: {
    keyMessages: string[];
    ctaExamples: string[];
  };
  contentPreferences: {
    formats: string[];
  };
  scoring: {
    conversionLikelihood: number;
    urgency: string;
    salesReadiness: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    source: string;
    tags: string[];
  };
};

export type VisualAssetRecord = {
  id: string;
  category: VisualAssetCategory;
  assetCategory?: VisualAssetImageCategory | string;
  programId?: string;
  programName?: string;
  name: string;
  assetType: string;
  url: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type BrandAgentRecord = BuyerPersonRecord | VisualAssetRecord;

export const brandAgentCollectionLabels: Record<
  BrandAgentCollection,
  {
    singular: string;
    plural: string;
    folder: string;
  }
> = {
  "buyer-person": {
    singular: "Buyer Person",
    plural: "Buyer Persons",
    folder: "buyer-person",
  },
  "visual-assets": {
    singular: "Visual Asset",
    plural: "Visual Assets",
    folder: "visual-assets",
  },
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const buyerPersonDir = path.join(process.cwd(), "data", "buyer-person");
const visualAssetsDir = path.join(process.cwd(), "data", "visual-assets");
export const visualAssetCategories: Array<{
  slug: VisualAssetCategory;
  title: string;
  description: string;
}> = [
  {
    slug: "brand-assets",
    title: "Brand Assets",
    description:
      "Logos, imagenes institucionales, manuales y recursos visuales base de la marca.",
  },
  {
    slug: "programs-assets",
    title: "Programs Assets",
    description:
      "Imagenes, videos y recursos visuales asociados a programas academicos.",
  },
];

export function isBrandAgentCollection(
  value: string,
): value is BrandAgentCollection {
  return value === "buyer-person" || value === "visual-assets";
}

export function isSafeBrandAgentSlug(value: string) {
  return slugPattern.test(value);
}

export function isVisualAssetCategory(
  value: string,
): value is VisualAssetCategory {
  return value === "brand-assets" || value === "programs-assets";
}

export function getVisualAssetsByCategory(
  brandSlug: string,
  category: VisualAssetCategory,
) {
  return getBrandAgentRecords(brandSlug, "visual-assets").filter(
    (record): record is VisualAssetRecord =>
      "category" in record && record.category === category,
  );
}

export function getBrandAgentRecords(
  brandSlug: string,
  collection: BrandAgentCollection,
): BrandAgentRecord[] {
  const folderPath = getBrandAgentFolderPath(brandSlug, collection);

  if (!folderPath || !fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = fs.readFileSync(path.join(folderPath, file), "utf8");
      return normalizeStoredBrandAgentRecord(
        collection,
        JSON.parse(content) as BrandAgentRecord,
      );
    })
    .filter((record): record is BrandAgentRecord => Boolean(record))
    .sort((a, b) => getRecordUpdatedAt(b).localeCompare(getRecordUpdatedAt(a)));
}

export function getBrandAgentRecord(
  brandSlug: string,
  collection: BrandAgentCollection,
  recordId: string,
) {
  const filePath = getBrandAgentRecordPath(brandSlug, collection, recordId);

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  return normalizeStoredBrandAgentRecord(
    collection,
    JSON.parse(content) as BrandAgentRecord,
  );
}

export function createBrandAgentRecord(
  brandSlug: string,
  collection: BrandAgentCollection,
  value: unknown,
) {
  const folderPath = getBrandAgentFolderPath(brandSlug, collection);

  if (!folderPath) {
    return null;
  }

  const record = normalizeBrandAgentRecord(collection, value);

  if (!record) {
    return null;
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (collection === "buyer-person") {
    let nextId = record.id;
    let filePath = path.join(folderPath, `${nextId}.json`);

    if (fs.existsSync(filePath)) {
      nextId = `${nextId}-${Date.now().toString(36)}`;
      record.id = nextId;
      filePath = path.join(folderPath, `${nextId}.json`);
    }

    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");

    return record;
  }

  const filePath = path.join(folderPath, `${record.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");

  return record;
}

export function updateBrandAgentRecord(
  brandSlug: string,
  collection: BrandAgentCollection,
  recordId: string,
  value: unknown,
) {
  const filePath = getBrandAgentRecordPath(brandSlug, collection, recordId);

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  const current = normalizeStoredBrandAgentRecord(
    collection,
    JSON.parse(fs.readFileSync(filePath, "utf8")) as BrandAgentRecord,
  );

  if (!current) {
    return null;
  }

  const record = normalizeBrandAgentRecord(collection, value, current);

  if (!record) {
    return null;
  }

  fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");

  return record;
}

export function deleteBrandAgentRecord(
  brandSlug: string,
  collection: BrandAgentCollection,
  recordId: string,
) {
  const filePath = getBrandAgentRecordPath(brandSlug, collection, recordId);

  if (!filePath || !fs.existsSync(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);

  return true;
}

function getBrandAgentRecordPath(
  brandSlug: string,
  collection: BrandAgentCollection,
  recordId: string,
) {
  const folderPath = getBrandAgentFolderPath(brandSlug, collection);

  if (!folderPath || !isSafeBrandAgentSlug(recordId)) {
    return null;
  }

  const filePath = path.resolve(folderPath, `${recordId}.json`);
  const relativePath = path.relative(folderPath, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function getBrandAgentFolderPath(
  brandSlug: string,
  collection: BrandAgentCollection,
) {
  if (!isSafeBrandAgentSlug(brandSlug)) {
    return null;
  }

  const baseDir =
    collection === "buyer-person" ? buyerPersonDir : visualAssetsDir;
  const folderPath = path.resolve(baseDir, brandSlug);
  const relativePath = path.relative(baseDir, folderPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return folderPath;
}

function normalizeBrandAgentRecord(
  collection: BrandAgentCollection,
  value: unknown,
  current?: BuyerPersonRecord | VisualAssetRecord,
) {
  if (!isRecord(value)) {
    return null;
  }

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const createdAt = getRecordCreatedAt(current) || today;
  const id = current?.id;

  if (collection === "buyer-person") {
    const profileName = toText(value.profileName) || toText(value.name);
    const description = toText(value.description);
    const stage = toText(value.stage);

    if (!profileName) {
      return null;
    }

    return {
      id: id ?? toPlainRecordId(profileName),
      profileName,
      profileImage: toText(value.profileImage),
      description,
      stage,
      priority: toNumber(value.priority, 1),
      status: toText(value.status) || "active",
      demographics: {
        ageRange: toText(getNestedValue(value, "demographics", "ageRange")),
        gender: toText(getNestedValue(value, "demographics", "gender")),
        location: toStringArray(
          getNestedValue(value, "demographics", "location"),
        ),
        educationLevel: toText(
          getNestedValue(value, "demographics", "educationLevel"),
        ),
        employmentStatus: toText(
          getNestedValue(value, "demographics", "employmentStatus"),
        ),
        incomeRange: toText(
          getNestedValue(value, "demographics", "incomeRange"),
        ),
        familySituation: toText(
          getNestedValue(value, "demographics", "familySituation"),
        ),
        languagePreference: toStringArray(
          getNestedValue(value, "demographics", "languagePreference"),
        ),
      },
      psychographics: {
        personalityTraits: toStringArray(
          getNestedValue(value, "psychographics", "personalityTraits"),
        ),
        values: toStringArray(getNestedValue(value, "psychographics", "values")),
        interests: toStringArray(
          getNestedValue(value, "psychographics", "interests"),
        ),
      },
      goals: {
        primary: toStringArray(getNestedValue(value, "goals", "primary")),
        secondary: toStringArray(getNestedValue(value, "goals", "secondary")),
        successDefinition: toText(
          getNestedValue(value, "goals", "successDefinition"),
        ),
      },
      painPoints: toStringArray(value.painPoints),
      motivations: toStringArray(value.motivations),
      objections: toStringArray(value.objections),
      decisionFactors: toStringArray(value.decisionFactors),
      buyerJourney: {
        stage: toText(getNestedValue(value, "buyerJourney", "stage")) || stage,
        awarenessTriggers: toStringArray(
          getNestedValue(value, "buyerJourney", "awarenessTriggers"),
        ),
        informationNeeds: toStringArray(
          getNestedValue(value, "buyerJourney", "informationNeeds"),
        ),
      },
      searchBehavior: {
        keywords: toStringArray(
          getNestedValue(value, "searchBehavior", "keywords"),
        ),
        commonQuestions: toStringArray(
          getNestedValue(value, "searchBehavior", "commonQuestions"),
        ),
      },
      emotionalTriggers: toStringArray(value.emotionalTriggers),
      preferredCommunication: {
        channels: toStringArray(
          getNestedValue(value, "preferredCommunication", "channels"),
        ),
        preferredContactTime: toStringArray(
          getNestedValue(value, "preferredCommunication", "preferredContactTime"),
        ),
        tone: toStringArray(getNestedValue(value, "preferredCommunication", "tone")),
      },
      messagingRecommendations: {
        keyMessages: toStringArray(
          getNestedValue(value, "messagingRecommendations", "keyMessages"),
        ),
        ctaExamples: toStringArray(
          getNestedValue(value, "messagingRecommendations", "ctaExamples"),
        ),
      },
      contentPreferences: {
        formats: toStringArray(
          getNestedValue(value, "contentPreferences", "formats"),
        ),
      },
      scoring: {
        conversionLikelihood: toNumber(
          getNestedValue(value, "scoring", "conversionLikelihood"),
          0,
        ),
        urgency: toText(getNestedValue(value, "scoring", "urgency")),
        salesReadiness: toText(getNestedValue(value, "scoring", "salesReadiness")),
      },
      metadata: {
        createdAt,
        updatedAt: today,
        source:
          toText(getNestedValue(value, "metadata", "source")) ||
          toText((current as BuyerPersonRecord | undefined)?.metadata?.source) ||
          "Manual",
        tags: toStringArray(getNestedValue(value, "metadata", "tags")),
      },
    } satisfies BuyerPersonRecord;
  }

  const name = toText(value.name);
  const categoryValue =
    toText(value.category) ||
    ((current && "category" in current && current.category) || "");
  const category = isVisualAssetCategory(categoryValue)
    ? categoryValue
    : "brand-assets";
  const programId = toText(value.programId);
  const programName = toText(value.programName);
  const assetCategory = toText(value.assetCategory);
  const assetType = toText(value.assetType);
  const url = toText(value.url);
  const notes = toText(value.notes);

  if (!name) {
    return null;
  }

  return {
    id: id ?? toRecordId(name),
    category,
    assetCategory,
    programId,
    programName,
    name,
    assetType,
    url,
    notes,
    createdAt,
    updatedAt: now,
  } satisfies VisualAssetRecord;
}

function normalizeStoredBrandAgentRecord(
  collection: BrandAgentCollection,
  value: BrandAgentRecord,
) {
  if (collection !== "buyer-person") {
    return value;
  }

  return normalizeBrandAgentRecord(collection, value, value as BuyerPersonRecord);
}

function getRecordCreatedAt(record?: BrandAgentRecord | null) {
  if (!record) return "";
  if ("metadata" in record) return record.metadata?.createdAt || "";
  if ("createdAt" in record) return record.createdAt?.slice(0, 10) || "";
  return "";
}

function getRecordUpdatedAt(record: BrandAgentRecord) {
  if ("metadata" in record) return record.metadata?.updatedAt || "";
  if ("updatedAt" in record) return record.updatedAt || "";
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  const text = toText(value);

  if (!text) {
    return [];
  }

  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: unknown, fallback: number) {
  const numberValue =
    typeof value === "number" ? value : Number.parseInt(toText(value), 10);

  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getNestedValue(
  value: unknown,
  parentKey: string,
  childKey: string,
) {
  if (!isRecord(value)) {
    return "";
  }

  const parent = value[parentKey];

  if (!isRecord(parent)) {
    return "";
  }

  return parent[childKey];
}

function toPlainRecordId(value: string) {
  return toRecordId(value).replace(/-[a-z0-9]+$/i, "");
}

function toRecordId(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return `${slug || "record"}-${Date.now().toString(36)}`;
}
