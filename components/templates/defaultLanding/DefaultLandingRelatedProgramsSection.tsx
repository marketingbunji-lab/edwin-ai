/* eslint-disable @next/next/no-img-element */
import {
  landingCardClass,
  landingCardGridClass,
  landingCardTitleClass,
  landingContainerClass,
  landingSectionClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type RelatedProgram = {
  title?: string;
  url?: string;
  image?: string;
};

type Props = {
  items: RelatedProgram[];
  title: string;
  actionLabel: string;
};

export default function DefaultLandingRelatedProgramsSection({
  items,
  title,
  actionLabel,
}: Props) {
  const validItems = items.filter((item) => item.title?.trim() || item.image?.trim());

  if (!validItems.length) {
    return null;
  }

  return (
    <section className={landingSectionClass}>
      <div className={landingContainerClass}>
        <DefaultLandingSectionHeader
          eyebrow="Explore more"
          title={title}
          centered
        />

        <div className={landingCardGridClass}>
          {validItems.map((item, index) => {
            const cardImage = item.image?.trim() || "";

            return (
            <article className={landingCardClass} key={`${item.title || "program"}-${index}`}>
              {cardImage ? (
                <img
                  src={cardImage}
                  alt={item.title}
                  className="mb-[18px] h-[180px] w-full overflow-hidden rounded-3xl object-cover shadow-xl ring-1 ring-slate-200"
                />
              ) : null}
              {item.title ? <h3 className={landingCardTitleClass}>{item.title}</h3> : null}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex font-bold text-slate-900 no-underline"
                >
                  {actionLabel}
                </a>
              ) : null}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
