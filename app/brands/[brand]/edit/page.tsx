import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BrandSnapshotCard from "../../../../components/dashboard/BrandSnapshotCard";
import BrandEditor from "../../../../components/editor/BrandEditor";
import { getDashboardLanguage } from "../../../../lib/dashboardI18nServer";
import { getBrandBySlug } from "../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function EditBrandPage({ params }: Props) {
  const language = await getDashboardLanguage();
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}`}
                className="admin-button-secondary admin-button-icon"
                aria-label={language === "en" ? "Back to brand" : "Volver a marca"}
                title={language === "en" ? "Back to brand" : "Volver a marca"}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {brand.name}
                </p>
                <h1 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">
                  {language === "en" ? "Edit brand" : "Editar marca"}
                </h1>
              </div>
            </div>

            <button
              type="submit"
              form="brand-editor-form"
              className="admin-button-primary px-5"
            >
              {language === "en" ? "Save changes" : "Guardar cambios"}
            </button>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.82fr)]">
          <BrandEditor
            mode="edit"
            initialBrand={brand}
            formId="brand-editor-form"
            showSaveActions={false}
            backHref={`/admin/brands/${brandSlug}`}
            backLabel={language === "en" ? "Back to brand" : "Volver a marca"}
          />

          <BrandSnapshotCard
            brand={brand}
            language={language}
            className="xl:sticky xl:top-28 xl:self-start"
          />
        </section>
      </div>
    </main>
  );
}

