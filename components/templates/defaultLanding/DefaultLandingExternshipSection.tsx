import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionKickerClass,
  landingSectionSoftClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";

type Props = {
  eyebrow: string;
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  hours: string;
  hoursLabel: string;
  partners: string[];
  partnerLabel: string;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingExternshipSection({
  eyebrow,
  enabled,
  title,
  description,
  image,
  hours,
  hoursLabel,
  partners,
  partnerLabel,
  liveEdit,
}: Props) {
  const validPartners = partners.filter((partner) => partner.trim());
  const hasRenderableContent = Boolean(
    description.trim() || image.trim() || hours.trim() || validPartners.length > 0,
  );

  if (!enabled && !hasRenderableContent) {
    return null;
  }

  if (!hasRenderableContent) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className={landingTwoColumnClass}>
          {image ? (
            <div className={landingImageFrameClass}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title || "Externship"}
                className={landingImageClass}
              />
            </div>
          ) : (
            <div>
              <DefaultLandingSectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                liveEdit={liveEdit}
                titlePath="externship.title"
                descriptionPath="externship.description"
              />
            </div>
          )}

          <div>
            {image ? (
              <DefaultLandingSectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                liveEdit={liveEdit}
                titlePath="externship.title"
                descriptionPath="externship.description"
              />
            ) : null}

            <div className={landingCardGridClass}>
              {hours ? (
                <article className={landingCardClass}>
                  <p className={landingSectionKickerClass}>{hoursLabel}</p>
                  <h3 className={landingCardTitleClass}>
                    <LiveEditableText
                      path="externship.hours"
                      value={hours}
                      liveEdit={liveEdit}
                      singleLine
                    />
                  </h3>
                </article>
              ) : null}

              {validPartners.map((partner, index) => (
                <article className={landingCardClass} key={`${partner}-${index}`}>
                  <p className={landingSectionKickerClass}>{partnerLabel}</p>
                  <h3 className={landingCardTitleClass}>
                    <LiveEditableText
                      path={`externship.partners.${index}`}
                      value={partner}
                      liveEdit={liveEdit}
                      singleLine
                    />
                  </h3>
                </article>
              ))}
            </div>

            {!image && !hours && validPartners.length === 0 && description ? (
              <div className={landingCardClass}>
                <p className={landingCardTextClass}>
                  <LiveEditableText
                    path="externship.description"
                    value={description}
                    liveEdit={liveEdit}
                  />
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
