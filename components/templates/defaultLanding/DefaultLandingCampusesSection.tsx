/* eslint-disable @next/next/no-img-element */
import type { BrandCampus } from "@/lib/data";
import {
  landingContainerClass,
  landingSectionSoftClass,
  landingVideoFrameClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type Props = {
  eyebrow: string;
  campuses: BrandCampus[];
  campusFilters?: string[];
  title: string;
  description: string;
  videoLabel: string;
  primaryColor: string;
  primaryTextColor: string;
  isDirectVideoUrl: (url?: string) => boolean;
};

export default function DefaultLandingCampusesSection({
  eyebrow,
  campuses,
  campusFilters = [],
  title,
  description,
  videoLabel,
  primaryColor,
  primaryTextColor,
  isDirectVideoUrl,
}: Props) {
  const normalizeValue = (value?: string) =>
    value
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") || "";

  const getPrimaryCampusFragment = (value?: string) =>
    normalizeValue(value)
      .split(/[,(]/)[0]
      ?.trim() || "";

  const getMeaningfulTokens = (value?: string) =>
    normalizeValue(value)
      .split(/[^a-z0-9]+/)
      .filter(
        (token) =>
          token.length > 2 &&
          !["campus", "texas", "southwest", "northeast"].includes(token),
      );

  const normalizedFilters = campusFilters
    .map((campus) => normalizeValue(campus))
    .filter(Boolean);

  const visibleCampuses =
    normalizedFilters.length > 0
      ? campuses.filter((campus) => {
          const campusName = normalizeValue(campus.name);
          const campusLocation = normalizeValue(campus.location);
          const campusPrimary = getPrimaryCampusFragment(campus.name);
          const campusSearch = `${campusName} ${campusLocation}`.trim();
          const campusTokens = new Set(getMeaningfulTokens(campusSearch));

          return normalizedFilters.some(
            (filter) => {
              const filterPrimary = getPrimaryCampusFragment(filter);
              const filterTokens = getMeaningfulTokens(filter);

              if (
                campusName.includes(filter) ||
                filter.includes(campusName) ||
                campusLocation.includes(filter) ||
                filter.includes(campusLocation)
              ) {
                return true;
              }

              if (
                filterPrimary &&
                campusPrimary &&
                (filterPrimary === campusPrimary ||
                  campusSearch.includes(filterPrimary))
              ) {
                return true;
              }

              return (
                filterTokens.length > 0 &&
                filterTokens.every((token) => campusTokens.has(token))
              );
            },
          );
        })
      : campuses;

  if (!visibleCampuses.length) {
    return null;
  }

  const isSingleCampus = visibleCampuses.length === 1;

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          centered
        />

        <div className={isSingleCampus ? "grid gap-6" : "grid gap-6 lg:grid-cols-2"}>
          {visibleCampuses.map((campus, index) => (
            <article
              key={`${campus.name || "campus"}-${index}`}
              className={`rounded-3xl border border-[var(--landing-primary-light)] bg-[linear-gradient(180deg,#fff,var(--landing-primary-lightest))] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isSingleCampus ? "grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] lg:items-center" : "grid gap-6"
              }`}
            >
              <div className="flex flex-col">
                {campus.name ? (
                  <h3 className="m-0 text-3xl font-bold leading-tight tracking-tight text-[var(--landing-primary-darkest)]">
                    {campus.name}
                  </h3>
                ) : null}
                {campus.location ? (
                  <p
                    className="mt-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em]"
                    style={{ color: primaryColor }}
                  >
                    {campus.location}
                  </p>
                ) : null}
                {campus.description ? (
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    {campus.description}
                  </p>
                ) : null}
                {campus.videoUrl ? (
                  <a
                    href={campus.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-12 items-center justify-center self-start rounded-xl px-5 py-3.5 font-extrabold no-underline shadow-[0_12px_30px_color-mix(in_srgb,var(--landing-primary)_22%,transparent)] transition-opacity hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, var(--landing-primary-dark))`, color: primaryTextColor }}
                  >
                    {videoLabel}
                  </a>
                ) : null}
              </div>

              <div className="grid gap-4">
                {campus.image ? (
                  <div className="relative min-h-[260px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-secondary-lightest))] shadow-xl ring-1 ring-slate-200">
                    <img
                      src={campus.image}
                      alt={campus.name || `Campus ${index + 1}`}
                      className="h-full min-h-[260px] w-full object-cover"
                    />
                  </div>
                ) : campus.videoUrl ? (
                  <div className={landingVideoFrameClass}>
                    {isDirectVideoUrl(campus.videoUrl) ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover"
                      >
                        <source src={campus.videoUrl} />
                      </video>
                    ) : (
                      <iframe
                        src={campus.videoUrl}
                        title={campus.name || `Campus ${index + 1}`}
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
