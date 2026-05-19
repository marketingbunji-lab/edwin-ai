"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, ImageIcon, Save, Users } from "lucide-react";
import type { Brand } from "@/lib/data";
import type {
  BrandAgentCollection,
  BrandAgentRecord,
  BuyerPersonRecord,
  VisualAssetCategory,
  VisualAssetRecord,
} from "@/lib/brandAgentRecords";
import {
  getVisualAssetImageCategories,
  getVisualAssetImageCategoryLabel,
  type VisualAssetImageCategory,
} from "@/lib/visualAssetCategories";
import { getRandomEdwinAssistantMessage } from "@/lib/edwinAssistantMessages";

type Props = {
  brand: Brand;
  collection: BrandAgentCollection;
  initialRecord?: BrandAgentRecord;
  mode?: "create" | "edit";
  showPreview?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  visualAssetCategory?: VisualAssetCategory;
  visualAssetProgramId?: string;
  visualAssetProgramName?: string;
  visualAssetProgramData?: unknown;
  buyerPersonRecords?: BuyerPersonRecord[];
};

type FormState = {
  profileName: string;
  profileImage: string;
  description: string;
  stage: string;
  priority: string;
  status: string;
  ageRange: string;
  gender: string;
  location: string;
  educationLevel: string;
  employmentStatus: string;
  incomeRange: string;
  familySituation: string;
  languagePreference: string;
  personalityTraits: string;
  values: string;
  interests: string;
  primaryGoals: string;
  secondaryGoals: string;
  successDefinition: string;
  painPoints: string;
  motivations: string;
  objections: string;
  decisionFactors: string;
  buyerJourneyStage: string;
  awarenessTriggers: string;
  informationNeeds: string;
  keywords: string;
  commonQuestions: string;
  emotionalTriggers: string;
  channels: string;
  preferredContactTime: string;
  tone: string;
  keyMessages: string;
  ctaExamples: string;
  contentFormats: string;
  conversionLikelihood: string;
  urgency: string;
  salesReadiness: string;
  source: string;
  tags: string;
  assetName: string;
  assetCategory: VisualAssetImageCategory | "";
  assetType: string;
  url: string;
  notes: string;
  category: VisualAssetCategory;
  programId: string;
  programName: string;
};

const initialState: FormState = {
  profileName: "",
  profileImage: "",
  description: "",
  stage: "",
  priority: "1",
  status: "active",
  ageRange: "",
  gender: "",
  location: "",
  educationLevel: "",
  employmentStatus: "",
  incomeRange: "",
  familySituation: "",
  languagePreference: "",
  personalityTraits: "",
  values: "",
  interests: "",
  primaryGoals: "",
  secondaryGoals: "",
  successDefinition: "",
  painPoints: "",
  motivations: "",
  objections: "",
  decisionFactors: "",
  buyerJourneyStage: "",
  awarenessTriggers: "",
  informationNeeds: "",
  keywords: "",
  commonQuestions: "",
  emotionalTriggers: "",
  channels: "",
  preferredContactTime: "",
  tone: "",
  keyMessages: "",
  ctaExamples: "",
  contentFormats: "",
  conversionLikelihood: "",
  urgency: "",
  salesReadiness: "",
  source: "Manual",
  tags: "",
  assetName: "",
  assetCategory: "lifestyleImages",
  assetType: "",
  url: "",
  notes: "",
  category: "brand-assets",
  programId: "",
  programName: "",
};

