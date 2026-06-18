import LandingAccordion from "@/components/ui/LandingAccordion";
import { landingContainerClass } from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";

type FaqItem = {
  question?: string;
  answer?: string;
};

type Props = {
  eyebrow: string;
  items: FaqItem[];
  title: string;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingFaqSection({
  eyebrow,
  items,
  title,
  liveEdit,
}: Props) {
  const validItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.question?.trim() && item.answer?.trim());
  const accordionItems = validItems.map(({ item, index }) => ({
    title: item.question?.trim() || "",
    content: item.answer?.trim() || "",
    titlePath: `faq.${index}.question`,
    contentPath: `faq.${index}.answer`,
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

        <LandingAccordion
          items={accordionItems}
          id="default-faq"
          liveEdit={liveEdit}
        />

        <div className="mt-8 flex justify-center empty:hidden">
          <LiveAddItemButton path="faq" liveEdit={liveEdit} />
        </div>
      </div>
    </section>
  );
}
