import {
  type ReactNode,
} from "react";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import {
  landingSectionDescriptionClass,
  landingSectionHeaderCenteredClass,
  landingSectionHeaderClass,
  landingSectionKickerClass,
  landingSectionTitleClass,
} from "./classes";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  centered?: boolean;
  icon?: ReactNode;
  liveEdit?: LandingLiveEditConfig;
  titlePath?: string;
  descriptionPath?: string;
  eyebrowPath?: string;
};

export default function DefaultLandingSectionHeader({
  eyebrow = "",
  title = "",
  description = "",
  centered = false,
  icon,
  liveEdit,
  titlePath,
  descriptionPath,
  eyebrowPath,
}: Props) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  return (
    <div
      className={
        centered ? landingSectionHeaderCenteredClass : landingSectionHeaderClass
      }
    >
      {eyebrow ? (
        <p
          className={`${landingSectionKickerClass} inline-flex items-center gap-2 ${
            centered ? "justify-center" : ""
          }`}
        >
          {icon ? (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[var(--landing-primary-dark)] shadow-[0_6px_16px_rgba(15,23,42,0.08)] ring-1 ring-[var(--landing-primary-light)] [&_svg]:h-4 [&_svg]:w-4">
              {icon}
            </span>
          ) : null}
          {eyebrowPath ? (
            <LiveEditableText
              path={eyebrowPath}
              value={eyebrow}
              liveEdit={liveEdit}
              singleLine
            />
          ) : (
            eyebrow
          )}
        </p>
      ) : null}
      {eyebrow ? (
        <span
          aria-hidden="true"
          className={`mb-5 block h-1 w-16 rounded-full bg-[var(--landing-primary)] ${
            centered ? "mx-auto" : ""
          }`}
        />
      ) : null}
      {title ? (
        titlePath ? (
          <LiveEditableText
            as="h2"
            path={titlePath}
            value={title}
            liveEdit={liveEdit}
            singleLine
            className={landingSectionTitleClass}
          />
        ) : (
          <h2 className={landingSectionTitleClass}>{title}</h2>
        )
      ) : null}
      {description ? (
        descriptionPath ? (
          <LiveEditableText
            as="p"
            path={descriptionPath}
            value={description}
            liveEdit={liveEdit}
            className={landingSectionDescriptionClass}
          />
        ) : (
          <p className={landingSectionDescriptionClass}>{description}</p>
        )
      ) : null}
    </div>
  );
}
