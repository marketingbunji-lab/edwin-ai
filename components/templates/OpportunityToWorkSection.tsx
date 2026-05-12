/* eslint-disable @next/next/no-img-element */
import type { Landing } from "@/lib/data";
import {
  landingContainerClass,
  landingSectionDescriptionClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
} from "./defaultLanding/classes";

type Props = {
  opportunityToWork?: Landing["opportunityToWork"];
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
  primaryColor,
}: Props) {
  const title = opportunityToWork?.title?.trim() ?? "";
  const subtitle = opportunityToWork?.subtitle?.trim() ?? "";
  const image = opportunityToWork?.image?.trim() ?? "";
  const items = getItems(opportunityToWork?.items);

  if (!title && !subtitle && !image && items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-[72px]">
      <div className={`${landingContainerClass} grid items-start gap-10 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]`}>
        <div>
          {image ? (
            <div className="min-h-[320px] overflow-hidden rounded-[28px] bg-[rgba(17,24,39,0.06)] shadow-[0_18px_60px_rgba(17,24,39,0.08)] lg:min-h-[520px]">
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
            <p className={`${landingSectionKickerClass} mb-3`} style={{ color: primaryColor }}>
              Oportunidades laborales
            </p>

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
                className="flex items-start rounded-[18px] border border-slate-200 bg-slate-50 p-[22px] shadow-[0_10px_30px_rgba(17,24,39,0.04)]"
              >
                <p className="m-0 text-[17px] font-bold leading-[1.55] text-slate-900">
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
