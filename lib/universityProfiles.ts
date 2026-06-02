import fs from "node:fs";
import path from "node:path";

export type DescriptionItem = {
  title: string;
  description: string;
};

export type MilestoneItem = {
  year: string;
  event: string;
};

export type RecognitionItem = {
  year: string;
  recognition: string;
  organization: string;
};

export type UniversityInstitutionalProfile = {
  institutionalEssence: {
    whatItIs: string;
    whatItDoes: string;
    whoItServes: string;
  };
  mission: {
    statement: string;
    keyFocusAreas: string[];
  };
  vision: {
    statement: string;
    targetYear: string;
    aspirations: string[];
  };
  coreValues: DescriptionItem[];
  guidingPrinciples: DescriptionItem[];
  institutionalPhilosophy: {
    educationalModel: string;
    learningApproach: string;
    studentCenteredFocus: string;
  };
  history: {
    overview: string;
    milestones: MilestoneItem[];
  };
  strategicObjectives: DescriptionItem[];
  studentExperience: {
    campusLife: string;
    studentSupportServices: string[];
    clubsAndOrganizations: string[];
    leadershipOpportunities: string[];
    internationalPrograms: string[];
  };
  researchAndInnovation: {
    researchAreas: string[];
    innovationInitiatives: string[];
    industryPartnerships: string[];
  };
  communityEngagement: {
    socialImpactPrograms: string[];
    communityPartnerships: string[];
    sustainabilityInitiatives: string[];
  };
  graduateProfile: {
    description: string;
    competencies: string[];
    professionalSkills: string[];
    ethicalCommitments: string[];
  };
  facultyProfile: {
    overview: string;
    qualifications: string[];
    teachingStrengths: string[];
  };
  competitiveAdvantages: DescriptionItem[];
  brandIdentity: {
    brandPromise: string;
    brandPersonality: string[];
    uniqueValueProposition: string;
  };
  institutionalCulture: {
    cultureDescription: string;
    diversityAndInclusion: string;
    innovationMindset: string;
    collaborationApproach: string;
  };
  recognitionsAndAchievements: RecognitionItem[];
  futureOutlook: {
    growthPlans: string[];
    strategicPriorities: string[];
    longTermGoals: string[];
  };
};

const profilesDir = path.join(process.cwd(), "data", "university-profiles");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getUniversityProfileByBrand(brandSlug: string) {
  const filePath = getUniversityProfilePath(brandSlug);

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  return normalizeUniversityProfile(
    JSON.parse(content) as Partial<UniversityInstitutionalProfile>,
  );
}

export function getEmptyUniversityProfile(): UniversityInstitutionalProfile {
  return normalizeUniversityProfile({});
}

export function saveUniversityProfile(
  brandSlug: string,
  value: Partial<UniversityInstitutionalProfile>,
) {
  const filePath = getUniversityProfilePath(brandSlug);

  if (!filePath) {
    return null;
  }

  const profile = normalizeUniversityProfile(value);
  const folderPath = path.dirname(filePath);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf8");

  return profile;
}

export function hasUniversityProfileContent(
  profile: UniversityInstitutionalProfile | null,
) {
  if (!profile) {
    return false;
  }

  return hasMeaningfulValue(profile);
}

