import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingPrimaryButtonClass,
  landingSectionClass,
  landingSectionDescriptionClass,
  landingSectionHeaderCenteredClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
} from "./classes";

type SectionItem = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

type Props = {
  title: string;
  description: string;
  items: SectionItem[];
  soft?: boolean;
  downloadUrl?: string;
  buttonLabel?: string;
  viewMoreLabel?: string;
};

export default function DefaultLandingDetailCardsSection({
  title,
  description,
  items,
  soft = false,
  downloadUrl = "",
  buttonLabel = "Descargar",
  viewMoreLabel = "Ver mas",
}: Props) {
  const validItems = items.filter(
    (item) => item.title?.trim() || item.description?.trim() || item.image?.trim(),
  );
  const hasRenderableContent = Boolean(
    description.trim() || downloadUrl.trim() || validItems.length > 0,
  );

  if (!hasRenderableContent) {
    return null;
  }

  return (
    <section className={soft ? landingSectionSoftClass : landingSectionClass}>
      <div className={landingContainerClass}>
        <div className={landingSectionHeaderCenteredClass}>
          {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
          {description ? (
            <p className={landingSectionDescriptionClass}>{description}</p>
          ) : null}
          {downloadUrl ? (
            <div className="mt-6">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={landingPrimaryButtonClass}
              >
                {buttonLabel}
              </a>
            </div>
          ) : null}
        </div>

        {validItems.length > 0 ? (
          <div className={landingCardGridClass}>
            {validItems.map((item, index) => (
              <article
                className={`${landingCardClass} relative overflow-hidden`}
                key={`${item.title || "item"}-${index}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-1 w-full bg-[linear-gradient(90deg,var(--landing-secondary),var(--landing-primary-light))]"
                />
                {item.title ? <h3 className={landingCardTitleClass}>{item.title}</h3> : null}
                {item.description ? <p className={landingCardTextClass}>{item.description}</p> : null}
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex font-bold text-[var(--landing-primary-dark)] no-underline"
                  >
                    {viewMoreLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