function linesToArray(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value?: string[]) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function formStateFromRecord(record?: BrandAgentRecord): FormState {
  if (!record) {
    return initialState;
  }

  if ("profileName" in record) {
    return {
      ...initialState,
      profileName: record.profileName,
      profileImage: record.profileImage || "",
      description: record.description,
      stage: record.stage,
      priority: String(record.priority ?? 1),
      status: record.status,
      ageRange: record.demographics.ageRange,
      gender: record.demographics.gender,
      location: arrayToLines(record.demographics.location),
      educationLevel: record.demographics.educationLevel,
      employmentStatus: record.demographics.employmentStatus,
      incomeRange: record.demographics.incomeRange,
      familySituation: record.demographics.familySituation,
      languagePreference: arrayToLines(record.demographics.languagePreference),
      personalityTraits: arrayToLines(record.psychographics.personalityTraits),
      values: arrayToLines(record.psychographics.values),
      interests: arrayToLines(record.psychographics.interests),
      primaryGoals: arrayToLines(record.goals.primary),
      secondaryGoals: arrayToLines(record.goals.secondary),
      successDefinition: record.goals.successDefinition,
      painPoints: arrayToLines(record.painPoints),
      motivations: arrayToLines(record.motivations),
      objections: arrayToLines(record.objections),
      decisionFactors: arrayToLines(record.decisionFactors),
      buyerJourneyStage: record.buyerJourney.stage,
      awarenessTriggers: arrayToLines(record.buyerJourney.awarenessTriggers),
      informationNeeds: arrayToLines(record.buyerJourney.informationNeeds),
      keywords: arrayToLines(record.searchBehavior.keywords),
      commonQuestions: arrayToLines(record.searchBehavior.commonQuestions),
      emotionalTriggers: arrayToLines(record.emotionalTriggers),
      channels: arrayToLines(record.preferredCommunication.channels),
      preferredContactTime: arrayToLines(
        record.preferredCommunication.preferredContactTime,
      ),
      tone: arrayToLines(record.preferredCommunication.tone),
      keyMessages: arrayToLines(record.messagingRecommendations.keyMessages),
      ctaExamples: arrayToLines(record.messagingRecommendations.ctaExamples),
      contentFormats: arrayToLines(record.contentPreferences.formats),
      conversionLikelihood: String(
        record.scoring.conversionLikelihood || "",
      ),
      urgency: record.scoring.urgency,
      salesReadiness: record.scoring.salesReadiness,
      source: record.metadata.source || "Manual",
      tags: arrayToLines(record.metadata.tags),
    };
  }

  if ("motivations" in record) {
    const legacyRecord = record as unknown as {
      name?: string;
      stage?: string;
      motivations?: string;
    };

    return {
      ...initialState,
      profileName: legacyRecord.name ?? "",
      stage: legacyRecord.stage ?? "",
      motivations: legacyRecord.motivations ?? "",
    };
  }

  return {
    ...initialState,
    category: record.category || "brand-assets",
    assetCategory:
      "assetCategory" in record
        ? (record.assetCategory as VisualAssetImageCategory | "")
        : "lifestyleImages",
    programId: record.programId || "",
    programName: record.programName || "",
    assetName: record.name,
    assetType: record.assetType,
    url: record.url,
    notes: record.notes,
  };
}

function buyerPersonFromForm(
  form: FormState,
  initialRecord?: BrandAgentRecord,
) {
  const current =
    initialRecord && "profileName" in initialRecord ? initialRecord : null;
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: current?.id ?? "",
    profileName: form.profileName,
    profileImage: form.profileImage,
    description: form.description,
    stage: form.stage,
    priority: Number.parseInt(form.priority, 10) || 1,
    status: form.status || "active",
    demographics: {
      ageRange: form.ageRange,
      gender: form.gender,
      location: linesToArray(form.location),
      educationLevel: form.educationLevel,
      employmentStatus: form.employmentStatus,
      incomeRange: form.incomeRange,
      familySituation: form.familySituation,
      languagePreference: linesToArray(form.languagePreference),
    },
    psychographics: {
      personalityTraits: linesToArray(form.personalityTraits),
      values: linesToArray(form.values),
      interests: linesToArray(form.interests),
    },
    goals: {
      primary: linesToArray(form.primaryGoals),
      secondary: linesToArray(form.secondaryGoals),
      successDefinition: form.successDefinition,
    },
    painPoints: linesToArray(form.painPoints),
    motivations: linesToArray(form.motivations),
    objections: linesToArray(form.objections),
    decisionFactors: linesToArray(form.decisionFactors),
    buyerJourney: {
      stage: form.buyerJourneyStage || form.stage,
      awarenessTriggers: linesToArray(form.awarenessTriggers),
      informationNeeds: linesToArray(form.informationNeeds),
    },
    searchBehavior: {
      keywords: linesToArray(form.keywords),
      commonQuestions: linesToArray(form.commonQuestions),
    },
    emotionalTriggers: linesToArray(form.emotionalTriggers),
    preferredCommunication: {
      channels: linesToArray(form.channels),
      preferredContactTime: linesToArray(form.preferredContactTime),
      tone: linesToArray(form.tone),
    },
    messagingRecommendations: {
      keyMessages: linesToArray(form.keyMessages),
      ctaExamples: linesToArray(form.ctaExamples),
    },
    contentPreferences: {
      formats: linesToArray(form.contentFormats),
    },
    scoring: {
      conversionLikelihood:
        Number.parseInt(form.conversionLikelihood, 10) || 0,
      urgency: form.urgency,
      salesReadiness: form.salesReadiness,
    },
    metadata: {
      createdAt: current?.metadata.createdAt || today,
      updatedAt: today,
      source: form.source || "Manual",
      tags: linesToArray(form.tags),
    },
  } satisfies BuyerPersonRecord;
}

