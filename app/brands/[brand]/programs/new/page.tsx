import { notFound } from "next/navigation";
import ProgramDataEditor from "@/components/programs/ProgramDataEditor";
import { getBrandBySlug, type Landing } from "@/lib/data";
import {
  defaultLandingLanguageForBrand,
  getLandingTemplateCopy,
} from "@/lib/landingLanguage";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewBrandProgramPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const language = defaultLandingLanguageForBrand(brand.slug);
  const copy = getLandingTemplateCopy(language, brand.slug);

  const program: Landing = {
    slug: "",
    brand: brand.slug,
    language,
    title: "",
    fullTitle: "",
    sourceWebsite: "",
    catalog: "",
    template: "DefaultLanding",
    status: "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
    logoMode: "dark",
    certifications: {
      enabled: false,
      resolutionText: "",
      items: [],
    },
    hero: {
      eyebrow: `${copy.studyAt} ${brand.shortName ?? brand.name}`,
      highlight: "",
      title: "",
      description: "",
      supportText: "",
      modality: "",
      semesterPrice: "",
      backgroundImage: "",
      overlayColor: brand.primaryColor,
      personImage: "",
    },
    programInfo: [],
    opportunityToWork: {
      title: "",
      subtitle: "",
      image: "",
      items: [],
    },
    whyStudy: {
      title: "",
      description: "",
      image: "",
      items: [],
    },
    externship: {
      enabled: false,
      title: "",
      description: "",
      image: "",
      hours: "",
      partners: [],
    },
    supportSection: {
      title: "",
      videoUrl: "",
      items: [],
    },
    benefits: {
      title: "",
      items: [],
    },
    cta: {
      title: "",
      button: "",
    },
    form: {
      title: copy.formTitle,
      description: copy.formDescription,
      scriptUrl: "",
      scriptCode: "",
      programName: "",
      submitLabel: copy.formSubmitLabel,
    },
    footerScripts: [],
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <ProgramDataEditor
          brand={brand}
          initialProgram={program}
          mode="create"
        />
      </div>
    </main>
  );
}
