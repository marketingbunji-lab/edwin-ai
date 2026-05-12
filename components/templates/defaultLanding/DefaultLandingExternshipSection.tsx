import {
  landingCardClass,
  landingCardGridClass,
  landingCardTitleClass,
  landingContainerClass,
  landingSectionDescriptionClass,
  landingSectionHeaderClass,
  landingSectionKickerClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
} from "./classes";

type Props = {
  enabled: boolean;
  title: string;
  description: string;
  hours: string;
  partners: string[];
};

export default function DefaultLandingExternshipSection({
  enabled,
  title,
  description,
  hours,
  partners,
}: Props) {
  const validPartners = partners.filter((partner) => partner.trim());

  if (!enabled && !title && !description && !hours && validPartners.length === 0) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderClass}>
          {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
          {description ? (
            <p className={landingSectionDescriptionClass}>{description}</p>
          ) : null}
        </div>

        <div className={landingCardGridClass}>
          {hours ? (
            <article className={landingCardClass}>
              <p className={landingSectionKickerClass}>Hours</p>
              <h3 className={landingCardTitleClass}>{hours}</h3>
            </article>
          ) : null}

          {validPartners.map((partner, index) => (
            <article className={landingCardClass} key={`${partner}-${index}`}>
              <p className={landingSectionKickerClass}>Partner</p>
              <h3 className={landingCardTitleClass}>{partner}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