function visualAssetFromForm(
  form: FormState,
  initialRecord?: BrandAgentRecord,
) {
  return {
    id: initialRecord?.id ?? "preview",
    category: form.category,
    assetCategory: form.assetCategory,
    programId: form.programId,
    programName: form.programName,
    name: form.assetName,
    assetType: form.assetType,
    url: form.url,
    notes: form.notes,
    createdAt: "createdAt" in (initialRecord ?? {})
      ? (initialRecord as VisualAssetRecord).createdAt
      : "",
    updatedAt: "updatedAt" in (initialRecord ?? {})
      ? (initialRecord as VisualAssetRecord).updatedAt
      : "",
  } satisfies VisualAssetRecord;
}

function visualAssetFormPayload(form: FormState) {
  return {
    category: form.category,
    assetCategory: form.assetCategory,
    programId: form.programId,
    programName: form.programName,
    name: form.assetName,
    assetType: form.assetType,
    url: form.url,
    notes: form.notes,
  };
}

function extractBuyerPersonaFromResponse(value: unknown) {
  const payload = Array.isArray(value) ? value[0] : value;

  if (!isRecord(payload)) {
    return null;
  }

  const directBuyerPersona =
    payload.buyerPersona ?? payload.record ?? payload.output ?? payload.data;
  const parsedBuyerPersona =
    typeof directBuyerPersona === "string"
      ? safeJsonParse(directBuyerPersona)
      : directBuyerPersona;

  if (isBuyerPersonRecordLike(parsedBuyerPersona)) {
    return parsedBuyerPersona;
  }

  if (isBuyerPersonRecordLike(payload)) {
    return payload;
  }

  return null;
}

