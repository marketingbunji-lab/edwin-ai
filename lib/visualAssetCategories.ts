export type BrandAssetImageCategory =
  | "logos"
  | "certifications"
  | "lifestyleImages"
  | "campusImages"
  | "studentLifeImages"
  | "classroomImages"
  | "facultyImages"
  | "graduationImages"
  | "careerSuccessImages"
  | "communityImages"
  | "diversityImages"
  | "eventImages"
  | "facilityImages"
  | "testimonialImages"
  | "videos";

export type ProgramAssetImageCategory =
  | "heroImages"
  | "lifestyleImages"
  | "handsOnTrainingImages"
  | "classroomImages"
  | "facultyImages"
  | "careerImages"
  | "testimonialImages"
  | "galleryImages"
  | "videos"
  | "documents";

export type VisualAssetImageCategory =
  | BrandAssetImageCategory
  | ProgramAssetImageCategory;

export type VisualAssetImageCategoryOption = {
  value: VisualAssetImageCategory;
  label: string;
  description: string;
};

export const brandAssetImageCategories: Array<{
  value: BrandAssetImageCategory;
  label: string;
  description: string;
}> = [
  {
    value: "lifestyleImages",
    label: "Lifestyle images",
    description: "Fotos aspiracionales y emocionales de estudiantes.",
  },
  {
    value: "studentLifeImages",
    label: "Student life images",
    description: "Vida cotidiana, actividades y experiencia estudiantil.",
  },
  {
    value: "campusImages",
    label: "Campus images",
    description: "Arquitectura, espacios institucionales y zonas del campus.",
  },
  {
    value: "classroomImages",
    label: "Classroom images",
    description: "Clases, laboratorios y profesores ensenando.",
  },
  {
    value: "facultyImages",
    label: "Faculty images",
    description: "Profesores, mentores y autoridad academica.",
  },
  {
    value: "graduationImages",
    label: "Graduation images",
    description: "Momentos de logro, ceremonia y culminacion.",
  },
  {
    value: "careerSuccessImages",
    label: "Career success images",
    description: "Graduados en contextos profesionales.",
  },
  {
    value: "communityImages",
    label: "Community images",
    description: "Networking, trabajo en equipo y sentido de pertenencia.",
  },
  {
    value: "diversityImages",
    label: "Diversity images",
    description: "Representacion multicultural e inclusiva.",
  },
  {
    value: "eventImages",
    label: "Event images",
    description: "Ferias, conferencias y ceremonias.",
  },
  {
    value: "facilityImages",
    label: "Facility images",
    description: "Laboratorios, simuladores y equipos especializados.",
  },
  {
    value: "testimonialImages",
    label: "Testimonial images",
    description: "Retratos de estudiantes y egresados.",
  },
  {
    value: "logos",
    label: "Logos",
    description: "Logos y variaciones visuales de la marca.",
  },
  {
    value: "certifications",
    label: "Certifications",
    description: "Acreditaciones, sellos y certificaciones.",
  },
  {
    value: "videos",
    label: "Videos",
    description: "Recursos audiovisuales de marca.",
  },
];

export const programAssetImageCategories: Array<{
  value: ProgramAssetImageCategory;
  label: string;
  description: string;
}> = [
  {
    value: "heroImages",
    label: "Hero images",
    description: "Imagen principal para el hero de la landing del programa.",
  },
  {
    value: "lifestyleImages",
    label: "Lifestyle images",
    description: "Imagen aspiracional conectada con la vida del estudiante.",
  },
  {
    value: "handsOnTrainingImages",
    label: "Hands-on training images",
    description: "Practica, laboratorios, simuladores y entrenamiento aplicado.",
  },
  {
    value: "classroomImages",
    label: "Classroom images",
    description: "Clases, profesores y espacios academicos del programa.",
  },
  {
    value: "facultyImages",
    label: "Faculty images",
    description: "Profesores, mentores y autoridad academica del programa.",
  },
  {
    value: "careerImages",
    label: "Career images",
    description: "Escenarios profesionales relacionados con el programa.",
  },
  {
    value: "testimonialImages",
    label: "Testimonial images",
    description: "Retratos de estudiantes o egresados asociados al programa.",
  },
  {
    value: "galleryImages",
    label: "Gallery images",
    description: "Imagenes complementarias para galerias o bloques secundarios.",
  },
  {
    value: "videos",
    label: "Videos",
    description: "Recursos audiovisuales del programa.",
  },
  {
    value: "documents",
    label: "Documents",
    description: "Brochures, PDFs o recursos documentales del programa.",
  },
];

export function getVisualAssetImageCategories(collectionCategory: string) {
  return collectionCategory === "programs-assets"
    ? programAssetImageCategories
    : brandAssetImageCategories;
}

export function getVisualAssetImageCategoryLabel(
  collectionCategory: string,
  value: string,
) {
  return (
    getVisualAssetImageCategories(collectionCategory).find(
      (item) => item.value === value,
    )?.label || value
  );
}
