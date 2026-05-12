import {
  landingContainerClass,
  landingPrimaryButtonClass,
  landingSecondaryButtonClass,
} from "./classes";

type Props = {
  title: string;
  description: string;
  button: string;
  secondaryButton: string;
  hasForm: boolean;
};

export default function DefaultLandingCtaSection({
  title,
  description,
  button,
  secondaryButton,
  hasForm,
}: Props) {
  if (!title && !description && !button && !secondaryButton) {
    return null;
  }

  return (
    <section className="bg-[var(--landing-primary)] py-20 text-center text-[var(--landing-primary-text)]">
      <div className={landingContainerClass}>
        {title ? (
          <h2 className="mx-auto max-w-[820px] text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.05] text-[var(--landing-primary-text)]">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mx-auto mt-[18px] max-w-[720px] text-lg leading-[1.65] opacity-90">
            {description}
          </p>
        ) : null}
        {(button || secondaryButton) && hasForm ? (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {button ? (
              <a href="#default-form" className={landingPrimaryButtonClass}>
                {button}
              </a>
            ) : null}
            {secondaryButton ? (
              <a href="#default-form" className={landingSecondaryButtonClass}>
                {secondaryButton}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
