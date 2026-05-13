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
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--landing-secondary)_42%,transparent),transparent_32%),radial-gradient(circle_at_82%_8%,color-mix(in_srgb,var(--landing-primary-light)_32%,transparent),transparent_30%),linear-gradient(135deg,var(--landing-primary-darkest),var(--landing-primary-dark)_48%,var(--landing-primary))] py-24 text-center text-[var(--landing-primary-text)] md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.42) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-1/2 h-72 w-[760px] -translate-x-1/2 rounded-full bg-[var(--landing-secondary)] opacity-20 blur-3xl"
      />

      <div className={`${landingContainerClass} relative`}>
        <div className="mx-auto max-w-[1060px] rounded-3xl border border-white/20 bg-white/10 px-6 py-12 shadow-[0_30px_90px_rgba(2,6,23,0.24)] backdrop-blur-xl md:px-12 md:py-16">
          {title ? (
            <h2 className="mx-auto max-w-[920px] text-5xl font-bold leading-tight tracking-tight text-[var(--landing-primary-text)] md:text-7xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mt-6 max-w-[760px] text-xl leading-8 opacity-90 md:text-2xl md:leading-9">
              {description}
            </p>
          ) : null}
          {(button || secondaryButton) && hasForm ? (
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              {button ? (
                <a
                  href="#default-form"
                  className={`${landingPrimaryButtonClass} min-h-14 px-7 py-4 text-lg shadow-[0_18px_46px_color-mix(in_srgb,var(--landing-secondary)_34%,transparent)]`}
                >
                  {button}
                </a>
              ) : null}
              {secondaryButton ? (
                <a
                  href="#default-form"
                  className={`${landingSecondaryButtonClass} min-h-14 px-7 py-4 text-lg`}
                >
                  {secondaryButton}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