function extractVisualAssetFromResponse(value: unknown) {
  const payload = Array.isArray(value) ? value[0] : value;

  if (!isRecord(payload)) {
    return null;
  }

  const directVisualAsset =
    payload.visualAsset ?? payload.asset ?? payload.record ?? payload.data;
  const parsedVisualAsset =
    typeof directVisualAsset === "string"
      ? safeJsonParse(directVisualAsset)
      : directVisualAsset;

  if (isVisualAssetRecordLike(parsedVisualAsset)) {
    return parsedVisualAsset;
  }

  if (isVisualAssetRecordLike(payload)) {
    return payload;
  }

  return null;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isBuyerPersonRecordLike(value: unknown): value is BuyerPersonRecord {
  return (
    isRecord(value) &&
    typeof value.profileName === "string" &&
    isRecord(value.demographics) &&
    isRecord(value.psychographics) &&
    isRecord(value.goals) &&
    Array.isArray(value.motivations) &&
    isRecord(value.metadata)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isVisualAssetRecordLike(value: unknown): value is Partial<VisualAssetRecord> {
  return (
    isRecord(value) &&
    (typeof value.name === "string" || typeof value.assetName === "string") &&
    (typeof value.url === "string" || typeof value.imageUrl === "string")
  );
}

export default function BrandAgentRecordForm({
  brand,
  collection,
  initialRecord,
  mode = "create",
  showPreview = false,
  eyebrow,
  title,
  description,
  visualAssetCategory = "brand-assets",
  visualAssetProgramId = "",
  visualAssetProgramName = "",
  visualAssetProgramData = null,
  buyerPersonRecords = [],
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    initialRecord
        ? formStateFromRecord(initialRecord)
      : {
          ...initialState,
          category: visualAssetCategory,
          programId: visualAssetProgramId,
          programName: visualAssetProgramName,
        },
  );
  const [previewRecord, setPreviewRecord] = useState<BrandAgentRecord | null>(
    initialRecord ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [assistantLoadingMessage, setAssistantLoadingMessage] = useState(
    () => getRandomEdwinAssistantMessage("loading"),
  );
  const [message, setMessage] = useState("");

  const isBuyerPerson = collection === "buyer-person";
  const isVisualAsset = collection === "visual-assets";
  const isEditMode = mode === "edit";

  const generateWithAi = async () => {
    try {
      if (!isBuyerPerson && !isVisualAsset) {
        setMessage("Este agente AI todavia no esta conectado.");
        return;
      }

      setGenerating(true);
      setAssistantLoadingMessage(getRandomEdwinAssistantMessage("loading"));
      setMessage(
        isBuyerPerson
          ? "Generando buyer persona con AI..."
          : "Generando visual asset con AI...",
      );

      const response = await fetch(
        isBuyerPerson
          ? "https://n8n.crisnnino.com/webhook/edwin-agent-test"
          : form.category === "programs-assets"
            ? "/api/program-assets-ai"
            : "/api/visual-assets-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isBuyerPerson
              ? {
                  task: "generate-buyer-persona",
                  agent: "edwin-agent-test",
                  brand,
                  requestedOutput: "buyer-person-v1",
                }
              : {
                  task: "generate-brand-visual-asset",
                  agent: "edwin-brand-assets-agent",
                  brand,
                  buyerPersonRecords,
                  program: visualAssetProgramData,
                  programId: form.programId,
                  programName: form.programName,
                  assetCategory: form.assetCategory,
                  assetCategoryLabel:
                    getVisualAssetImageCategoryLabel(
                      form.category,
                      form.assetCategory,
                    ),
                  availableAssetCategories: getVisualAssetImageCategories(
                    form.category,
                  ),
                  currentDraft: visualAssetFromForm(form, initialRecord),
                  requestedOutput: "brand-visual-asset-v1",
                },
          ),
        },
      );
      const data = await response.json();

      console.log(
        isBuyerPerson
          ? "edwin-agent-test response"
          : "edwin-brand-assets-agent response",
        data,
      );

      if (isBuyerPerson) {
        const buyerPersona = extractBuyerPersonaFromResponse(data);

        if (!response.ok || !buyerPersona) {
          throw new Error(
            data?.error ||
              "El agente no devolvio un buyer persona con el formato esperado",
          );
        }

        setForm(formStateFromRecord(buyerPersona));
        setPreviewRecord(buyerPersona);
        setMessage("Buyer persona generado. Revisa los campos y guarda.");
        return;
      }

      const visualAsset = extractVisualAssetFromResponse(data);

      if (!response.ok || !visualAsset) {
        throw new Error(
          data?.error ||
            "El agente no devolvio un visual asset con el formato esperado",
        );
      }

      const nextRecord = {
        id: initialRecord?.id ?? "preview",
        category: form.category,
        programId: form.programId,
        programName: form.programName,
        assetCategory:
          (visualAsset.assetCategory as VisualAssetImageCategory | undefined) ||
          form.assetCategory,
        name:
          visualAsset.name ||
          (visualAsset as Record<string, unknown>).assetName?.toString() ||
          form.assetName,
        assetType: visualAsset.assetType || "Image",
        url:
          visualAsset.url ||
          (visualAsset as Record<string, unknown>).imageUrl?.toString() ||
          "",
        notes: visualAsset.notes || "",
        createdAt: "createdAt" in (initialRecord ?? {})
          ? (initialRecord as VisualAssetRecord).createdAt
          : "",
        updatedAt: "updatedAt" in (initialRecord ?? {})
          ? (initialRecord as VisualAssetRecord).updatedAt
          : "",
      } satisfies VisualAssetRecord;

      setForm(formStateFromRecord(nextRecord));
      setPreviewRecord(nextRecord);
      setMessage("Visual asset generado. Revisa los campos y guarda.");
    } catch (error) {
      console.log(
        isBuyerPerson ? "edwin-agent-test error" : "edwin-brand-assets-agent error",
        error,
      );
      setMessage(
        error instanceof Error
          ? error.message
          : isBuyerPerson
            ? "No se pudo generar el buyer persona"
            : "No se pudo generar el visual asset",
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => {
      const nextForm = {
        ...current,
        [field]: value,
      };

      setPreviewRecord(
        isBuyerPerson
          ? buyerPersonFromForm(nextForm, initialRecord)
        : visualAssetFromForm(nextForm, initialRecord),
      );

      return nextForm;
    });
  };

  const saveRecord = async () => {
    try {
      setSaving(true);
      setMessage("");

      const record = isBuyerPerson
        ? buyerPersonFromForm(form, initialRecord)
          : visualAssetFormPayload(form);

      const response = await fetch(
        isEditMode && initialRecord
          ? `/api/brand-agent-records/${brand.slug}/${collection}/${initialRecord.id}`
          : `/api/brand-agent-records/${brand.slug}/${collection}`,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ record }),
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        record?: BrandAgentRecord;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo guardar la informacion");
      }

      if (data.record) {
        setPreviewRecord(data.record);
        setForm(formStateFromRecord(data.record));
      }

      setMessage(
        isEditMode
          ? "Buyer person actualizado correctamente"
          : "Informacion guardada correctamente",
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la informacion",
      );
    } finally {
      setSaving(false);
    }
  };

  const formContent = (
    <>
      {isBuyerPerson ? (
        <BuyerPersonFields form={form} updateField={updateField} />
      ) : (
        <VisualAssetFields form={form} updateField={updateField} />
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generateWithAi}
          disabled={generating}
          className="admin-button-primary px-5"
        >
          <Bot className="h-4 w-4" />
          {generating ? "Generando..." : "Generar con AI"}
        </button>

        <button
          type="button"
          onClick={saveRecord}
          disabled={saving}
          className="admin-button-dark px-5"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : isEditMode ? "Guardar cambios" : "Guardar"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </>
  );

  if (!showPreview) {
    return formContent;
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <div className="admin-panel p-6">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        ) : null}

        {formContent}
      </div>

      <PreviewCard
        collection={collection}
        record={previewRecord}
        isGenerating={generating}
        loadingMessage={assistantLoadingMessage}
      />
    </section>
  );
}

