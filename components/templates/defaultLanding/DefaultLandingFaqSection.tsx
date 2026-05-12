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
};

export default function DefaultLandingFaqSection({ items }: Props) {
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
          <h2 className={landingSectionTitleClass}>Frequently asked questions</h2>
        </div>

        <LandingAccordion items={accordionItems} id="default-faq" />
      </div>
    </section>
  );
}
