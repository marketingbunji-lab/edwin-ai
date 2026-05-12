import LandingAccordion from "@/components/ui/LandingAccordion";
import {
  landingContainerClass,
  landingSectionClass,
  landingSectionHeaderCenteredClass,
  landingSectionTitleClass,
} from "./classes";

type FaqItem = {
  question?: string;
  answer?: string;
};

type Props = {
  items: FaqItem[];
  title: string;
};

export default function DefaultLandingFaqSection({ items, title }: Props) {
  const validItems = items.filter((item) => item.question?.trim() && item.answer?.trim());
  const accordionItems = validItems.map((item) => ({
    title: item.question?.trim() || "",
    content: item.answer?.trim() || "",
  }));

  if (!validItems.length) {
    return null;
  }

  return (
    <section className={landingSectionClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          <h2 className={landingSectionTitleClass}>{title}</h2>
        </div>

        <LandingAccordion items={accordionItems} id="default-faq" />
      </div>
    </section>
  );
}
