"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import LandingCard from "./LandingCard";
import type { LandingCardData } from "./LandingCard";

export type BrandLandingListItem = LandingCardData & {
  programType: string;
};

type Props = {
  landings: BrandLandingListItem[];
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSearchableText(landing: BrandLandingListItem) {
  return normalizeSearchText(
    [
      landing.title,
      landing.fullTitle,
      landing.slug,
      landing.template,
      landing.status,
      landing.schedule,
      landing.hero?.modality,
      landing.programType,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function groupLandingsByProgramType(landings: BrandLandingListItem[]) {
  const groups = new Map<string, BrandLandingListItem[]>();

  for (const landing of landings) {
    const programType = landing.programType || "Sin tipo";
    const group = groups.get(programType) ?? [];

    group.push(landing);
    groups.set(programType, group);
  }

  return Array.from(groups.entries()).map(([programType, items]) => ({
    programType,
    items,
  }));
}

export default function BrandLandingsList({ landings }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchText(query.trim());

  const filteredLandings = useMemo(() => {
    if (!normalizedQuery) return landings;

    return landings.filter((landing) =>
      getSearchableText(landing).includes(normalizedQuery),
    );
  }, [landings, normalizedQuery]);

  const groupedLandings = useMemo(
    () => groupLandingsByProgramType(filteredLandings),
    [filteredLandings],
  );

  return (
    <div className="space-y-8">
      <div className="border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-900 dark:text-slate-50">
            Buscar landings
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por programa, slug, modalidad, jornada o estado"
              className="w-full border border-gray-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Limpiar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </label>

        <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
          {filteredLandings.length} de {landings.length} landing
          {landings.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredLandings.length === 0 ? (
        <div className="border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No encontramos landings con esa busqueda.
        </div>
      ) : (
        <div className="space-y-10">
          {groupedLandings.map((group) => (
            <section key={group.programType}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                    {group.programType}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {group.items.length} landing
                    {group.items.length === 1 ? "" : "s"}
                  </p>
                </div>

                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    {group.items.length}
                  </span>
                </div>

              <div className="grid gap-6 border border-none dark:border-none md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((landing) => (
                  <LandingCard key={landing.slug} landing={landing} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