function getUniversityProfilePath(brandSlug: string) {
  if (!slugPattern.test(brandSlug)) {
    return null;
  }

  const filePath = path.resolve(profilesDir, `${brandSlug}.json`);
  const relativePath = path.relative(profilesDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function normalizeUniversityProfile(
  value: Partial<UniversityInstitutionalProfile>,
): UniversityInstitutionalProfile {
  return {
    institutionalEssence: {
      whatItIs: text(value.institutionalEssence?.whatItIs),
      whatItDoes: text(value.institutionalEssence?.whatItDoes),
      whoItServes: text(value.institutionalEssence?.whoItServes),
    },
    mission: {
      statement: text(value.mission?.statement),
      keyFocusAreas: list(value.mission?.keyFocusAreas),
    },
    vision: {
      statement: text(value.vision?.statement),
      targetYear: text(value.vision?.targetYear),
      aspirations: list(value.vision?.aspirations),
    },
    coreValues: descriptionItems(value.coreValues),
    guidingPrinciples: descriptionItems(value.guidingPrinciples),
    institutionalPhilosophy: {
      educationalModel: text(value.institutionalPhilosophy?.educationalModel),
      learningApproach: text(value.institutionalPhilosophy?.learningApproach),
      studentCenteredFocus: text(
        value.institutionalPhilosophy?.studentCenteredFocus,
      ),
    },
    history: {
      overview: text(value.history?.overview),
      milestones: Array.isArray(value.history?.milestones)
        ? value.history.milestones
            .map((item) => ({
              year: text(item.year),
              event: text(item.event),
            }))
            .filter((item) => item.year || item.event)
        : [],
    },
    strategicObjectives: descriptionItems(value.strategicObjectives),
    studentExperience: {
      campusLife: text(value.studentExperience?.campusLife),
      studentSupportServices: list(
        value.studentExperience?.studentSupportServices,
      ),
      clubsAndOrganizations: list(
        value.studentExperience?.clubsAndOrganizations,
      ),
      leadershipOpportunities: list(
        value.studentExperience?.leadershipOpportunities,
      ),
      internationalPrograms: list(value.studentExperience?.internationalPrograms),
    },
    researchAndInnovation: {
      researchAreas: list(value.researchAndInnovation?.researchAreas),
      innovationInitiatives: list(
        value.researchAndInnovation?.innovationInitiatives,
      ),
      industryPartnerships: list(
        value.researchAndInnovation?.industryPartnerships,
      ),
    },
    communityEngagement: {
      socialImpactPrograms: list(
        value.communityEngagement?.socialImpactPrograms,
      ),
      communityPartnerships: list(
        value.communityEngagement?.communityPartnerships,
      ),
      sustainabilityInitiatives: list(
        value.communityEngagement?.sustainabilityInitiatives,
      ),
    },
    graduateProfile: {
      description: text(value.graduateProfile?.description),
      competencies: list(value.graduateProfile?.competencies),
      professionalSkills: list(value.graduateProfile?.professionalSkills),
      ethicalCommitments: list(value.graduateProfile?.ethicalCommitments),
    },
    facultyProfile: {
      overview: text(value.facultyProfile?.overview),
      qualifications: list(value.facultyProfile?.qualifications),
      teachingStrengths: list(value.facultyProfile?.teachingStrengths),
    },
    competitiveAdvantages: descriptionItems(value.competitiveAdvantages),
    brandIdentity: {
      brandPromise: text(value.brandIdentity?.brandPromise),
      brandPersonality: list(value.brandIdentity?.brandPersonality),
      uniqueValueProposition: text(
        value.brandIdentity?.uniqueValueProposition,
      ),
    },
    institutionalCulture: {
      cultureDescription: text(value.institutionalCulture?.cultureDescription),
      diversityAndInclusion: text(
        value.institutionalCulture?.diversityAndInclusion,
      ),
      innovationMindset: text(value.institutionalCulture?.innovationMindset),
      collaborationApproach: text(
        value.institutionalCulture?.collaborationApproach,
      ),
    },
    recognitionsAndAchievements: Array.isArray(
      value.recognitionsAndAchievements,
    )
      ? value.recognitionsAndAchievements
          .map((item) => ({
            year: text(item.year),
            recognition: text(item.recognition),
            organization: text(item.organization),
          }))
          .filter((item) => item.year || item.recognition || item.organization)
      : [],
    futureOutlook: {
      growthPlans: list(value.futureOutlook?.growthPlans),
      strategicPriorities: list(value.futureOutlook?.strategicPriorities),
      longTermGoals: list(value.futureOutlook?.longTermGoals),
    },
  };
}

function descriptionItems(value: unknown): DescriptionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      return {
        title: text(record.title ?? record.name ?? record.objective),
        description: text(record.description),
      };
    })
    .filter((item): item is DescriptionItem =>
      Boolean(item && (item.title || item.description)),
    );
}

function list(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => text(item)).filter(Boolean);
  }

  const current = text(value);
  return current ? [current] : [];
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hasMeaningfulValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some(hasMeaningfulValue);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasMeaningfulValue);
  }

  return false;
}
