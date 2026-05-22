/* eslint-disable @next/next/no-img-element */
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import type { LandingLiveEditConfig } from "@/components/editor/LiveEditableText";
import LiveEditableText from "@/components/editor/LiveEditableText";

type OverviewItem = {
  title?: string;
  description?: string;
  titlePath?: string;
  descriptionPath?: string;
};

type Props = {
  eyebrow: string;
  eyebrowPath?: string;
  title: string;
  description: string;
  image: string;
  items?: OverviewItem[];
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingOverviewSection({
  eyebrow,
  eyebrowPath,
  title,
  description,
  image,
  items = [],
  liveEdit,
}: Props) {
  const validItems = items.filter(
    (item) => item.title?.trim() || item.description?.trim(),
  );

  if (!title && !description && !image && validItems.length === 0) {
    return null;
  }

  return (
    <section className={`${landingSectionClass} bg-[linear-gradient(180deg,var(--landing-page-bg),var(--landing-primary-lightest))]`}>
      <div className={`${landingContainerClass} ${image ? landingTwoColumnClass : ""}`}>
        <div className="rounded-3xl border border-[var(--landing-primary-light)] bg-white/72 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <DefaultLandingSectionHeader
            eyebrow={eyebrow}
            eyebrowPath={eyebrowPath}
            title={title}
            description={description}
            liveEdit={liveEdit}
            titlePath="overview.title"
            descriptionPath="overview.description"
          />

          {validItems.length > 0 ? (
            <ul className="mt-8 space-y-5">
              {validItems.map((item, index) => (
                <li key={`${item.title || "overview"}-${index}`} className="flex gap-4">
                  <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--landing-secondary)] shadow-[0_0_0_5px_color-mix(in_srgb,var(--landing-secondary)_18%,transparent)]" />
                  <div>
                    {item.title ? (
                      <h3 className="m-0 text-xl font-bold leading-tight tracking-tight text-[var(--landing-primary-darkest)]">
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
                      <p className="mt-2 text-lg leading-8 text-slate-600">
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
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {image ? (
          <div className={landingImageFrameClass}>
            <img src={image} alt={title || "Program overview"} className={landingImageClass} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
