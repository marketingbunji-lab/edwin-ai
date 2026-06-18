/* eslint-disable @next/next/no-img-element */
import LandingAccordion from "@/components/ui/LandingAccordion";
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import EditableImageSlot, { editableImageClass } from "./EditableImageSlot";
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";

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
  liveEdit,
}: Props) {
  const hasProgramContent = Boolean(
    title.trim() || description.trim() || image.trim() || items.length > 0,
  );

  if (!hasProgramContent) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="bg-white py-24 md:py-32"
    >
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
                data-live-image-path={liveEdit?.enabled ? "whyStudy.image" : undefined}
                data-live-image-label="Imagen de por que estudiar"
                data-live-image-value={image}
                title={liveEdit?.enabled ? "Click para reemplazar esta imagen" : undefined}
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