function BuyerPersonFields({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="mt-8 space-y-8">
      <FieldGroup title="Informacion base">
        <Field label="Profile name *" value={form.profileName} placeholder="Working Adult Career Changer" onChange={(value) => updateField("profileName", value)} />
        <Field label="Profile image" value={form.profileImage} placeholder="Generated image URL or data URL" onChange={(value) => updateField("profileImage", value)} />
        <Field label="Stage" value={form.stage} placeholder="Consideration" onChange={(value) => updateField("stage", value)} />
        <Field label="Priority" value={form.priority} placeholder="1" onChange={(value) => updateField("priority", value)} />
        <Field label="Status" value={form.status} placeholder="active" onChange={(value) => updateField("status", value)} />
        <TextArea label="Description" value={form.description} placeholder="Adults who are employed full-time and want to transition..." onChange={(value) => updateField("description", value)} />
      </FieldGroup>

      <FieldGroup title="Demographics">
        <Field label="Age range" value={form.ageRange} placeholder="25-45" onChange={(value) => updateField("ageRange", value)} />
        <Field label="Gender" value={form.gender} placeholder="Any" onChange={(value) => updateField("gender", value)} />
        <Field label="Education level" value={form.educationLevel} placeholder="High School Diploma or GED" onChange={(value) => updateField("educationLevel", value)} />
        <Field label="Employment status" value={form.employmentStatus} placeholder="Employed Full-Time" onChange={(value) => updateField("employmentStatus", value)} />
        <Field label="Income range" value={form.incomeRange} placeholder="$30,000-$60,000" onChange={(value) => updateField("incomeRange", value)} />
        <Field label="Family situation" value={form.familySituation} placeholder="May have children or dependents" onChange={(value) => updateField("familySituation", value)} />
        <TextArea label="Location" value={form.location} placeholder="Texas" onChange={(value) => updateField("location", value)} />
        <TextArea label="Language preference" value={form.languagePreference} placeholder={"English\nSpanish"} onChange={(value) => updateField("languagePreference", value)} />
      </FieldGroup>

      <FieldGroup title="Psychographics">
        <TextArea label="Personality traits" value={form.personalityTraits} placeholder={"Responsible\nGoal-oriented"} onChange={(value) => updateField("personalityTraits", value)} />
        <TextArea label="Values" value={form.values} placeholder={"Financial stability\nFamily security"} onChange={(value) => updateField("values", value)} />
        <TextArea label="Interests" value={form.interests} placeholder={"Healthcare careers\nFlexible education"} onChange={(value) => updateField("interests", value)} />
      </FieldGroup>

      <FieldGroup title="Goals and decision drivers">
        <TextArea label="Primary goals" value={form.primaryGoals} placeholder="Start a stable career in healthcare" onChange={(value) => updateField("primaryGoals", value)} />
        <TextArea label="Secondary goals" value={form.secondaryGoals} placeholder="Set a positive example for family" onChange={(value) => updateField("secondaryGoals", value)} />
        <TextArea label="Success definition" value={form.successDefinition} placeholder="Graduate from the program and secure a healthcare job..." onChange={(value) => updateField("successDefinition", value)} />
        <TextArea label="Pain points" value={form.painPoints} placeholder="Limited time due to work and family responsibilities" onChange={(value) => updateField("painPoints", value)} />
        <TextArea label="Motivations" value={form.motivations} placeholder="Better career opportunities" onChange={(value) => updateField("motivations", value)} />
        <TextArea label="Objections" value={form.objections} placeholder="The program may be too expensive" onChange={(value) => updateField("objections", value)} />
        <TextArea label="Decision factors" value={form.decisionFactors} placeholder="Affordable tuition" onChange={(value) => updateField("decisionFactors", value)} />
      </FieldGroup>

      <FieldGroup title="Buyer journey and search behavior">
        <Field label="Buyer journey stage" value={form.buyerJourneyStage} placeholder="Consideration" onChange={(value) => updateField("buyerJourneyStage", value)} />
        <TextArea label="Awareness triggers" value={form.awarenessTriggers} placeholder="Dissatisfaction with current job" onChange={(value) => updateField("awarenessTriggers", value)} />
        <TextArea label="Information needs" value={form.informationNeeds} placeholder="Program cost" onChange={(value) => updateField("informationNeeds", value)} />
        <TextArea label="Search keywords" value={form.keywords} placeholder="medical assistant program near me" onChange={(value) => updateField("keywords", value)} />
        <TextArea label="Common questions" value={form.commonQuestions} placeholder="How long does the program take?" onChange={(value) => updateField("commonQuestions", value)} />
        <TextArea label="Emotional triggers" value={form.emotionalTriggers} placeholder="Providing a better future for my family" onChange={(value) => updateField("emotionalTriggers", value)} />
      </FieldGroup>

      <FieldGroup title="Communication and messaging">
        <TextArea label="Channels" value={form.channels} placeholder={"SMS\nPhone\nEmail"} onChange={(value) => updateField("channels", value)} />
        <TextArea label="Preferred contact time" value={form.preferredContactTime} placeholder={"Evenings\nWeekends"} onChange={(value) => updateField("preferredContactTime", value)} />
        <TextArea label="Tone" value={form.tone} placeholder={"Supportive\nClear"} onChange={(value) => updateField("tone", value)} />
        <TextArea label="Key messages" value={form.keyMessages} placeholder="Train for a healthcare career in a short period of time." onChange={(value) => updateField("keyMessages", value)} />
        <TextArea label="CTA examples" value={form.ctaExamples} placeholder="Request Information" onChange={(value) => updateField("ctaExamples", value)} />
        <TextArea label="Content formats" value={form.contentFormats} placeholder="Success stories" onChange={(value) => updateField("contentFormats", value)} />
      </FieldGroup>

      <FieldGroup title="Scoring and metadata">
        <Field label="Conversion likelihood" value={form.conversionLikelihood} placeholder="85" onChange={(value) => updateField("conversionLikelihood", value)} />
        <Field label="Urgency" value={form.urgency} placeholder="High" onChange={(value) => updateField("urgency", value)} />
        <Field label="Sales readiness" value={form.salesReadiness} placeholder="Warm" onChange={(value) => updateField("salesReadiness", value)} />
        <Field label="Source" value={form.source} placeholder="Manual" onChange={(value) => updateField("source", value)} />
        <TextArea label="Tags" value={form.tags} placeholder={"healthcare\ncareer change"} onChange={(value) => updateField("tags", value)} />
      </FieldGroup>
    </div>
  );
}

