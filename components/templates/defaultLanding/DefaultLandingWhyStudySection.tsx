/* eslint-disable @next/next/no-img-element */
import LandingAccordion from "@/components/ui/LandingAccordion";
import { BadgeCheck, Globe2 } from "lucide-react";
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import EditableImageSlot, { editableImageClass } from "./EditableImageSlot";
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";

type AccordionItem = {
  title: string;
  content: string;
  titlePath?: string;
  contentPath?: string;
};

type Props = {
  brandName: string;
  eyebrow: string;
  eyebrowPath?: string;
  sectionId: string;
  title: string;
  description: string;
  image: string;
  logo: string;
  heroTitle: string;
  items: AccordionItem[];
  cards?: Array<{
    title?: string;
    icon?: "badge-check" | "globe";
    items?: string[];
  }>;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingWhyStudySection({
  brandName,
  eyebrow,
  eyebrowPath,
  sectionId,
  title,
  description,
  image,
  logo,
  heroTitle,
  items,
  cards = [],
  liveEdit,
}: Props) {
  const validCards = cards.filter(
    (card) => card.title?.trim() || card.items?.some((item) => item.trim()),
  );
  const hasProgramContent = Boolean(
    title.trim() ||
    description.trim() ||
    image.trim() ||
    items.length > 0 ||
    validCards.length > 0,
  );

  if (!hasProgramContent) {
    return null;
  }

  if (validCards.length > 0) {
    return (
      <section className="bg-[linear-gradient(180deg,var(--landing-page-bg),var(--landing-primary-lightest))] py-24 md:py-32">
        <div className={landingContainerClass}>
          <DefaultLandingSectionHeader
            eyebrow={eyebrow}
            eyebrowPath={eyebrowPath}
            title={title}
            description={description}
            centered
            liveEdit={liveEdit}
            titlePath="whyStudy.title"
            descriptionPath="whyStudy.description"
          />

          <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {image || liveEdit?.enabled || logo ? (
              <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,var(--landing-secondary-lightest),var(--landing-primary-lightest))] shadow-[0_24px_70px_-32px_rgba(15,23,42,0.38)] ring-1 ring-[var(--landing-primary-light)] lg:min-h-[620px]">
                {image ? (
                  <img
                    src={image}
                    alt={title || heroTitle}
                    data-live-image-path={
                      liveEdit?.enabled ? "whyStudy.image" : undefined
                    }
                    data-live-image-label="Imagen de por que estudiar"
                    data-live-image-value={image}
                    title={
                      liveEdit?.enabled
                        ? "Click para reemplazar esta imagen"
                        : undefined
                    }
                    className={`absolute inset-0 h-full w-full object-cover ${
                      liveEdit?.enabled ? editableImageClass : ""
                    }`}
                  />
                ) : liveEdit?.enabled ? (
                  <EditableImageSlot
                    path="whyStudy.image"
                    label="Imagen de por que estudiar"
                    className="h-full w-full"
                  />
                ) : logo ? (
                  <img
                    src={logo}
                    alt={brandName}
                    className="absolute inset-0 m-auto h-auto w-[58%] object-contain"
                  />
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-5">
              {validCards.map((card, cardIndex) => {
                const Icon = card.icon === "globe" ? Globe2 : BadgeCheck;
                const cardItems = (card.items ?? []).filter((item) =>
                  item.trim(),
                );

                return (
                  <article
                    key={`${card.title || "card"}-${cardIndex}`}
                    className="rounded-[24px] border border-[var(--landing-primary-light)] bg-white/92 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.32)] backdrop-blur md:p-7"
                  >
                    <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--landing-secondary-lightest),var(--landing-primary-lightest))] text-[var(--landing-primary-darkest)] ring-1 ring-[var(--landing-primary-light)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>

                    {card.title ? (
                      <LiveEditableText
                        as="h3"
                        path={`whyStudy.cards.${cardIndex}.title`}
                        value={card.title}
                        liveEdit={liveEdit}
                        singleLine
                        className="text-xl font-bold tracking-tight text-[var(--landing-primary-darkest)]"
                      />
                    ) : null}

                    {cardItems.length > 0 ? (
                      <ul className="mt-5 space-y-3.5 text-[15px] leading-6 text-slate-600">
                        {cardItems.map((item, itemIndex) => (
                          <li
                            key={`${item}-${itemIndex}`}
                            className="flex items-start gap-3"
                          >
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--landing-secondary-dark)]" />
                            <LiveEditableText
                              path={`whyStudy.cards.${cardIndex}.items.${itemIndex}`}
                              value={item}
                              liveEdit={liveEdit}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="bg-white py-24 md:py-32">
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div className="relative pl-6 before:absolute before:left-0 before:top-1 before:h-24 before:w-1 before:rounded-full before:bg-[linear-gradient(180deg,var(--landing-secondary),var(--landing-primary-light))]">
          <DefaultLandingSectionHeader
            eyebrow={eyebrow}
            eyebrowPath={eyebrowPath}
            title={title}
            description={description}
            liveEdit={liveEdit}
            titlePath="whyStudy.title"
            descriptionPath="whyStudy.description"
          />

          {items.length > 0 ? (
            <LandingAccordion
              items={items}
              id={`default-why-study-${sectionId}`}
              liveEdit={liveEdit}
            />
          ) : null}

          <div className={`${items.length > 0 ? "mt-8" : "mt-6"} empty:hidden`}>
            <LiveAddItemButton path="whyStudy.items" liveEdit={liveEdit} />
          </div>
        </div>

        {image || liveEdit?.enabled || logo ? (
          <div className={landingImageFrameClass}>
            {image ? (
              <img
                src={image}
                alt={title || heroTitle}
                data-live-image-path={
                  liveEdit?.enabled ? "whyStudy.image" : undefined
                }
                data-live-image-label="Imagen de por que estudiar"
                data-live-image-value={image}
                title={
                  liveEdit?.enabled
                    ? "Click para reemplazar esta imagen"
                    : undefined
                }
                className={`${landingImageClass} ${
                  liveEdit?.enabled ? editableImageClass : ""
                }`}
              />
            ) : liveEdit?.enabled ? (
              <EditableImageSlot
                path="whyStudy.image"
                label="Imagen de por que estudiar"
                className="h-full w-full"
              />
            ) : logo ? (
              <img
                src={logo}
                alt={brandName}
                className="h-auto min-h-0 w-[70%] object-contain"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
