/* eslint-disable @next/next/no-img-element */
import type { IconTextItem } from "@/lib/data";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import LiveEditableText from "@/components/editor/LiveEditableText";
import { Headphones } from "lucide-react";
import {
  landingCardClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingVideoFrameClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type Props = {
  eyebrow: string;
  eyebrowPath?: string;
  title: string;
  description: string;
  videoUrl: string;
  items: Array<
    IconTextItem & {
      titlePath?: string;
      textPath?: string;
    }
  >;
  isDirectVideoUrl: (url?: string) => boolean;
  liveEdit?: LandingLiveEditConfig;
  titlePath?: string;
  descriptionPath?: string;
};

export default function DefaultLandingSupportSection({
  eyebrow,
  eyebrowPath,
  title,
  description,
  videoUrl,
  items,
  isDirectVideoUrl,
  liveEdit,
  titlePath = "studentSupport.title",
  descriptionPath = "studentSupport.description",
}: Props) {
  const hasSupportVideo = Boolean(videoUrl);

  if (!description && !hasSupportVideo && items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[radial-gradient(circle_at_8%_18%,color-mix(in_srgb,var(--landing-primary)_14%,transparent),transparent_32%),linear-gradient(180deg,#fff,var(--landing-primary-lightest))] py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          eyebrowPath={eyebrowPath}
          title={title}
          description={description}
          centered
          icon={<Headphones className="h-7 w-7" />}
          liveEdit={liveEdit}
          titlePath={titlePath}
          descriptionPath={descriptionPath}
        />

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
                <article
                  className={`${landingCardClass} bg-[linear-gradient(180deg,#fff,var(--landing-primary-lightest))]`}
                  key={index}
                >
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="mb-[18px] h-12 w-12 object-contain"
                    />
                  ) : null}
                  <h3 className={landingCardTitleClass}>
                    {item.titlePath ? (
                      <LiveEditableText
                        path={item.titlePath}
                        value={item.title || ""}
                        liveEdit={liveEdit}
                        singleLine
                      />
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className={landingCardTextClass}>
                    {item.textPath ? (
                      <LiveEditableText
                        path={item.textPath}
                        value={item.text || ""}
                        liveEdit={liveEdit}
                      />
                    ) : (
                      item.text
                    )}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
