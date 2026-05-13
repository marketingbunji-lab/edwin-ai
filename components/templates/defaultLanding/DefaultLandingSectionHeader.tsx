import {
  type ReactNode,
} from "react";
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
};

export default function DefaultLandingSectionHeader({
  eyebrow = "",
  title = "",
  description = "",
  centered = false,
  icon,
}: Props) {
  if (!eyebrow && !title && !description && !icon) {
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
          {eyebrow}
        </p>
      ) : icon ? (
        <div
          className={`mb-4 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[var(--landing-primary-dark)] shadow-[0_6px_16px_rgba(15,23,42,0.08)] ring-1 ring-[var(--landing-primary-light)] [&_svg]:h-4 [&_svg]:w-4 ${
            centered ? "mx-auto" : ""
          }`}
        >
          {icon}
        </div>
      ) : null}
      {title ? (
        <span
          aria-hidden="true"
          className={`mb-5 block h-1 w-16 rounded-full bg-[var(--landing-primary)] ${
            centered ? "mx-auto" : ""
          }`}
        />
      ) : null}
      {title ? <h2 className={landingSectionTitleClass}>{title}</h2> : null}
      {description ? (
        <p className={landingSectionDescriptionClass}>{description}</p>
      ) : null}
    </div>
  );
}
