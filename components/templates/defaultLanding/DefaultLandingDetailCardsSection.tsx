import {
  landingCardClass,
  landingCardGridClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingPrimaryButtonClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import { Banknote, BookOpenCheck, Hammer } from "lucide-react";

type SectionItem = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  items: SectionItem[];
  soft?: boolean;
  variant?: "default" | "secondary";
  downloadUrl?: string;
  buttonUrl?: string;
  buttonLabel?: string;
  viewMoreLabel?: string;
  liveEdit?: LandingLiveEditConfig;
  titlePath?: string;
  descriptionPath?: string;
};

export default function DefaultLandingDetailCardsSection({
  eyebrow,
  title,
  description,
  items,
  soft = false,
  variant = "default",
  downloadUrl = "",
  buttonUrl = "",
  buttonLabel = "Descargar",
  viewMoreLabel = "Ver mas",
  liveEdit,
  titlePath,
  descriptionPath,
}: Props) {
  const validItems = items.filter(
    (item) =>
      item.title?.trim() ||
      item.description?.trim() ||
      item.image?.trim() ||
      item.url?.trim(),
  );
  const hasRenderableContent = Boolean(
    description.trim() || buttonUrl.trim() || downloadUrl.trim() || validItems.length > 0,
  );
  const resolvedButtonUrl = buttonUrl.trim() || downloadUrl.trim();

  if (!hasRenderableContent) {
    return null;
  }

  const isSecondaryVariant = variant === "secondary";
  const sectionClass = isSecondaryVariant
    ? "relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--landing-secondary-light)_52%,transparent),transparent_34%),radial-gradient(circle_at_86%_8%,color-mix(in_srgb,var(--landing-secondary-lightest)_70%,transparent),transparent_30%),linear-gradient(135deg,var(--landing-secondary-lightest)_0%,#fff_58%,var(--landing-page-bg)_100%)] py-24 md:py-32"
    : soft
      ? "relative overflow-hidden bg-[radial-gradient(circle_at_85%_18%,color-mix(in_srgb,var(--landing-secondary)_22%,transparent),transparent_34%),linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-page-bg))] py-24 md:py-32"
      : "relative overflow-hidden bg-[linear-gradient(180deg,#fff,var(--landing-page-bg))] py-24 md:py-32";
  const resolvedEyebrow = eyebrow || (isSecondaryVariant
    ? "Financial support"
    : soft
      ? "Learning experience"
      : "Program content");
  const headerIcon = isSecondaryVariant ? (
    <Banknote className="h-7 w-7" />
  ) : soft ? (
    <Hammer className="h-7 w-7" />
  ) : (
    <BookOpenCheck className="h-7 w-7" />
  );

  return (
    <section className={sectionClass}>
      {isSecondaryVariant ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(var(--landing-secondary-dark) 1px, transparent 1px), linear-gradient(90deg, var(--landing-secondary-dark) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 72%)",
          }}
        />
      ) : null}
      <div
        aria-hidden="true"
        className={`absolute top-10 h-40 w-40 rounded-full blur-3xl ${
          isSecondaryVariant
            ? "right-12 bg-[var(--landing-secondary-light)] opacity-45"
            : soft
            ? "right-8 bg-[var(--landing-secondary)] opacity-15"
            : "left-8 bg-[var(--landing-primary)] opacity-10"
        }`}
      />
      <div className={`${landingContainerClass} relative`}>
        <div>
          <DefaultLandingSectionHeader
            eyebrow={resolvedEyebrow}
            title={title}
            description={description}
            centered
            icon={headerIcon}
            liveEdit={liveEdit}
            titlePath={titlePath}
            descriptionPath={descriptionPath}
          />
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

        {resolvedButtonUrl ? (
          <div className="mt-10 flex justify-center">
            <a
              href={resolvedButtonUrl}
              target="_blank"
              rel="noreferrer"
              className={landingPrimaryButtonClass}
            >
              {buttonLabel}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
