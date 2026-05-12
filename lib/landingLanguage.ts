export type LandingLanguage = "es" | "en";

export type LandingTemplateCopy = {
  admissionsTitle: string;
  certificationsRowTitle: string;
  certificationsTitle: string;
  ctaButton: string;
  ctaTitle: string;
  curriculumButton: string;
  curriculumTitle: string;
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
  overviewTitle: string;
  relatedProgramsAction: string;
  relatedProgramsTitle: string;
  sectionViewMore: string;
  studentSupportTitle: string;
  studyAt: string;
  whyStudyTitle: string;
  campusesTitle: string;
  campusesDescription: string;
  campusesVideoLabel: string;
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
    campusesDescription:
      "Discover our available locations and explore the spaces, environment, and resources that shape the student experience.",
    campusesTitle: "Explore our campuses",
    campusesVideoLabel: "Watch campus video",
    careerOpportunitiesTitle: "Career Opportunities",
    certificationsRowTitle: "Accreditations",
    certificationsTitle: "Accreditations and Certifications",
    ctaButton: "Apply Now",
    ctaTitle: "Request Information",
    curriculumButton: "Download study plan",
    curriculumTitle: "What You Will Learn",
    externshipHoursLabel: "Hours",
    externshipPartnerLabel: "Partner",
    externshipTitle: "Externship",
    faqTitle: "Frequently asked questions",
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
    overviewTitle: "Program Overview",
    programBenefitsTitle: "Program Benefits",
    relatedProgramsAction: "Explore program",
    relatedProgramsTitle: "Related programs",
    sectionViewMore: "Learn more",
    studentSupportTitle: "Student Support",
    studyAt: "Study at",
    whyStudyTitle: "Why Study This Program",
  },
  es: {
    admissionsTitle: "Requisitos de admision",
    campusesDescription:
      "Descubre nuestras sedes disponibles y explora los espacios, entornos y recursos que hacen parte de la experiencia estudiantil.",
    campusesTitle: "Conoce nuestros campuses",
    campusesVideoLabel: "Ver video del campus",
    careerOpportunitiesTitle: "Oportunidades laborales",
    certificationsRowTitle: "Acreditaciones",
    certificationsTitle: "Acreditaciones y certificaciones",
    ctaButton: "Inscribete ahora",
    ctaTitle: "Solicita informacion",
    curriculumButton: "Descargar plan de estudios",
    curriculumTitle: "Lo que aprenderas",
    externshipHoursLabel: "Horas",
    externshipPartnerLabel: "Aliado",
    externshipTitle: "Practicas profesionales",
    faqTitle: "Preguntas frecuentes",
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
    overviewTitle: "Resumen del programa",
    programBenefitsTitle: "Beneficios del programa",
    relatedProgramsAction: "Ver programa",
    relatedProgramsTitle: "Programas relacionados",
    sectionViewMore: "Ver mas",
    studentSupportTitle: "Acompanamiento al estudiante",
    studyAt: "Estudia en",
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
