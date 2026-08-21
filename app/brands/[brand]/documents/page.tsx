import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandDocumentsWorkspace from "@/components/documents/BrandDocumentsWorkspace";
import { getVisualAssetsByCategory } from "@/lib/brandAgentRecords";
import { getDashboardTranslator } from "@/lib/dashboardI18n";
import { getDashboardLanguage } from "@/lib/dashboardI18nServer";
import { getBrandBySlug, getProgramDataByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandDocumentsPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const t = getDashboardTranslator(language);
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const formId = `documents-form-${brand.slug}`;
  const brandAssets = getVisualAssetsByCategory(brand.slug, "brand-assets");
  const coverAsset = brandAssets.find((asset) => asset.url.trim());
  const programs = getProgramDataByBrand(brand.slug);
  const programTypes = Array.from(
    new Set(
      programs
        .map((program) =>
          (program.programType || program.degreeLevel || "").trim(),
        )
        .filter(Boolean),
    ),
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/knowledge-base`}
                className="admin-button-secondary admin-button-icon"
                aria-label={t("documentsPage.backToKnowledgeBase")}
                title={t("documentsPage.backToKnowledgeBase")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {t("documentsPage.title")}
                </h1>
              </div>
            </div>

            <button
              type="submit"
              form={formId}
              className="admin-button-primary px-5"
            >
              {t("documentsPage.save")}
            </button>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <BrandDocumentsWorkspace
            formId={formId}
            brandSlug={brand.slug}
            initialDocuments={brand.documents}
            initialIdentityManual={brand.identityManual}
            initialWebsite={brand.officialWebsite}
            universityName={brand.name}
            universityOfficialName={
              brand.siteName || brand.shortName || brand.name
            }
            universitySummary={brand.description || brand.abstract || ""}
            universityLogo={brand.logos?.light || brand.logo}
            brandCoverImage={coverAsset?.url || ""}
            brandAssetCount={brandAssets.length}
            programCount={programs.length}
            programTypes={programTypes}
          />
        </section>
      </div>
    </main>
  );
}
