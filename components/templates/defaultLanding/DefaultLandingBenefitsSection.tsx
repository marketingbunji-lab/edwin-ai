/* eslint-disable @next/next/no-img-element */
import type { IconTextItem } from "@/lib/data";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";
import LiveEditableText from "@/components/editor/LiveEditableText";
import { Sparkles } from "../templateIcons";
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
  eyebrow?: string;
  eyebrowPath?: string;
  title: string;
  items: Array<
    IconTextItem & {
      titlePath?: string;
      textPath?: string;
    }
  >;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingBenefitsSection({
  eyebrow,
  eyebrowPath,
  title,
  items,
  liveEdit,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--landing-secondary)_20%,transparent),transparent_34%),linear-gradient(180deg,var(--landing-page-bg),#fff)] py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          eyebrowPath={eyebrowPath}
          title={title}
          centered
          icon={<Sparkles className="h-7 w-7" />}
          liveEdit={liveEdit}
          titlePath="benefits.title"
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
            <div className="flex min-h-[220px] items-center justify-center empty:hidden">
              <LiveAddItemButton path="benefits.items" liveEdit={liveEdit} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
