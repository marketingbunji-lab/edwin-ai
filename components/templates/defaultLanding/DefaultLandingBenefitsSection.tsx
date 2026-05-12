/* eslint-disable @next/next/no-img-element */
import type { IconTextItem } from "@/lib/data";
import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingIconBadgeClass,
  landingSectionClass,
  landingSectionHeaderCenteredClass,
  landingSectionTitleClass,
} from "./classes";

type Props = {
  title: string;
  items: IconTextItem[];
};

export default function DefaultLandingBenefitsSection({
  title,
  items,
}: Props) {
  if (!title && items.length === 0) {
    return null;
  }

  return (
    <section className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
        </div>

        {items.length > 0 ? (
          <div className={landingCardGridClass}>
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
    </section>
  );
}
