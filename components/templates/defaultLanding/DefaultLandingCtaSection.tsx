import {
  landingContainerClass,
} from "./classes";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";

type Props = {
  title: string;
  description: string;
  button: string;
  secondaryButton: string;
  hasForm: boolean;
  liveEdit?: LandingLiveEditConfig;
};

export default function DefaultLandingCtaSection({
  title,
  description,
  button,
  secondaryButton,
  hasForm,
  liveEdit,
}: Props) {
  if (!title && !description && !button && !secondaryButton) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_16%_10%,color-mix(in_srgb,var(--landing-secondary)_34%,transparent),transparent_34%),radial-gradient(circle_at_82%_24%,color-mix(in_srgb,var(--landing-primary-light)_26%,transparent),transparent_34%),linear-gradient(135deg,var(--landing-primary-darkest),#0f2748_48%,var(--landing-primary-dark))] py-24 text-center text-white md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.32) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 left-1/2 h-72 w-[760px] -translate-x-1/2 rounded-full bg-[var(--landing-secondary)] opacity-25 blur-3xl"
      />

      <div className={`${landingContainerClass} relative`}>
        <div className="mx-auto max-w-[1060px] rounded-3xl border border-white/20 bg-white/[0.13] px-6 py-12 shadow-[0_30px_90px_rgba(2,6,23,0.36)] backdrop-blur-xl md:px-12 md:py-16">
          {title ? (
            <h2 className="mx-auto max-w-[920px] text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              <LiveEditableText
                path="cta.title"
                value={title}
                liveEdit={liveEdit}
                singleLine
              />
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mt-6 max-w-[760px] text-xl leading-8 text-white/86 md:text-2xl md:leading-9">
              <LiveEditableText
                path="cta.description"
                value={description}
                liveEdit={liveEdit}
              />
            </p>
          ) : null}
          {(button || secondaryButton) && hasForm ? (
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              {button ? (
                <a
                  href="#default-form"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--landing-secondary),var(--landing-secondary-dark))] px-7 py-4 text-lg font-extrabold text-[var(--landing-secondary-text)] no-underline shadow-[0_18px_46px_color-mix(in_srgb,var(--landing-secondary)_38%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <LiveEditableText
                    path="cta.button"
                    value={button}
                    liveEdit={liveEdit}
                    singleLine
                  />
                </a>
              ) : null}
              {secondaryButton ? (
                <a
                  href="#default-form"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl bg-white/12 px-7 py-4 text-lg font-extrabold text-white no-underline shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/18"
                >
                  <LiveEditableText
                    path="cta.secondaryButton"
                    value={secondaryButton}
                    liveEdit={liveEdit}
                    singleLine
                  />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
