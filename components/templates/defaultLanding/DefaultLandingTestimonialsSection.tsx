import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingSectionHeaderCenteredClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
} from "./classes";

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
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          <h2 className={landingSectionTitleClass}>Student stories</h2>
        </div>

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
