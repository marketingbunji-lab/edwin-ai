import {
  dashboardMessages,
  type DashboardLanguage,
} from "@/lib/dashboardI18n";

export type UxWriterLanguageMode = DashboardLanguage | "both";

type TranslationLeaf = string;
type TranslationNode = {
  [key: string]: TranslationLeaf | TranslationNode;
};

type DashboardNamespace = keyof (typeof dashboardMessages)["en"];

export type UxWriterEntryKind =
  | "page_title"
  | "section_description"
  | "button"
  | "helper_text"
  | "empty_state"
  | "validation_message"
  | "error_message"
  | "success_message"
  | "cta"
  | "onboarding"
  | "label"
  | "status_badge"
  | "navigation";

export type UxWriterCopyEntry = {
  key: string;
  kind: UxWriterEntryKind;
  current: {
    en: string;
    es: string;
  };
  notes?: string;
};

export type UxWriterSection = {
  id: string;
  title: string;
  summary: string;
  routeHints: string[];
  audience: string[];
  goals: string[];
  source: "dashboardI18n" | "custom";
  entries: UxWriterCopyEntry[];
};

export type UxWriterCustomSectionInput = {
  id: string;
  title: string;
  summary: string;
  routeHints?: string[];
  audience?: string[];
  goals?: string[];
  entries: UxWriterCopyEntry[];
};

export type UxWriterAgentRunInput = {
  sectionIds?: string[];
  route?: string;
  language?: UxWriterLanguageMode;
  customSections?: UxWriterCustomSectionInput[];
  contextNotes?: string;
  dryRun?: boolean;
};

const sectionMeta: Record<
  DashboardNamespace,
  Omit<UxWriterSection, "entries" | "source">
