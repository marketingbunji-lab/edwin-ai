import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";

type TestimonialItem = {
  name?: string;
  role?: string;
  quote?: string;
  image?: string;
};

type Props = {
  eyebrow: string;
  title: string;
  items: TestimonialItem[];
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingTestimonialsSection({
  eyebrow,
  title,
  items,
  liveEdit,
}: Props) {
  const validItems = items
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) =>
        item.name?.trim() || item.role?.trim() || item.quote?.trim(),
    );

  if (!validItems.length) {
    return null;
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow={eyebrow}
          title={title}
          centered
        />

        <div className={landingCardGridClass}>
          {validItems.map(({ item, index }) => (
            <article className={landingCardClass} key={`${item.name || "testimonial"}-${index}`}>
              {item.quote ? (
                <p className={landingCardTextClass}>
                  <LiveEditableText
                    path={`testimonials.${index}.quote`}
                    value={item.quote}
                    liveEdit={liveEdit}
                  />
                </p>
              ) : null}
              {item.name ? (
                <h3 className={`${landingCardTitleClass} mt-[18px]`}>
                  <LiveEditableText
                    path={`testimonials.${index}.name`}
                    value={item.name}
                    liveEdit={liveEdit}
                    singleLine
                  />
                </h3>
              ) : null}
              {item.role ? (
                <p className={landingCardTextClass}>
                  <LiveEditableText
                    path={`testimonials.${index}.role`}
                    value={item.role}
                    liveEdit={liveEdit}
                    singleLine
                  />
                </p>
              ) : null}
            </article>
          ))}
          <div className="flex min-h-[220px] items-center justify-center empty:hidden">
            <LiveAddItemButton path="testimonials" liveEdit={liveEdit} />
          </div>
        </div>
      </div>
    </section>
  );
}
