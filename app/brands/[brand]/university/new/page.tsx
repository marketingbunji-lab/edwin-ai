import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LibraryBig } from "lucide-react";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function NewUniversityContentBasePage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/admin/brands/${brand.slug}/university`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a University Content Base"
              title="Volver a University Content Base"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <p className="admin-eyebrow">{brand.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            Crear University Content Base
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Esta vista prepara la configuracion singleton del contexto
            institucional para que luego quede alineada con programas, agentes y
            narrativa de marca.
          </p>

          <div className="admin-empty-state mt-8">
            <div className="admin-icon-tile mx-auto">
              <LibraryBig className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-5">University Content Base</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Pagina de creacion lista
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-2xl">
              Esta subruta ya existe dentro del flujo. El siguiente paso natural
              es conectar un editor estructurado para la base institucional
              unica de la marca.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
