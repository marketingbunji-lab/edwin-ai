/* eslint-disable @next/next/no-img-element */
import LandingAccordion from "@/components/ui/LandingAccordion";
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionClass,
  landingSectionDescriptionClass,
  landingSectionHeaderClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
  landingTwoColumnClass,
} from "./classes";

type AccordionItem = {
  title: string;
  content: string;
};

type Props = {
  brandName: string;
  sectionId: string;
  title: string;
  description: string;
  image: string;
  logo: string;
  heroTitle: string;
  items: AccordionItem[];
};

export default function DefaultLandingWhyStudySection({
  brandName,
  sectionId,
  title,
  description,
  image,
  logo,
  heroTitle,
  items,
}: Props) {
  if (!title && !description && !image && !logo && items.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} className={landingSectionClass}>
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div>
          <div className={landingSectionHeaderClass}>
            <p className={landingSectionKickerClass}>{brandName}</p>
            {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
            {description ? (
              <p className={landingSectionDescriptionClass}>{description}</p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <LandingAccordion items={items} id={`default-why-study-${sectionId}`} />
          ) : null}
        </div>

        {image || logo ? (
          <div className={landingImageFrameClass}>
            {image ? (
              <img src={image} alt={title || heroTitle} className={landingImageClass} />
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