> = {
  shell: {
    id: "shell",
    title: "Global Shell",
    summary:
      "Primary navigation, sidebar, back labels, and persistent workspace navigation copy.",
    routeHints: ["/admin", "/brands", "/dashboard"],
    audience: ["marketing", "enrollment", "content", "academic staff"],
    goals: [
      "Make navigation labels obvious for non-technical users",
      "Reduce ambiguity in back actions and contextual navigation",
      "Keep action labels short and scan-friendly",
    ],
  },
  userMenu: {
    id: "userMenu",
    title: "Account Menu",
    summary:
      "Language, theme, account, and sign-out labels shown in the user menu.",
    routeHints: ["/admin", "/brands"],
    audience: ["all dashboard users"],
    goals: [
      "Keep utility labels friendly and professional",
      "Avoid technical phrasing for preferences and session actions",
    ],
  },
  home: {
    id: "home",
    title: "Dashboard Home",
    summary: "Workspace discovery, overview headlines, and dashboard intro copy.",
    routeHints: ["/admin", "/brands"],
    audience: ["marketing leads", "admissions managers", "content teams"],
    goals: [
      "Clarify what the workspace helps users do",
      "Make the home screen feel guided and welcoming",
    ],
  },
  brandCard: {
    id: "brandCard",
    title: "Brand Cards",
    summary:
      "Card-level actions and metadata labels for institution workspaces.",
    routeHints: ["/brands", "/admin/brands"],
    audience: ["marketing", "operations", "enrollment"],
    goals: [
      "Use plain language for workspace actions",
      "Make card labels easy to scan in dense lists",
    ],
  },
  landings: {
    id: "landings",
    title: "Landing Management",
    summary:
      "Search, preview, duplication, export, delete, statuses, and landing list actions.",
    routeHints: ["/landings", "/brands/[brand]/landings"],
    audience: ["marketing", "content", "enrollment"],
    goals: [
      "Keep list actions direct and low-friction",
      "Use reassuring warning and confirmation language",
    ],
  },
  brandEditor: {
    id: "brandEditor",
    title: "Brand Setup",
    summary:
      "Field labels, helper copy, save states, and institutional configuration guidance.",
    routeHints: ["/brands/[brand]/edit", "/brands/new"],
    audience: ["marketing", "brand managers", "institutional teams"],
    goals: [
      "Guide users step by step through brand setup",
      "Use educational context instead of generic SaaS jargon",
    ],
  },
  programsEditor: {
    id: "programsEditor",
    title: "Programs Collection",
    summary:
      "Programs list editing, save actions, and collection-level management copy.",
    routeHints: ["/brands/[brand]/programs/edit"],
    audience: ["content", "academic teams", "marketing"],
    goals: [
      "Make bulk editing actions easy to understand",
      "Keep terminology aligned with academic workflows",
    ],
  },
  programDataEditor: {
    id: "programDataEditor",
    title: "Program Setup",
    summary:
      "Program creation, step guidance, preview states, and content-agent interactions.",
    routeHints: ["/brands/[brand]/programs/new", "/brands/[brand]/programs/[program]/edit"],
    audience: ["content", "academic teams", "marketing"],
    goals: [
      "Explain setup steps in simple language",
      "Reduce anxiety around validation and AI-generated outputs",
    ],
  },
  buyerPersonTable: {
    id: "buyerPersonTable",
    title: "Buyer Persona Records",
    summary:
      "Table labels, actions, and status copy for persona records and supporting content.",
    routeHints: ["/buyer-person"],
    audience: ["marketing", "enrollment", "content strategists"],
    goals: [
      "Keep table actions short and clear",
      "Use professional but human action labels",
    ],
  },
  programsPage: {
    id: "programsPage",
    title: "Programs Page",
    summary:
      "Page-level header actions and primary labels for the programs workspace.",
    routeHints: ["/brands/[brand]/programs"],
    audience: ["content", "academic teams", "marketing"],
    goals: [
      "Keep program management actions direct and easy to scan",
      "Use academic terminology consistently",
    ],
  },
  landingsPage: {
    id: "landingsPage",
    title: "Landings Page",
    summary:
      "Header, empty state, and action copy for brand landing management.",
    routeHints: ["/brands/[brand]/landings"],
    audience: ["marketing", "enrollment", "content"],
    goals: [
      "Make landing actions feel guided and clear",
      "Use activation-focused but simple language",
    ],
  },
  journeyPage: {
    id: "journeyPage",
    title: "Journey Page",
    summary:
      "Workflow cards and descriptions for buyer personas, visual assets, and landing activation.",
    routeHints: ["/brands/[brand]/journey"],
    audience: ["marketing", "enrollment", "content strategists"],
    goals: [
      "Make the activation journey feel sequential and intuitive",
      "Clarify what each workflow contributes",
    ],
  },
  knowledgeBasePage: {
    id: "knowledgeBasePage",
    title: "Knowledge Base Page",
    summary:
      "Workflow states, section labels, and CTAs for the institutional knowledge base.",
    routeHints: ["/brands/[brand]/knowledge-base"],
    audience: ["content", "academic teams", "institutional users"],
    goals: [
      "Help teams understand the order of foundational setup",
      "Keep knowledge workflows easy to navigate",
    ],
  },
  universityPage: {
    id: "universityPage",
    title: "University Content Base Page",
    summary:
      "Institutional snapshot labels, top-bar actions, and supporting descriptive copy.",
    routeHints: ["/brands/[brand]/university"],
    audience: ["academic teams", "content teams", "institutional users"],
    goals: [
      "Present institutional context in a simple, guided way",
      "Keep labels aligned with educational workflows",
    ],
  },
  workspaceProgress: {
    id: "workspaceProgress",
    title: "Workspace Progress Card",
    summary:
      "Executive progress states and helper copy shown in the workspace status panel.",
    routeHints: ["/brands/[brand]"],
    audience: ["marketing leads", "operations", "enrollment managers"],
    goals: [
      "Make progress status easy to scan quickly",
      "Keep the tone executive but human",
    ],
  },
  common: {
    id: "common",
    title: "Common UI",
    summary:
      "Shared cross-dashboard labels such as delete confirmations, empty states, and basic status words.",
    routeHints: ["/admin", "/brands"],
    audience: ["all dashboard users"],
    goals: [
      "Keep foundational UI language consistent everywhere",
      "Prefer clarity and certainty over cleverness",
    ],
  },
};

