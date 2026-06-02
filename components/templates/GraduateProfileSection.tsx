/* eslint-disable @next/next/no-img-element */
import { GraduationCap } from "lucide-react";
import type { Landing } from "@/lib/data";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import {
  landingContainerClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
} from "./defaultLanding/classes";
import EditableImageSlot, {
  editableImageClass,
} from "./defaultLanding/EditableImageSlot";

type Props = {
  graduateProfile?: Landing["graduateProfile"];
  eyebrow?: string;
  eyebrowPath?: string;
  primaryColor: string;
  secondaryColor: string;
  liveEdit?: LandingLiveEditConfig;
};

function getItems(items?: NonNullable<Landing["graduateProfile"]>["items"]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const value = item.trim();

        return value
          ? {
              title: "",
              description: value,
              titlePath: "",
              descriptionPath: `graduateProfile.items.${index}`,
            }
          : null;
      }

      const title = item?.title?.trim() || "";
      const description =
        item?.description?.trim() ||
        item?.content?.trim() ||
        item?.text?.trim() ||
        "";

      return title || description
        ? {
            title,
            description,
            titlePath: `graduateProfile.items.${index}.title`,
            descriptionPath: `graduateProfile.items.${index}.description`,
          }
        : null;
    })
    .filter(
      (
        item,
      ): item is {
        title: string;
        description: string;
        titlePath: string;
        descriptionPath: string;
      } => Boolean(item),
    );
}

export default function GraduateProfileSection({
  graduateProfile,
  eyebrow,
  eyebrowPath,
  primaryColor,
  secondaryColor,
  liveEdit,
}: Props) {
  const title = graduateProfile?.title?.trim() ?? "";
  const image = graduateProfile?.image?.trim() ?? "";
  const eyebrowText = eyebrow?.trim() ?? "";
  const items = getItems(graduateProfile?.items);
  const hasImage = Boolean(image);
  const showImageSlot = Boolean(hasImage || liveEdit?.enabled);

  if (!title && !image && items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[linear-gradient(180deg,#fff,var(--landing-secondary-lightest))] py-24 md:py-32">
      <div
        className={`${landingContainerClass} grid items-start gap-10 ${
          showImageSlot
            ? "lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]"
            : "max-w-[920px]"
        }`}
      >
        {showImageSlot ? (
          <div>
            <div className="min-h-[320px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,var(--landing-primary-lightest),var(--landing-secondary-lightest))] shadow-xl ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 lg:min-h-[520px]">
              {hasImage ? (
                <img
                  src={image}
                  alt={title || eyebrowText}
                  data-live-image-path={liveEdit?.enabled ? "graduateProfile.image" : undefined}
                  data-live-image-label="Imagen del perfil del egresado"
                  data-live-image-value={image}
                  title={liveEdit?.enabled ? "Click para reemplazar esta imagen" : undefined}
                  className={`h-full min-h-[320px] w-full object-cover lg:min-h-[520px] ${
                    liveEdit?.enabled ? editableImageClass : ""
                  }`}
                />
              ) : (
                <EditableImageSlot
                  path="graduateProfile.image"
                  label="Imagen del perfil del egresado"
                  className="h-full w-full"
                />
              )}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-[var(--landing-primary-light)] bg-white/72 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div>
            {eyebrowText ? (
              <p
                className={`${landingSectionKickerClass} mb-3 inline-flex items-center gap-2`}
                style={{ color: primaryColor }}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[var(--landing-primary-dark)] shadow-[0_6px_16px_rgba(15,23,42,0.08)] ring-1 ring-[var(--landing-primary-light)]">
                  <GraduationCap className="h-4 w-4" />
                </span>
                {eyebrowPath ? (
                  <LiveEditableText
                    path={eyebrowPath}
                    value={eyebrowText}
                    liveEdit={liveEdit}
                    singleLine
                  />
                ) : (
                  eyebrowText
                )}
              </p>
            ) : null}

            {eyebrowText ? (
              <span
                aria-hidden="true"
                className="mb-5 block h-1 w-16 rounded-full bg-[var(--landing-primary)]"
              />
            ) : null}

            {title ? (
              <LiveEditableText
                as="h2"
                path="graduateProfile.title"
                value={title}
                liveEdit={liveEdit}
                singleLine
                className={landingSectionTitleClass}
              />
            ) : null}
          </div>

          {items.length > 0 ? (
            <ul className={`${title ? "mt-8" : "mt-5"} space-y-5`}>
              {items.map((item, index) => (
                <li
                  key={`${item.title || "graduate-profile"}-${index}`}
                  className="flex gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_5px_color-mix(in_srgb,var(--landing-secondary)_18%,transparent)]"
                    style={{ backgroundColor: secondaryColor }}
                  />
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
                      <p
                        className={`text-lg leading-8 text-slate-600 ${
                          item.title ? "mt-2" : "mt-0"
                        }`}
                      >
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
      </div>
    </section>
  );
}
