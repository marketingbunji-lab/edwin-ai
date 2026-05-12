import type { ProgramInfoItem } from "@/lib/data";
import {
  landingCardClass,
  landingCardGridClass,
  landingCardTitleClass,
  landingContainerClass,
  landingSectionClass,
  landingSectionDescriptionClass,
  landingSectionHeaderCenteredClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
} from "./classes";

type Props = {
  title?: string;
  description?: string;
  items: ProgramInfoItem[];
};

export default function DefaultLandingProgramInfoSection({
  title = "Program details",
  description = "",
  items,
}: Props) {
  const validItems = items.filter((item) => item.label?.trim() && item.value?.trim());

  if (!validItems.length) {
    return null;
  }

  return (
    <section className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
          {description ? (
            <p className={landingSectionDescriptionClass}>{description}</p>
          ) : null}
        </div>

        <div className={landingCardGridClass}>
          {validItems.map((item, index) => (
            <article className={landingCardClass} key={`${item.label}-${index}`}>
              <p className={landingSectionKickerClass}>{item.label}</p>
              <h3 className={landingCardTitleClass}>{item.value}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
