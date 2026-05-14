export type LandingLanguage = "es" | "en";

export type LandingTemplateCopy = {
  admissionsTitle: string;
  benefitsEyebrow: string;
  certificationsRowTitle: string;
  certificationsTitle: string;
  campusesEyebrowPrefix: string;
  contentEyebrow: string;
  experienceEyebrow: string;
  externshipEyebrow: string;
  faqEyebrow: string;
  graduateProfileEyebrow: string;
  ctaButton: string;
  ctaTitle: string;
  curriculumButton: string;
  curriculumTitle: string;
  financialSupportEyebrow: string;
  externshipHoursLabel: string;
  externshipPartnerLabel: string;
  externshipTitle: string;
  faqTitle: string;
  financialAidTitle: string;
  formEmailLabel: string;
  formFullNameLabel: string;
  formPhoneLabel: string;
  footerEmailLabel: string;
  footerPhoneLabel: string;
  formDescription: string;
  formSubmitLabel: string;
  formTitle: string;
  handsOnTrainingTitle: string;
  heroModalityConnector: string;
  heroPrimaryCtaLabel: string;
  overviewEyebrow: string;
  overviewTitle: string;
  programSnapshotEyebrow: string;
  relatedProgramsAction: string;
  relatedProgramsEyebrow: string;
  relatedProgramsTitle: string;
  sectionViewMore: string;
  studentExperienceEyebrow: string;
  studentStoriesEyebrow: string;
  studentStoriesTitle: string;
  studentSupportTitle: string;
  studyAt: string;
  whyChoosePrefix: string;
  whyStudyTitle: string;
  campusesTitle: string;
  campusesDescription: string;
  campusesVideoLabel: string;
  careerOpportunitiesEyebrow: string;
  programBenefitsTitle: string;
  careerOpportunitiesTitle: string;
  legalLinksAriaLabel: string;
};

export const landingTemplateCopyByLanguage: Record<
  LandingLanguage,
  LandingTemplateCopy
