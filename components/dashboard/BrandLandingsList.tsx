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
      <div className="admin-panel p-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-950 dark:text-slate-50">
            Buscar landings
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por programa, slug, modalidad, jornada o estado"
              className="admin-input pl-11 pr-12"
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

        <p className="admin-muted mt-3">
          {filteredLandings.length} de {landings.length} landing
          {landings.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredLandings.length === 0 ? (
        <div className="admin-empty-state text-slate-500 dark:text-slate-400">
          No encontramos landings con esa busqueda.
        </div>
      ) : (
        <div className="space-y-10">
          {groupedLandings.map((group) => (
            <section key={group.programType}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                    {group.programType}
                  </h2>
                  <p className="admin-muted">
                    {group.items.length} landing
                    {group.items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100">
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
