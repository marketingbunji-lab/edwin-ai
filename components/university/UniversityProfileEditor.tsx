"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type {
  DescriptionItem,
  MilestoneItem,
  RecognitionItem,
  UniversityInstitutionalProfile,
} from "@/lib/universityProfiles";

type Props = {
  brandSlug: string;
  initialProfile: UniversityInstitutionalProfile;
};

type ProfileMutator = (draft: UniversityInstitutionalProfile) => void;

export default function UniversityProfileEditor({
  brandSlug,
  initialProfile,
}: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateProfile = (mutator: ProfileMutator) => {
    setProfile((current) => {
      const draft = JSON.parse(
        JSON.stringify(current),
      ) as UniversityInstitutionalProfile;
      mutator(draft);
      return draft;
    });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`/api/university-profiles/${brandSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        profile?: UniversityInstitutionalProfile;
      };

      if (!response.ok || !data.ok || !data.profile) {
        throw new Error(
          data.error || "No se pudo guardar el perfil institucional",
        );
      }

      setProfile(data.profile);
      setMessage("Perfil institucional guardado correctamente.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el perfil institucional",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-24 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-[0_18px_42px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/86">
        <div>
          <p className="admin-eyebrow">University Content Base</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edita la base institucional sin duplicar datos de marca o programas.
          </p>
        </div>

        <button
          type="button"
          onClick={saveProfile}
          disabled={saving}
          className="admin-button-primary"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <EditorSection
        eyebrow="Essence"
        title="Lo que es, que hace y para quien"
        description="Define la esencia institucional que luego alimentara agentes, mensajes y landings."
      >
        <TextArea
          label="Lo que es"
          value={profile.institutionalEssence.whatItIs}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalEssence.whatItIs = value;
            })
          }
        />
        <TextArea
          label="Que hace"
          value={profile.institutionalEssence.whatItDoes}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalEssence.whatItDoes = value;
            })
          }
        />
        <TextArea
          label="Para quien"
          value={profile.institutionalEssence.whoItServes}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalEssence.whoItServes = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Direction" title="Mision y vision">
        <TextArea
          label="Mision"
          value={profile.mission.statement}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.mission.statement = value;
            })
          }
        />
        <ListField
          label="Focos clave de la mision"
          value={profile.mission.keyFocusAreas}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.mission.keyFocusAreas = value;
            })
          }
        />
        <TextArea
          label="Vision"
          value={profile.vision.statement}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.vision.statement = value;
            })
          }
        />
        <Field
          label="Ano objetivo"
          value={profile.vision.targetYear}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.vision.targetYear = value;
            })
          }
        />
        <ListField
          label="Aspiraciones"
          value={profile.vision.aspirations}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.vision.aspirations = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Culture" title="Valores y principios">
        <DescriptionItemsField
          label="Valores centrales"
          value={profile.coreValues}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.coreValues = value;
            })
          }
        />
        <DescriptionItemsField
          label="Principios orientadores"
          value={profile.guidingPrinciples}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.guidingPrinciples = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Learning" title="Filosofia institucional">
        <TextArea
          label="Modelo educativo"
          value={profile.institutionalPhilosophy.educationalModel}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalPhilosophy.educationalModel = value;
            })
          }
        />
        <TextArea
          label="Enfoque de aprendizaje"
          value={profile.institutionalPhilosophy.learningApproach}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalPhilosophy.learningApproach = value;
            })
          }
        />
        <TextArea
          label="Enfoque centrado en el estudiante"
          value={profile.institutionalPhilosophy.studentCenteredFocus}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalPhilosophy.studentCenteredFocus = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Background" title="Historia">
        <TextArea
          label="Resumen historico"
          value={profile.history.overview}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.history.overview = value;
            })
          }
        />
        <MilestonesField
          label="Hitos"
          value={profile.history.milestones}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.history.milestones = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Strategy" title="Objetivos y diferenciales">
        <DescriptionItemsField
          label="Objetivos estrategicos"
          value={profile.strategicObjectives}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.strategicObjectives = value;
            })
          }
        />
        <DescriptionItemsField
          label="Ventajas competitivas"
          value={profile.competitiveAdvantages}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.competitiveAdvantages = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Experience" title="Experiencia estudiantil">
        <TextArea
          label="Vida en campus"
          value={profile.studentExperience.campusLife}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.studentExperience.campusLife = value;
            })
          }
        />
        <ListField
          label="Servicios de apoyo"
          value={profile.studentExperience.studentSupportServices}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.studentExperience.studentSupportServices = value;
            })
          }
        />
        <ListField
          label="Clubes y organizaciones"
          value={profile.studentExperience.clubsAndOrganizations}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.studentExperience.clubsAndOrganizations = value;
            })
          }
        />
        <ListField
          label="Oportunidades de liderazgo"
          value={profile.studentExperience.leadershipOpportunities}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.studentExperience.leadershipOpportunities = value;
            })
          }
        />
        <ListField
          label="Programas internacionales"
          value={profile.studentExperience.internationalPrograms}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.studentExperience.internationalPrograms = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Impact" title="Investigacion, innovacion y comunidad">
        <ListField
          label="Areas de investigacion"
          value={profile.researchAndInnovation.researchAreas}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.researchAndInnovation.researchAreas = value;
            })
          }
        />
        <ListField
          label="Iniciativas de innovacion"
          value={profile.researchAndInnovation.innovationInitiatives}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.researchAndInnovation.innovationInitiatives = value;
            })
          }
        />
        <ListField
          label="Alianzas con industria"
          value={profile.researchAndInnovation.industryPartnerships}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.researchAndInnovation.industryPartnerships = value;
            })
          }
        />
        <ListField
          label="Programas de impacto social"
          value={profile.communityEngagement.socialImpactPrograms}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.communityEngagement.socialImpactPrograms = value;
            })
          }
        />
        <ListField
          label="Alianzas comunitarias"
          value={profile.communityEngagement.communityPartnerships}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.communityEngagement.communityPartnerships = value;
            })
          }
        />
        <ListField
          label="Iniciativas de sostenibilidad"
          value={profile.communityEngagement.sustainabilityInitiatives}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.communityEngagement.sustainabilityInitiatives = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Profiles" title="Perfiles academicos">
        <TextArea
          label="Descripcion del perfil del egresado"
          value={profile.graduateProfile.description}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.graduateProfile.description = value;
            })
          }
        />
        <ListField
          label="Competencias del egresado"
          value={profile.graduateProfile.competencies}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.graduateProfile.competencies = value;
            })
          }
        />
        <ListField
          label="Habilidades profesionales"
          value={profile.graduateProfile.professionalSkills}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.graduateProfile.professionalSkills = value;
            })
          }
        />
        <ListField
          label="Compromisos eticos"
          value={profile.graduateProfile.ethicalCommitments}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.graduateProfile.ethicalCommitments = value;
            })
          }
        />
        <TextArea
          label="Resumen del perfil docente"
          value={profile.facultyProfile.overview}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.facultyProfile.overview = value;
            })
          }
        />
        <ListField
          label="Formacion docente"
          value={profile.facultyProfile.qualifications}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.facultyProfile.qualifications = value;
            })
          }
        />
        <ListField
          label="Fortalezas pedagogicas"
          value={profile.facultyProfile.teachingStrengths}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.facultyProfile.teachingStrengths = value;
            })
          }
        />
      </EditorSection>

      <EditorSection eyebrow="Brand" title="Identidad, cultura y futuro">
        <TextArea
          label="Promesa de marca"
          value={profile.brandIdentity.brandPromise}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.brandIdentity.brandPromise = value;
            })
          }
        />
        <ListField
          label="Personalidad de marca"
          value={profile.brandIdentity.brandPersonality}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.brandIdentity.brandPersonality = value;
            })
          }
        />
        <TextArea
          label="Propuesta unica de valor"
          value={profile.brandIdentity.uniqueValueProposition}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.brandIdentity.uniqueValueProposition = value;
            })
          }
        />
        <TextArea
          label="Descripcion de cultura"
          value={profile.institutionalCulture.cultureDescription}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalCulture.cultureDescription = value;
            })
          }
        />
        <TextArea
          label="Diversidad e inclusion"
          value={profile.institutionalCulture.diversityAndInclusion}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalCulture.diversityAndInclusion = value;
            })
          }
        />
        <TextArea
          label="Mentalidad de innovacion"
          value={profile.institutionalCulture.innovationMindset}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalCulture.innovationMindset = value;
            })
          }
        />
        <TextArea
          label="Enfoque de colaboracion"
          value={profile.institutionalCulture.collaborationApproach}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.institutionalCulture.collaborationApproach = value;
            })
          }
        />
        <RecognitionsField
          label="Reconocimientos"
          value={profile.recognitionsAndAchievements}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.recognitionsAndAchievements = value;
            })
          }
        />
        <ListField
          label="Planes de crecimiento"
          value={profile.futureOutlook.growthPlans}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.futureOutlook.growthPlans = value;
            })
          }
        />
        <ListField
          label="Prioridades estrategicas"
          value={profile.futureOutlook.strategicPriorities}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.futureOutlook.strategicPriorities = value;
            })
          }
        />
        <ListField
          label="Metas de largo plazo"
          value={profile.futureOutlook.longTermGoals}
          onChange={(value) =>
            updateProfile((draft) => {
              draft.futureOutlook.longTermGoals = value;
            })
          }
        />
      </EditorSection>

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}

function EditorSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel p-6">
      <p className="admin-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      {description ? <p className="admin-muted mt-2">{description}</p> : null}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 lg:col-span-2">
      <span className="text-sm font-semibold text-slate-950 dark:text-slate-100">
        {label}
      </span>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-textarea"
      />
    </label>
  );
}

function ListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <TextArea
      label={`${label} (una linea por item)`}
      value={value.join("\n")}
      onChange={(nextValue) => onChange(lines(nextValue))}
    />
  );
}

function DescriptionItemsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DescriptionItem[];
  onChange: (value: DescriptionItem[]) => void;
}) {
  return (
    <TextArea
      label={`${label} (Titulo | Descripcion)`}
      value={value
        .map((item) => `${item.title} | ${item.description}`.trim())
        .join("\n")}
      onChange={(nextValue) => onChange(descriptionItems(nextValue))}
    />
  );
}

function MilestonesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MilestoneItem[];
  onChange: (value: MilestoneItem[]) => void;
}) {
  return (
    <TextArea
      label={`${label} (Ano | Evento)`}
      value={value.map((item) => `${item.year} | ${item.event}`.trim()).join("\n")}
      onChange={(nextValue) => onChange(milestones(nextValue))}
    />
  );
}

function RecognitionsField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RecognitionItem[];
  onChange: (value: RecognitionItem[]) => void;
}) {
  return (
    <TextArea
      label={`${label} (Ano | Reconocimiento | Organizacion)`}
      value={value
        .map(
          (item) =>
            `${item.year} | ${item.recognition} | ${item.organization}`.trim(),
        )
        .join("\n")}
      onChange={(nextValue) => onChange(recognitions(nextValue))}
    />
  );
}

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function descriptionItems(value: string): DescriptionItem[] {
  return lines(value).map((line) => {
    const [title = "", ...descriptionParts] = line.split("|");
    return {
      title: title.trim(),
      description: descriptionParts.join("|").trim(),
    };
  });
}

function milestones(value: string): MilestoneItem[] {
  return lines(value).map((line) => {
    const [year = "", ...eventParts] = line.split("|");
    return {
      year: year.trim(),
      event: eventParts.join("|").trim(),
    };
  });
}

function recognitions(value: string): RecognitionItem[] {
  return lines(value).map((line) => {
    const [year = "", recognition = "", ...organizationParts] =
      line.split("|");
    return {
      year: year.trim(),
      recognition: recognition.trim(),
      organization: organizationParts.join("|").trim(),
    };
  });
}