function VisualAssetFields({
  form,
  updateField,
}: {
  form: FormState;
  updateField: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      <Field label="Nombre del recurso *" value={form.assetName} placeholder="Ej. Hero campus principal" onChange={(value) => updateField("assetName", value)} />
      <input type="hidden" value={form.category} readOnly />
      <input type="hidden" value={form.programId} readOnly />
      <input type="hidden" value={form.programName} readOnly />
      {form.category === "programs-assets" && form.programName ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Programa
          </p>
          <p className="mt-1 font-semibold">{form.programName}</p>
        </div>
      ) : null}
      {form.category === "brand-assets" || form.category === "programs-assets" ? (
        <SelectField
          label="Categoria del asset"
          value={form.assetCategory}
          onChange={(value) =>
            updateField("assetCategory", value as VisualAssetImageCategory)
          }
          options={getVisualAssetImageCategories(form.category).map((item) => ({
            value: item.value,
            label: item.label,
          }))}
        />
      ) : null}
      <Field label="Tipo de recurso" value={form.assetType} placeholder="Ej. Imagen, logo, video" onChange={(value) => updateField("assetType", value)} />
      <Field label="URL del recurso" value={form.url} placeholder="https://..." onChange={(value) => updateField("url", value)} className="md:col-span-2" />
      <TextArea label="Notas de uso" value={form.notes} placeholder="Contexto, restricciones o recomendaciones para usar este recurso." onChange={(value) => updateField("notes", value)} />
    </div>
  );
}