const kindMatchers: Array<[RegExp, UxWriterEntryKind]> = [
  [/(title|eyebrow)$/i, "page_title"],
  [/(description|helper|footer)$/i, "section_description"],
  [/(button|cta|view|preview|edit|save|create|duplicate|delete|remove|continue|previous|back|open|close|signOut)$/i, "button"],
  [/(placeholder|label|fields?|programLabel|profile)$/i, "label"],
  [/(empty|pending|locked|completed|progress|status)/i, "status_badge"],
  [/(error|invalid|failure)/i, "error_message"],
  [/(success|saved|created|complete)/i, "success_message"],
  [/(search|clear|add|upload|catalog|language|theme)/i, "helper_text"],
];

function inferEntryKind(key: string): UxWriterEntryKind {
  for (const [matcher, kind] of kindMatchers) {
    if (matcher.test(key)) {
      return kind;
    }
  }

  return "helper_text";
}

function flattenTranslations(
  node: TranslationNode,
  enNode: TranslationNode,
  prefix: string[] = [],
): UxWriterCopyEntry[] {
  return Object.entries(node).flatMap(([key, value]) => {
    const currentPath = [...prefix, key];
    const currentKey = currentPath.join(".");
    const enValue = enNode[key];

    if (typeof value === "string" && typeof enValue === "string") {
      return [
        {
          key: currentKey,
          kind: inferEntryKind(currentKey),
          current: {
            en: enValue,
            es: value,
          },
        },
      ];
    }

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      enValue &&
      typeof enValue === "object" &&
      !Array.isArray(enValue)
    ) {
      return flattenTranslations(
        value as TranslationNode,
        enValue as TranslationNode,
        currentPath,
      );
    }

    return [];
  });
}

function buildDashboardSection(namespace: DashboardNamespace): UxWriterSection {
  const entries = flattenTranslations(
    dashboardMessages.es[namespace] as TranslationNode,
    dashboardMessages.en[namespace] as TranslationNode,
    [namespace],
  );

  return {
    ...sectionMeta[namespace],
    source: "dashboardI18n",
    entries,
  };
}

function normalizeCustomSection(
  section: UxWriterCustomSectionInput,
): UxWriterSection {
  return {
    id: section.id,
    title: section.title,
    summary: section.summary,
    routeHints: section.routeHints ?? [],
    audience: section.audience ?? ["dashboard users"],
    goals: section.goals ?? [
      "Make the UI easy to understand at a glance",
      "Keep the tone clear, human, and guided",
    ],
    source: "custom",
    entries: section.entries,
  };
}

export function listUxWriterDashboardSections() {
  return (Object.keys(sectionMeta) as DashboardNamespace[]).map((namespace) => ({
    id: sectionMeta[namespace].id,
    title: sectionMeta[namespace].title,
    summary: sectionMeta[namespace].summary,
    routeHints: sectionMeta[namespace].routeHints,
    source: "dashboardI18n" as const,
    entryCount: buildDashboardSection(namespace).entries.length,
  }));
}

export function resolveUxWriterSectionIdsByRoute(route?: string) {
  if (!route) {
    return [];
  }

  const normalizedRoute = route.toLowerCase();

  return (Object.keys(sectionMeta) as DashboardNamespace[])
    .filter((namespace) =>
      sectionMeta[namespace].routeHints.some((hint) =>
        normalizedRoute.includes(hint.toLowerCase().replace("[brand]", "")),
      ),
    )
    .map((namespace) => sectionMeta[namespace].id);
}

