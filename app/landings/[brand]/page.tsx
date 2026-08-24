import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye } from "lucide-react";
import { getBrandBySlug, getEditableLandingsByBrand } from "@/lib/data";

function getPublicLandingName(title: string, fullTitle?: string) {
  const candidate = (title || fullTitle || "").trim();
  return candidate.split("|")[0]?.trim() || candidate;
}

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

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-[linear-gradient(90deg,rgba(235,240,255,0.92),rgba(232,245,255,0.92))]">
                <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-6 py-4">Programa</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Modalidad</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {landings.map((landing) => (
                  <tr
                    key={landing.slug}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-semibold text-slate-950">
                        {getPublicLandingName(
                          landing.title || "",
                          landing.fullTitle,
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top text-sm text-slate-700">
                      {landing.programType || "Landing"}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                        {landing.hero?.modality || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <div className="flex flex-nowrap items-center justify-end gap-2">
                        <Link
                          href={`/landings/${brand.slug}/${landing.slug}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
                          aria-label="Ver landing"
                          title="Ver landing"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <a
                          href={`/api/export-zip/${brand.slug}/${landing.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          title="Descargar ZIP"
                        >
                          <Download className="h-4 w-4" />
                          ZIP
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
