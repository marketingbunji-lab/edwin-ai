import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type TestimonialItem = {
  name?: string;
  role?: string;
  quote?: string;
  image?: string;
};

type Props = {
  items: TestimonialItem[];
};

export default function DefaultLandingTestimonialsSection({ items }: Props) {
  const validItems = items.filter(
    (item) => item.name?.trim() || item.role?.trim() || item.quote?.trim(),
  );

  if (!validItems.length) {
    return null;
  }

  return (
    <section className="bg-white py-24 md:py-32">
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow="Community voices"
          title="Student stories"
          centered
        />

        <div className={landingCardGridClass}>
          {validItems.map((item, index) => (
            <article className={landingCardClass} key={`${item.name || "testimonial"}-${index}`}>
              {item.quote ? <p className={landingCardTextClass}>{item.quote}</p> : null}
              {item.name ? (
                <h3 className={`${landingCardTitleClass} mt-[18px]`}>{item.name}</h3>
              ) : null}
              {item.role ? <p className={landingCardTextClass}>{item.role}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
