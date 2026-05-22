import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LibraryBig, Pencil, Plus } from "lucide-react";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandUniversityContentBasePage({
  params,
}: Props) {
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
              href={`/admin/brands/${brand.slug}/knowledge-base`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a knowledge base"
              title="Volver a knowledge base"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/admin/brands/${brand.slug}/university/edit`}
                className="admin-button-secondary"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
              <Link
                href={`/admin/brands/${brand.slug}/university/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                Configurar seccion
              </Link>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <p className="admin-eyebrow">{brand.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            University Content Base
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Esta seccion funciona como una configuracion singleton para capturar
            el contexto institucional que luego alimenta decisiones de
            contenido, narrativa y agentes educativos.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="admin-panel-soft p-6">
              <div className="admin-icon-tile">
                <LibraryBig className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Singleton Content
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Una sola base institucional activa
              </h2>
              <p className="admin-muted mt-3">
                A diferencia de una coleccion, esta experiencia esta pensada
                para mantener un unico item vivo que concentre el contexto
                transversal de la universidad.
              </p>
            </div>

            <div className="admin-panel-soft p-6">
              <p className="admin-eyebrow">Estado actual</p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Flujo listo para conectar
              </h2>
              <p className="admin-muted mt-3">
                La ruta principal, creacion y edicion ya existen. El siguiente
                paso natural es conectar aqui un editor persistente para la base
                institucional.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/brands/${brand.slug}/university/new`}
                  className="admin-button-primary"
                >
                  <Plus className="h-4 w-4" />
                  Crear base institucional
                </Link>
                <Link
                  href={`/admin/brands/${brand.slug}/university/edit`}
                  className="admin-button-secondary"
                >
                  <Pencil className="h-4 w-4" />
                  Editar base institucional
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
