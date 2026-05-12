/* eslint-disable @next/next/no-img-element */
import type { IconTextItem } from "@/lib/data";
import {
  landingCardClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingIconBadgeClass,
  landingSectionDescriptionClass,
  landingSectionHeaderCenteredClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
  landingVideoFrameClass,
} from "./classes";

type Props = {
  title: string;
  description: string;
  videoUrl: string;
  items: IconTextItem[];
  isDirectVideoUrl: (url?: string) => boolean;
};

export default function DefaultLandingSupportSection({
  title,
  description,
  videoUrl,
  items,
  isDirectVideoUrl,
}: Props) {
  const hasSupportVideo = Boolean(videoUrl);

  if (!title && !description && !hasSupportVideo && items.length === 0) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
          {description ? (
            <p className={landingSectionDescriptionClass}>{description}</p>
          ) : null}
        </div>

        <div
          className={
            hasSupportVideo
              ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
              : "grid gap-4"
          }
        >
          {hasSupportVideo ? (
            <div className={landingVideoFrameClass}>
              {isDirectVideoUrl(videoUrl) ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={videoUrl} />
                </video>
              ) : (
                <iframe
                  src={videoUrl}
                  title={title}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              )}
            </div>
          ) : null}

          {items.length > 0 ? (
            <div
              className={
                hasSupportVideo
                  ? "grid gap-4"
                  : "grid gap-4 md:grid-cols-2"
              }
            >
              {items.map((item, index) => (
                <article className={landingCardClass} key={index}>
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="mb-[18px] h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className={landingIconBadgeClass}>{index + 1}</div>
                  )}
                  <h3 className={landingCardTitleClass}>{item.title}</h3>
                  <p className={landingCardTextClass}>{item.text}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
