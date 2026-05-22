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
import LiveEditableText from "@/components/editor/LiveEditableText";
import { Banknote, BookOpenCheck, Hammer } from "lucide-react";

type SectionItem = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  items?: string[];
  titlePath?: string;
  descriptionPath?: string;
  bulletPath?: string;
};

type Props = {
  eyebrow?: string;
  eyebrowPath?: string;
  title: string;
  description: string;
  items: SectionItem[];
  soft?: boolean;
  variant?: "default" | "secondary" | "secondary-b";
  downloadUrl?: string;
  buttonUrl?: string;
  buttonLabel?: string;
  buttonLabelPath?: string;
  viewMoreLabel?: string;
  liveEdit?: LandingLiveEditConfig;
  titlePath?: string;
  descriptionPath?: string;
};

function splitLabelAndAmount(value = "") {
  const match = value.match(/\$\s?[\d.,]+/);

  if (!match) {
    return {
      label: value.trim(),
      amount: "",
    };
  }

  return {
    label: value.replace(match[0], "").replace(/\s+/g, " ").trim(),
    amount: match[0].replace(/\s+/g, ""),
  };
}

export default function DefaultLandingDetailCardsSection({
  eyebrow,
  eyebrowPath,
  title,
  description,
  items,
  soft = false,
  variant = "default",
  downloadUrl = "",
  buttonUrl = "",
  buttonLabel = "Descargar",
  buttonLabelPath,
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
      item.url?.trim() ||
      item.items?.some((bullet) => bullet.trim()),
  );
  const hasRenderableContent = Boolean(
    description.trim() || buttonUrl.trim() || downloadUrl.trim() || validItems.length > 0,
  );
  const resolvedButtonUrl = buttonUrl.trim() || downloadUrl.trim();

  if (!hasRenderableContent) {
    return null;
  }

  const isSecondaryVariant = variant === "secondary" || variant === "secondary-b";
  const isSecondaryBVariant = variant === "secondary-b";
  const sectionClass = isSecondaryBVariant
    ? "relative overflow-hidden bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--landing-secondary-light)_56%,transparent),transparent_32%),linear-gradient(135deg,var(--landing-secondary-lightest)_0%,#fff_54%,var(--landing-page-bg)_100%)] py-24 md:py-32"
    : isSecondaryVariant
    ? "relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--landing-secondary-light)_52%,transparent),transparent_34%),radial-gradient(circle_at_86%_8%,color-mix(in_srgb,var(--landing-secondary-lightest)_70%,transparent),transparent_30%),linear-gradient(135deg,var(--landing-secondary-lightest)_0%,#fff_58%,var(--landing-page-bg)_100%)] py-24 md:py-32"
    : soft
      ? "relative overflow-hidden bg-[radial-gradient(circle_at_85%_18%,color-mix(in_srgb,var(--landing-secondary)_22%,transparent),transparent_34%),linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-page-bg))] py-24 md:py-32"
      : "relative overflow-hidden bg-[linear-gradient(180deg,#fff,var(--landing-page-bg))] py-24 md:py-32";
  const resolvedEyebrow = eyebrow?.trim() || "";
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
            eyebrowPath={eyebrowPath}
            title={title}
            description={description}
            centered
            icon={resolvedEyebrow ? headerIcon : undefined}
            liveEdit={liveEdit}
            titlePath={titlePath}
            descriptionPath={descriptionPath}
          />
        </div>

        {isSecondaryBVariant && validItems.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {validItems.map((item, index) => {
              const titlePrice = splitLabelAndAmount(item.title);
              const descriptionPrice = splitLabelAndAmount(item.description);
              const isPriceCard =
                index === 0 && titlePrice.amount && descriptionPrice.amount;

              return (
                <article
                  className="rounded-2xl border border-[var(--landing-primary-light)] bg-white/88 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  key={`${item.title || "item"}-${index}`}
                >
                  {isPriceCard ? (
                    <div className="space-y-6">
                      <div>
                        <p className="text-2xl font-bold leading-tight tracking-tight text-slate-950">
                          {descriptionPrice.label}
                        </p>
                        <p className="mt-2 text-4xl font-bold leading-tight tracking-tight text-slate-950">
                          {descriptionPrice.amount}
                        </p>
                      </div>
                      <div className="h-px bg-[var(--landing-primary-light)]" />
                      <div>
                        <p className="text-sm font-semibold leading-6 text-slate-600">
                          {titlePrice.label}
                        </p>
                        <p className="mt-1 text-2xl font-bold leading-tight tracking-tight text-slate-500 line-through decoration-[var(--landing-secondary-dark)] decoration-2">
                          {titlePrice.amount}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.title ? (
                        <h3 className="text-2xl font-bold leading-tight tracking-tight text-slate-950">
                          {item.titlePath ? (
                            <LiveEditableText
                              path={item.titlePath}
                              value={item.title}
                              liveEdit={liveEdit}
                              singleLine
                            />
                          ) : (
                            item.title
                          )}
                        </h3>
                      ) : null}
                      {item.description ? (
                        <p className="mt-4 text-lg leading-8 text-slate-700">
                          {item.descriptionPath ? (
                            <LiveEditableText
                              path={item.descriptionPath}
                              value={item.description}
                              liveEdit={liveEdit}
                            />
                          ) : (
                            item.description
                          )}
                        </p>
                      ) : null}

                      {item.items?.length ? (
                        <ul className="mt-5 space-y-3 text-left text-base leading-7 text-slate-700">
                          {item.items.map((bullet, bulletIndex) => (
                            <li
                              key={`${bullet}-${bulletIndex}`}
                              className="flex gap-3"
                            >
                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--landing-secondary-dark)]" />
                              {item.bulletPath ? (
                                <LiveEditableText
                                  path={`${item.bulletPath}.${bulletIndex}`}
                                  value={bullet}
                                  liveEdit={liveEdit}
                                />
                              ) : (
                                <span>{bullet}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  )}

                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex font-bold text-[var(--landing-primary-dark)] no-underline"
                    >
                      {viewMoreLabel}
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : validItems.length > 0 ? (
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
                {item.title ? (
                  <h3 className={landingCardTitleClass}>
                    {item.titlePath ? (
                      <LiveEditableText
                        path={item.titlePath}
                        value={item.title}
                        liveEdit={liveEdit}
                        singleLine
                      />
                    ) : (
                      item.title
                    )}
                  </h3>
                ) : null}
                {item.description ? (
                  <p className={landingCardTextClass}>
                    {item.descriptionPath ? (
                      <LiveEditableText
                        path={item.descriptionPath}
                        value={item.description}
                        liveEdit={liveEdit}
                      />
                    ) : (
                      item.description
                    )}
                  </p>
                ) : null}
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
                {item.items?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    {item.items.map((bullet, bulletIndex) => (
                      <li key={`${bullet}-${bulletIndex}`} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-secondary-dark)]" />
                        {item.bulletPath ? (
                          <LiveEditableText
                            path={`${item.bulletPath}.${bulletIndex}`}
                            value={bullet}
                            liveEdit={liveEdit}
                          />
                        ) : (
                          <span>{bullet}</span>
                        )}
                      </li>
                    ))}
                  </ul>
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
              {buttonLabelPath ? (
                <LiveEditableText
                  path={buttonLabelPath}
                  value={buttonLabel}
                  liveEdit={liveEdit}
                  singleLine
                />
              ) : (
                buttonLabel
              )}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
