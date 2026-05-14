/* eslint-disable @next/next/no-img-element */
import LandingAccordion from "@/components/ui/LandingAccordion";
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type AccordionItem = {
  title: string;
  content: string;
};

type Props = {
  brandName: string;
  eyebrow: string;
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
  eyebrow,
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
    <section
      id={sectionId}
      className="bg-white py-24 md:py-32"
    >
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div className="relative pl-6 before:absolute before:left-0 before:top-1 before:h-24 before:w-1 before:rounded-full before:bg-[linear-gradient(180deg,var(--landing-secondary),var(--landing-primary-light))]">
          <DefaultLandingSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />

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
