import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Brush, Shapes, Users } from "lucide-react";
import { getBrandBySlug, getLandingsByBrand } from "@/lib/data";
import { getBrandAgentRecords } from "@/lib/brandAgentRecords";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandJourneyPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const buyerPersonRecords = getBrandAgentRecords(brand.slug, "buyer-person");
  const visualAssets = getBrandAgentRecords(brand.slug, "visual-assets");
  const landings = getLandingsByBrand(brand.slug);
  const publishedLandings = landings.filter(
    (landing) => landing.status === "published",
  );

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_62%)] before:content-[''] dark:border-white/10 dark:bg-slate-950/88 dark:shadow-[0_20px_50px_rgba(2,6,23,0.28)] dark:before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_62%)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/admin/brands/${brand.slug}`}
              className="admin-button-secondary admin-button-icon"
              aria-label="Volver a marca"
              title="Volver a marca"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="admin-panel p-6 sm:p-8">
          <p className="admin-eyebrow">{brand.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
            Journey
          </h1>
          <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
            Esta capa reúne los módulos de activación comercial y de marketing
            para convertir la base de la marca en experiencias, assets y
            captación activa.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/buyer-person`}
              title="Buyer Persona"
              description="Define audiencias, motivaciones y objeciones para que el journey hable con claridad a los perfiles correctos."
              helper={`${buyerPersonRecords.length} perfiles creados`}
              ctaLabel="Ir a buyer persona"
              icon={Users}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/visual-assets`}
              title="Visual Assets"
              description="Organiza los recursos visuales y referencias que activan creatividad, anuncios, piezas y experiencias de marca."
              helper={`${visualAssets.length} assets disponibles`}
              ctaLabel="Ir a visual assets"
              icon={Brush}
            />

            <WorkspaceCard
              href={`/admin/brands/${brand.slug}/landings`}
              title="Landing Activation"
              description="Diseña y publica landings conectadas al journey para convertir tráfico en leads listos para CRM y automatización."
              helper={`${publishedLandings.length}/${landings.length} publicadas`}
              ctaLabel="Ir a landings"
              icon={Shapes}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function WorkspaceCard({
  href,
  title,
  description,
  helper,
  ctaLabel,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  helper: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="admin-panel-soft group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.12)]"
    >
      <div className="admin-icon-tile">
        <Icon className="h-5 w-5" />
      </div>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
        {title}
      </h2>
      <p className="admin-muted mt-3">{description}</p>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {helper}
      </p>
      <p className="mt-5 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
        {ctaLabel}
      </p>
    </Link>
  );
}