export function getUxWriterSections(input?: {
  sectionIds?: string[];
  route?: string;
  customSections?: UxWriterCustomSectionInput[];
}) {
  const requestedIds = new Set<string>([
    ...(input?.sectionIds ?? []),
    ...resolveUxWriterSectionIdsByRoute(input?.route),
  ]);

  const dashboardSections = (Object.keys(sectionMeta) as DashboardNamespace[])
    .map((namespace) => buildDashboardSection(namespace))
    .filter((section) =>
      requestedIds.size === 0 ? true : requestedIds.has(section.id),
    );

  const customSections = (input?.customSections ?? []).map(normalizeCustomSection);

  return [...dashboardSections, ...customSections];
}

export function getUxWriterAgentDefinition() {
  return {
    id: "ux-writer-agent",
    name: "EDwin UX Writer",
    supportedLanguages: ["en", "es", "both"] as const,
    audience: [
      "university marketing teams",
      "enrollment and admissions teams",
      "content teams",
      "academic and institutional staff",
    ],
    scope:
      "Platform UI copy only. Never rewrite brand, university, program, or institutional data.",
    outputShape: {
      summary: "High-level recommendations for the reviewed sections.",
      changes: [
        {
          sectionId: "shell",
          key: "shell.newBrand",
          rationale: "Why the rewrite improves clarity or guidance.",
          current: { en: "New brand", es: "Nueva marca" },
          proposed: { en: "Add brand", es: "Agregar marca" },
        },
      ],
      guidelines: {
        tone: ["clear", "guided", "human", "concise"],
        terminology: {
          en: ["Programs", "Knowledge Base", "Journey"],
          es: ["Programas", "Base de conocimiento", "Journey"],
        },
      },
    },
  };
}

export function buildUxWriterPrompts({
  sections,
  language,
  contextNotes,
}: {
  sections: UxWriterSection[];
  language: UxWriterLanguageMode;
  contextNotes?: string;
}) {
  const systemPrompt = [
    "You are EDwin UX Writer, a bilingual UX writing specialist for university and admissions platforms.",
    "Rewrite only platform UI copy.",
    "Do not translate or modify institution names, brand names, program names, descriptions, or any academic content stored in the data.",
    "Write for non-technical users in marketing, enrollment, content, and academic teams.",
    "Prioritize clarity over cleverness.",
    "Use concise, scannable, guided language.",
    "Avoid generic or overly technical SaaS jargon.",
    "Preserve educational and institutional context.",
    "When rewriting, improve hierarchy between titles, descriptions, helper text, and actions.",
    "Return strict JSON only.",
  ].join(" ");

  const userPrompt = [
    `Review ${sections.length} dashboard section(s).`,
    `Target language mode: ${language}.`,
    "For each UI string, decide whether it should stay as is or be rewritten.",
    "If a string is already good, you can omit it from the changes list.",
    "When you suggest a rewrite, provide both English and Spanish unless the language mode explicitly narrows the output.",
    "Keep the interface feeling step-by-step, helpful, and professional.",
    contextNotes ? `Additional product context: ${contextNotes}` : "",
    "",
    "Return JSON with this shape:",
    JSON.stringify(
      {
        summary: "",
        changes: [
          {
            sectionId: "shell",
            key: "shell.newBrand",
            rationale: "",
            current: { en: "", es: "" },
            proposed: { en: "", es: "" },
          },
        ],
        guidelines: {
          tone: [] as string[],
          terminology: {
            en: {} as Record<string, string>,
            es: {} as Record<string, string>,
          },
        },
      },
      null,
      2,
    ),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    systemPrompt,
    userPrompt,
  };
}

export function buildUxWriterAgentPayload(input: UxWriterAgentRunInput) {
  const language = input.language ?? "both";
  const sections = getUxWriterSections({
    sectionIds: input.sectionIds,
    route: input.route,
    customSections: input.customSections,
  });

  return {
    agent: getUxWriterAgentDefinition(),
    language,
    sections,
    prompts: buildUxWriterPrompts({
      sections,
      language,
      contextNotes: input.contextNotes,
    }),
    contextNotes: input.contextNotes ?? "",
    route: input.route ?? "",
    dryRun: input.dryRun ?? false,
  };
}