function PreviewCard({
  collection,
  record,
  isGenerating,
  loadingMessage,
}: {
  collection: BrandAgentCollection;
  record: BrandAgentRecord | null;
  isGenerating: boolean;
  loadingMessage: string;
}) {
  const isBuyerPerson = collection === "buyer-person";
  const Icon = isBuyerPerson ? Users : ImageIcon;

  return (
    <aside className="admin-panel relative overflow-hidden p-6">
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
        Preview
      </p>

      {isBuyerPerson ? (
        <BuyerPersonPreview record={record as BuyerPersonRecord | null} />
      ) : (
        <VisualAssetPreview record={record as VisualAssetRecord | null} />
      )}

      {!isBuyerPerson ? (
        <div
          aria-hidden={!isGenerating}
          className={`absolute inset-0 z-10 flex items-center justify-center bg-[#020617]/92 backdrop-blur-sm transition-all duration-700 ease-out ${
            isGenerating
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className={`transition-all duration-700 ease-out ${
              isGenerating ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/edwin-preview-loader.gif"
              alt=""
              className="h-72 w-72 object-contain"
            />
            <p className="mx-auto -mt-6 max-w-[260px] text-center text-sm font-semibold leading-6 text-slate-100">
              {loadingMessage}
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function BuyerPersonPreview({ record }: { record: BuyerPersonRecord | null }) {
  return (
    <>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
        {record?.profileName || "Preview del perfil"}
      </h2>
      {record?.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={record.profileImage}
          alt={record.profileName}
          className="mt-5 aspect-square w-full rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-800"
        />
      ) : null}
      {record?.description ? (
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {record.description}
        </p>
      ) : null}
      <div className="mt-6 space-y-5">
        <PreviewField label="Stage" value={record?.stage || "Pendiente"} />
        <PreviewField
          label="Motivations"
          value={
            record?.motivations?.length
              ? record.motivations.slice(0, 3).join(", ")
              : "Aqui se mostraran las motivaciones del buyer person."
          }
        />
        <PreviewField
          label="Decision factors"
          value={
            record?.decisionFactors?.length
              ? record.decisionFactors.slice(0, 3).join(", ")
              : "Pendiente"
          }
        />
        <PreviewField
          label="Scoring"
          value={
            record
              ? `${record.scoring.conversionLikelihood || 0}% - ${
                  record.scoring.urgency || "No urgency"
                } - ${record.scoring.salesReadiness || "No readiness"}`
              : "Pendiente"
          }
        />
      </div>
    </>
  );
}

function VisualAssetPreview({ record }: { record: VisualAssetRecord | null }) {
  return (
    <>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
        {record?.name || "Preview del asset"}
      </h2>
      <div className="mt-6 space-y-5">
        <PreviewField
          label="Categoria"
          value={
            record?.assetCategory
              ? getVisualAssetImageCategoryLabel(
                  record.category,
                  record.assetCategory,
                )
              : "Pendiente"
          }
        />
        <PreviewField label="Tipo" value={record?.assetType || "Pendiente"} />
        {record?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={record.url}
            alt={record.name}
            className="aspect-video w-full rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-800"
          />
        ) : null}
        <PreviewField label="URL" value={record?.url || "Pendiente"} />
        <PreviewField
          label="Notas"
          value={
            record?.notes || "Aqui se mostraran las notas del asset visual."
          }
        />
      </div>
    </>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel-soft p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <div className="mt-4 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  className?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`space-y-2 ${className}`}>
      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 md:col-span-2">
      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="admin-textarea"
      />
    </label>
  );
}
