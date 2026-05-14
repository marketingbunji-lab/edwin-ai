/* eslint-disable @next/next/no-img-element */
import type { Landing } from "@/lib/data";
import { BriefcaseBusiness } from "lucide-react";
import {
  landingContainerClass,
  landingSectionDescriptionClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
} from "./defaultLanding/classes";

type Props = {
  opportunityToWork?: Landing["opportunityToWork"];
  eyebrow: string;
  primaryColor: string;
  secondaryColor: string;
};

function getItems(items?: NonNullable<Landing["opportunityToWork"]>["items"]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return [item?.title, item?.description || item?.content || item?.text]
        .filter(Boolean)
        .join(": ")
        .trim();
    })
    .filter(Boolean);
}

export default function OpportunityToWorkSection({
  opportunityToWork,
  eyebrow,
  primaryColor,
  secondaryColor,
}: Props) {
  const title = opportunityToWork?.title?.trim() ?? "";
  const subtitle = opportunityToWork?.subtitle?.trim() ?? "";
  const image = opportunityToWork?.image?.trim() ?? "";
  const items = getItems(opportunityToWork?.items);
  const hasRenderableContent = Boolean(subtitle || image || items.length > 0);

  if (!hasRenderableContent) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,var(--landing-page-bg),var(--landing-secondary-lightest))] py-24 md:py-32">
      <div className={`${landingContainerClass} grid items-start gap-10 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]`}>
        <div>
          {image ? (
            <div className="min-h-[320px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-secondary-lightest))] shadow-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 lg:min-h-[520px]">
              <img
                src={image}
                alt={title || "Career opportunities"}
                className="h-full min-h-[320px] w-full object-cover lg:min-h-[520px]"
              />
            </div>
          ) : null}
        </div>

        <div className="grid content-start gap-[18px]">
          <div>
            <p className={`${landingSectionKickerClass} mb-3 inline-flex items-center gap-2`} style={{ color: primaryColor }}>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[var(--landing-primary-dark)] shadow-[0_6px_16px_rgba(15,23,42,0.08)] ring-1 ring-[var(--landing-primary-light)]">
                <BriefcaseBusiness className="h-4 w-4" />
              </span>
              {eyebrow}
            </p>
            {title ? (
              <span
                aria-hidden="true"
                className="mb-5 block h-1 w-16 rounded-full bg-[var(--landing-primary)]"
              />
            ) : null}

            {title ? (
              <h2 className={landingSectionTitleClass}>
                {title}
              </h2>
            ) : null}

            {subtitle ? (
              <p className={`${landingSectionDescriptionClass} mt-[18px]`}>
                {subtitle}
              </p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="grid gap-[14px]">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start rounded-2xl border border-[var(--landing-primary-light)] bg-white p-[22px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span
                  aria-hidden="true"
                  className="mr-4 mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: secondaryColor }}
                />
                <p className="m-0 text-lg font-bold leading-8 text-slate-900">
                  {item}
                </p>
              </div>
            ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
