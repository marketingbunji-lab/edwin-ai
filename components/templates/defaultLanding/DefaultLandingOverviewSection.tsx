/* eslint-disable @next/next/no-img-element */
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionClass,
  landingSectionDescriptionClass,
  landingSectionHeaderClass,
  landingSectionTitleClass,
  landingTwoColumnClass,
} from "./classes";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function DefaultLandingOverviewSection({
  title,
  description,
  image,
}: Props) {
  if (!title && !description && !image) {
    return null;
  }

  return (
    <section className={landingSectionClass}>
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div>
          <div className={landingSectionHeaderClass}>
            {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
            {description ? (
              <p className={landingSectionDescriptionClass}>{description}</p>
            ) : null}
          </div>
        </div>

        {image ? (
          <div className={landingImageFrameClass}>
            <img src={image} alt={title || "Program overview"} className={landingImageClass} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
