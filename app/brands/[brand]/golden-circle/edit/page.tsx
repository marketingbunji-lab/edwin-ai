import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Orbit } from "lucide-react";
import { getBrandBySlug } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function EditGoldenCirclePage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky z-20 mb-8 overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/admin/brands/${brand.slug}/golden-circle`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a Golden Circle"
              title="Volver a Golden Circle"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            Editar Golden Circle
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Este espacio queda preparado para refinar la narrativa del Why,
            How y What dentro del mismo sistema visual y de rutas del dashboard.
          </p>

          <div className="admin-empty-state mt-8">
            <div className="admin-icon-tile mx-auto">
              <Orbit className="h-5 w-5" />
            </div>
            <p className="admin-eyebrow mt-5">Golden Circle</p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              PÃ¡gina de ediciÃ³n lista
            </h2>
            <p className="admin-muted mx-auto mt-3 max-w-2xl">
              Ya puedes navegar a esta subruta como parte del flujo de marca.
              El siguiente paso serÃ­a conectar un editor persistente para
              actualizar el marco estratÃ©gico del Golden Circle.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
