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
import LiveAddItemButton from "@/components/editor/LiveAddItemButton";
import LiveEditableText from "@/components/editor/LiveEditableText";
import { Banknote, BookOpenCheck, Hammer } from "../templateIcons";

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
  buttonUrlPath?: string;
  viewMoreLabel?: string;
  liveEdit?: LandingLiveEditConfig;
  titlePath?: string;
  descriptionPath?: string;
  itemsPath?: string;
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

function parseMoneyAmount(value = "") {
  const match = value.match(/\$\s?[\d.,]+/);

  if (!match) {
    return null;
  }

  const numeric = Number(match[0].replace(/[^0-9]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function extractBadgeLabel(description = "", fallbackDiscount = "") {
  const explicitDiscount = fallbackDiscount.trim();

  if (explicitDiscount) {
    return explicitDiscount.toUpperCase();
  }

  const parenthetical = description.match(/\(([^)]+)\)/)?.[1]?.trim();

  if (parenthetical) {
    return parenthetical.toUpperCase();
  }

  return "";
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
  buttonUrlPath,
  viewMoreLabel = "Ver mas",
  liveEdit,
  titlePath,
  descriptionPath,
  itemsPath = "curriculum.items",
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
  const secondaryBGridClass =
    validItems.length <= 2 ? "grid gap-5 lg:grid-cols-2" : "grid gap-5 lg:grid-cols-3";
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
          <>
          <div className={secondaryBGridClass}>
            {validItems.map((item, index) => {
              const titlePrice = splitLabelAndAmount(item.title);
              const descriptionPrice = splitLabelAndAmount(item.description);
              const officialAmount = parseMoneyAmount(item.title);
              const discountedAmount = parseMoneyAmount(item.description);
              const isPriceCard =
                index === 0 && titlePrice.amount && descriptionPrice.amount;
              const computedDiscountPercentage =
                officialAmount && discountedAmount && officialAmount > discountedAmount
                  ? `${Math.round(((officialAmount - discountedAmount) / officialAmount) * 100)}%`
                  : "";
              const badgeText = extractBadgeLabel(
                descriptionPrice.label,
                item.items?.[1] || computedDiscountPercentage,
              );
              const badgeCopy = badgeText
                ? badgeText.startsWith("DESCUENTO")
                  ? badgeText
                  : `DESCUENTO DEL ${badgeText}`
                : "";
              const primaryPriceLabel =
                item.items?.[0]?.trim() || descriptionPrice.label || "Valor con subsidio";
              const primaryPriceAmount =
                item.items?.[2]?.trim() || descriptionPrice.amount;
              const officialPriceLabel = titlePrice.label || "Valor oficial";
              const priceCardHref = item.url?.trim() || "#default-form";
              const shouldCenterSecondaryCard = validItems.length <= 2;

              return (
                <article
                  className={`rounded-2xl border border-[var(--landing-primary-light)] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPriceCard
                      ? "bg-[linear-gradient(180deg,#ffc400_0%,#efb800_100%)] shadow-[0_24px_54px_color-mix(in_srgb,var(--landing-secondary)_36%,transparent)]"
                      : "bg-white/88"
                  }`}
                  key={`${item.title || "item"}-${index}`}
                >
                  {isPriceCard ? (
                    <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                      {badgeCopy ? (
                        <span className="inline-flex rounded-full bg-[rgba(7,23,53,0.14)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--landing-primary-darkest)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                          {badgeCopy}
                        </span>
                      ) : null}
                      <div className="mt-6">
                        <p className="text-lg font-semibold leading-7 text-[var(--landing-primary-darkest)] md:text-2xl">
                          {primaryPriceLabel}
                        </p>
                        <p className="mt-2 text-5xl font-bold leading-none tracking-tight text-[var(--landing-primary-darkest)] md:text-6xl">
                          {primaryPriceAmount}
                        </p>
                      </div>
                      <div className="mt-5 text-base leading-7 text-[var(--landing-primary-darkest)]/80 md:text-lg">
                        <span>Antes </span>
                        <span className="font-semibold line-through decoration-[var(--landing-primary-darkest)]/70 decoration-2">
                          {titlePrice.amount}
                        </span>
                        <span>{` · ${officialPriceLabel.toLowerCase()}`}</span>
                      </div>
                      <a
                        href={priceCardHref}
                        target={priceCardHref.startsWith("#") ? undefined : "_blank"}
                        rel={priceCardHref.startsWith("#") ? undefined : "noreferrer"}
                        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--landing-primary-darkest)] px-8 py-3.5 text-lg font-extrabold text-white no-underline shadow-[0_18px_34px_rgba(15,23,42,0.22)] transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
                      >
                        {item.url ? viewMoreLabel : "Quiero inscribirme"}
                      </a>
                    </div>
                  ) : (
                    <div
                      className={
                        shouldCenterSecondaryCard
                          ? "flex min-h-[340px] flex-col items-center justify-center text-center"
                          : ""
                      }
                    >
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
                        <ul
                          className={`mt-5 space-y-3 text-base leading-7 text-slate-700 ${
                            shouldCenterSecondaryCard ? "text-left" : "text-left"
                          }`}
                        >
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
                    </div>
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
            <div className="mt-5 flex min-h-[56px] items-center justify-center empty:hidden">
              <LiveAddItemButton path={itemsPath} liveEdit={liveEdit} />
            </div>
          </>
        ) : validItems.length > 0 ? (
          <>
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
            <div className="mt-5 flex min-h-[56px] items-center justify-center empty:hidden">
              <LiveAddItemButton path={itemsPath} liveEdit={liveEdit} />
            </div>
          </>
        ) : null}

        {resolvedButtonUrl || (liveEdit?.enabled && buttonUrlPath) ? (
          <div className="mt-10 flex justify-center">
            <a
              href={resolvedButtonUrl || "#"}
              target="_blank"
              rel="noreferrer"
              data-live-link-path={liveEdit?.enabled ? buttonUrlPath : undefined}
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
