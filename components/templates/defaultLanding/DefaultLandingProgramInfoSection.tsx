import type { ProgramInfoItem } from "@/lib/data";
import {
  landingCardClass,
  landingCardGridClass,
  landingCardTitleClass,
  landingContainerClass,
  landingSectionClass,
  landingSectionKickerClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: ProgramInfoItem[];
};

export default function DefaultLandingProgramInfoSection({
  eyebrow = "Program snapshot",
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
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          centered
        />

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
