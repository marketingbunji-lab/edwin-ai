/* eslint-disable @next/next/no-img-element */
import type { BrandCampus } from "@/lib/data";
import {
  landingContainerClass,
  landingSectionDescriptionClass,
  landingSectionHeaderCenteredClass,
  landingSectionKickerClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
  landingVideoFrameClass,
} from "./classes";

type Props = {
  brandName: string;
  campuses: BrandCampus[];
  title: string;
  description: string;
  videoLabel: string;
  primaryColor: string;
  primaryTextColor: string;
  isDirectVideoUrl: (url?: string) => boolean;
};

export default function DefaultLandingCampusesSection({
  brandName,
  campuses,
  title,
  description,
  videoLabel,
  primaryColor,
  primaryTextColor,
  isDirectVideoUrl,
}: Props) {
  if (!campuses.length) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          <p className={landingSectionKickerClass}>{brandName}</p>
          <h2 className={landingSectionTitleClass}>{title}</h2>
          <p className={landingSectionDescriptionClass}>
            {description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {campuses.map((campus, index) => (
            <article
              key={`${campus.name || "campus"}-${index}`}
              className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(17,24,39,0.08)]"
            >
              <div className="flex flex-col">
                {campus.name ? (
                  <h3 className="m-0 text-[clamp(1.4rem,3vw,2rem)] font-black leading-[1.12] text-slate-900">
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
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {campus.description}
                  </p>
                ) : null}
                {campus.videoUrl ? (
                  <a
                    href={campus.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-12 items-center justify-center self-start rounded-xl px-5 py-3.5 font-extrabold no-underline transition-opacity hover:opacity-90"
                    style={{ background: primaryColor, color: primaryTextColor }}
                  >
                    {videoLabel}
                  </a>
                ) : null}
              </div>

              <div className="grid gap-4">
                {campus.image ? (
                  <div className="relative min-h-[260px] overflow-hidden rounded-[20px] bg-[var(--landing-soft-bg)]">
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
