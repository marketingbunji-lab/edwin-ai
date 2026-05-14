import LandingAccordion from "@/components/ui/LandingAccordion";
import { landingContainerClass } from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type FaqItem = {
  question?: string;
  answer?: string;
};

type Props = {
  eyebrow: string;
  items: FaqItem[];
  title: string;
};

export default function DefaultLandingFaqSection({ eyebrow, items, title }: Props) {
  const validItems = items.filter((item) => item.question?.trim() && item.answer?.trim());
  const accordionItems = validItems.map((item) => ({
    title: item.question?.trim() || "",
    content: item.answer?.trim() || "",
  }));

  if (!validItems.length) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,var(--landing-primary-lightest),#fff)] py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          title={title}
          centered
        />

        <LandingAccordion items={accordionItems} id="default-faq" />
      </div>
    </section>
  );
}
