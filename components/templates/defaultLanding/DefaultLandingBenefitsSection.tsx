/* eslint-disable @next/next/no-img-element */
import type { IconTextItem } from "@/lib/data";
import { Sparkles } from "lucide-react";
import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingIconBadgeClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type Props = {
  eyebrow: string;
  title: string;
  items: IconTextItem[];
};

export default function DefaultLandingBenefitsSection({
  eyebrow,
  title,
  items,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--landing-secondary)_20%,transparent),transparent_34%),linear-gradient(180deg,var(--landing-page-bg),#fff)] py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          title={title}
          centered
          icon={<Sparkles className="h-7 w-7" />}
        />

        {items.length > 0 ? (
          <div className={landingCardGridClass}>
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
