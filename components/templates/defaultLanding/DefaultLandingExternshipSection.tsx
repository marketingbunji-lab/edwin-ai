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

type Props = {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  hours: string;
  hoursLabel: string;
  partners: string[];
  partnerLabel: string;
};

export default function DefaultLandingExternshipSection({
  enabled,
  title,
  description,
  image,
  hours,
  hoursLabel,
  partners,
  partnerLabel,
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
                eyebrow="Real-world practice"
                title={title}
                description={description}
              />
            </div>
          )}

          <div>
            {image ? (
              <DefaultLandingSectionHeader
                eyebrow="Real-world practice"
                title={title}
                description={description}
              />
            ) : null}

            <div className={landingCardGridClass}>
              {hours ? (
                <article className={landingCardClass}>
                  <p className={landingSectionKickerClass}>{hoursLabel}</p>
                  <h3 className={landingCardTitleClass}>{hours}</h3>
                </article>
              ) : null}

              {validPartners.map((partner, index) => (
                <article className={landingCardClass} key={`${partner}-${index}`}>
                  <p className={landingSectionKickerClass}>{partnerLabel}</p>
                  <h3 className={landingCardTitleClass}>{partner}</h3>
                </article>
              ))}
            </div>

            {!image && !hours && validPartners.length === 0 && description ? (
              <div className={landingCardClass}>
                <p className={landingCardTextClass}>{description}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