> = {
  en: {
    admissionsTitle: "Admissions Requirements",
    benefitsEyebrow: "Benefits",
    campusesDescription:
      "Discover our available locations and explore the spaces, environment, and resources that shape the student experience.",
    campusesEyebrowPrefix: "Explore",
    campusesTitle: "Explore our campuses",
    campusesVideoLabel: "Watch campus video",
    careerOpportunitiesEyebrow: "Career paths",
    careerOpportunitiesTitle: "Career Opportunities",
    certificationsRowTitle: "Accreditations",
    certificationsTitle: "Accreditations and Certifications",
    contentEyebrow: "Program content",
    ctaButton: "Apply Now",
    ctaTitle: "Request Information",
    curriculumButton: "Download study plan",
    curriculumTitle: "What You Will Learn",
    experienceEyebrow: "Learning experience",
    externshipHoursLabel: "Hours",
    externshipEyebrow: "Real-world practice",
    externshipPartnerLabel: "Partner",
    externshipTitle: "Externship",
    faqEyebrow: "Questions",
    faqTitle: "Frequently asked questions",
    graduateProfileEyebrow: "Graduate profile",
    financialSupportEyebrow: "Financial support",
    financialAidTitle: "Financial Aid Options",
    formEmailLabel: "Email",
    formFullNameLabel: "Full Name",
    formPhoneLabel: "Phone",
    footerEmailLabel: "Email",
    footerPhoneLabel: "Phone",
    formDescription: "Complete the form and our team will contact you shortly.",
    formSubmitLabel: "Submit",
    formTitle: "Request information",
    handsOnTrainingTitle: "Hands-On Training",
    heroModalityConnector: "at",
    heroPrimaryCtaLabel: "Request Information",
    legalLinksAriaLabel: "Legal links",
    overviewEyebrow: "Program overview",
    overviewTitle: "Program Overview",
    programBenefitsTitle: "Program Benefits",
    programSnapshotEyebrow: "Program snapshot",
    relatedProgramsAction: "Explore program",
    relatedProgramsEyebrow: "Explore more",
    relatedProgramsTitle: "Related programs",
    sectionViewMore: "Learn more",
    studentExperienceEyebrow: "Student experience",
    studentStoriesEyebrow: "Community voices",
    studentStoriesTitle: "Student stories",
    studentSupportTitle: "Student Support",
    studyAt: "Study at",
    whyChoosePrefix: "Why choose",
    whyStudyTitle: "Why Study This Program",
  },
  es: {
    admissionsTitle: "Requisitos de admision",
    benefitsEyebrow: "Beneficios",
    campusesDescription:
      "Descubre nuestras sedes disponibles y explora los espacios, entornos y recursos que hacen parte de la experiencia estudiantil.",
    campusesEyebrowPrefix: "Explora",
    campusesTitle: "Conoce nuestros campuses",
    campusesVideoLabel: "Ver video del campus",
    careerOpportunitiesEyebrow: "Oportunidades laborales",
    careerOpportunitiesTitle: "Oportunidades laborales",
    certificationsRowTitle: "Acreditaciones",
    certificationsTitle: "Acreditaciones y certificaciones",
    contentEyebrow: "Contenido del programa",
    ctaButton: "Inscribete ahora",
    ctaTitle: "Solicita informacion",
    curriculumButton: "Descargar plan de estudios",
    curriculumTitle: "Lo que aprenderas",
    experienceEyebrow: "Experiencia de aprendizaje",
    externshipHoursLabel: "Horas",
    externshipEyebrow: "Practica en escenarios reales",
    externshipPartnerLabel: "Aliado",
    externshipTitle: "Practicas profesionales",
    faqEyebrow: "Preguntas",
    faqTitle: "Preguntas frecuentes",
    graduateProfileEyebrow: "Perfil del egresado",
    financialSupportEyebrow: "Apoyo financiero",
    financialAidTitle: "Opciones de ayuda financiera",
    formEmailLabel: "Correo",
    formFullNameLabel: "Nombre completo",
    formPhoneLabel: "Telefono",
    footerEmailLabel: "Correo",
    footerPhoneLabel: "Telefono",
    formDescription: "Completa el formulario y nuestro equipo te contactara pronto.",
    formSubmitLabel: "Enviar",
    formTitle: "Solicita informacion",
    handsOnTrainingTitle: "Entrenamiento practico",
    heroModalityConnector: "en",
    heroPrimaryCtaLabel: "Solicita informacion",
    legalLinksAriaLabel: "Links legales",
    overviewEyebrow: "Resumen del programa",
    overviewTitle: "Resumen del programa",
    programBenefitsTitle: "Beneficios del programa",
    programSnapshotEyebrow: "Resumen del programa",
    relatedProgramsAction: "Ver programa",
    relatedProgramsEyebrow: "Explora mas",
    relatedProgramsTitle: "Programas relacionados",
    sectionViewMore: "Ver mas",
    studentExperienceEyebrow: "Experiencia estudiantil",
    studentStoriesEyebrow: "Voces de la comunidad",
    studentStoriesTitle: "Historias de estudiantes",
    studentSupportTitle: "Acompanamiento al estudiante",
    studyAt: "Estudia en",
    whyChoosePrefix: "Por que elegir",
    whyStudyTitle: "Por que estudiar este programa",
  },
};

const englishAliases = new Set(["en", "eng", "english", "ing", "in"]);
const spanishAliases = new Set(["es", "spa", "spanish", "espanol"]);

export function normalizeLandingLanguage(
  value?: string | null,
): LandingLanguage | "" {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!normalized) {
    return "";
  }

  if (englishAliases.has(normalized)) {
    return "en";
  }

  if (spanishAliases.has(normalized)) {
    return "es";
  }

  return "";
}

export function defaultLandingLanguageForBrand(brandSlug?: string): LandingLanguage {
  return brandSlug === "pcihealth" || brandSlug === "omi" ? "en" : "es";
}

export function getLandingTemplateCopy(
  value?: string | null,
  brandSlug?: string,
): LandingTemplateCopy {
  const language =
    normalizeLandingLanguage(value) || defaultLandingLanguageForBrand(brandSlug);

  return landingTemplateCopyByLanguage[language];
}
