import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { getBrandBySlug, getEditableLandingsByBrand } from "@/lib/data";


type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function PublicBrandLandingsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const landings = getEditableLandingsByBrand(brandSlug).filter(
    (landing) => landing.status === "published",
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Landings publicas
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            {brand.name}
          </h1>
          {brand.description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              {brand.description}
            </p>
          ) : null}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {landings.map((landing) => (
            <article
              key={landing.slug}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {landing.programType || "Landing"}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {landing.title || landing.fullTitle}
              </h2>
              {landing.fullTitle && landing.fullTitle !== landing.title ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {landing.fullTitle}
                </p>
              ) : null}

              <div className="mt-6">
                <Link
                  href={`/landings/${brand.slug}/${landing.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4" />
                  Ver preview
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
