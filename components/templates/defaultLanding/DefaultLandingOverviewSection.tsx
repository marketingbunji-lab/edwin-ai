/* eslint-disable @next/next/no-img-element */
import {
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionClass,
  landingTwoColumnClass,
} from "./classes";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function DefaultLandingOverviewSection({
  title,
  description,
  image,
}: Props) {
  if (!title && !description && !image) {
    return null;
  }

  return (
    <section className={`${landingSectionClass} bg-[linear-gradient(180deg,var(--landing-page-bg),var(--landing-primary-lightest))]`}>
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div className="rounded-3xl border border-[var(--landing-primary-light)] bg-white/72 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <DefaultLandingSectionHeader
            eyebrow="Program overview"
            title={title}
            description={description}
          />
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
