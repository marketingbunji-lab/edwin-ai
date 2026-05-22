import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Orbit, Pencil, Plus } from "lucide-react";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandGoldenCirclePage({ params }: Props) {
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
                href={`/admin/brands/${brand.slug}/golden-circle/edit`}
                className="admin-button-secondary"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
              <Link
                href={`/admin/brands/${brand.slug}/golden-circle/new`}
                className="admin-button-primary"
              >
                <Plus className="h-4 w-4" />
                Crear Golden Circle
              </Link>
            </div>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <p className="admin-eyebrow">{brand.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            Golden Circle
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Estructura el propósito institucional desde el <strong>Why</strong>,
            el <strong>How</strong> y el <strong>What</strong> para alinear el
            lenguaje de marca, la narrativa comercial y el crecimiento.
          </p>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            <GoldenCirclePillar
              title="Why"
              description="El propósito central que moviliza a la institución y conecta emocionalmente con su audiencia."
            />
            <GoldenCirclePillar
              title="How"
              description="La manera en la que la marca convierte ese propósito en una experiencia educativa y diferencial."
            />
            <GoldenCirclePillar
              title="What"
              description="La expresión tangible de ese propósito en programas, servicios, activos y puntos de contacto."
            />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Link
              href={`/admin/brands/${brand.slug}/golden-circle/new`}
              className="admin-panel-soft group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
            >
              <div className="admin-icon-tile">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Crear Golden Circle
              </h2>
              <p className="admin-muted mt-3">
                Inicia la definición del Why, How y What para dejar lista la
                base narrativa de la marca.
              </p>
              <p className="mt-5 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                Abrir modo creación
              </p>
            </Link>

            <Link
              href={`/admin/brands/${brand.slug}/golden-circle/edit`}
              className="admin-panel-soft group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
            >
              <div className="admin-icon-tile">
                <Pencil className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Editar Golden Circle
              </h2>
              <p className="admin-muted mt-3">
                Refina la narrativa estratégica para que comunicación,
                diferenciación y crecimiento sigan alineados.
              </p>
              <p className="mt-5 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                Abrir modo edición
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoldenCirclePillar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="admin-panel-soft p-5">
      <div className="admin-icon-tile">
        <Orbit className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      <p className="admin-muted mt-3">{description}</p>
    </div>
  );
}
