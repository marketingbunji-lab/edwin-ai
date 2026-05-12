/* eslint-disable @next/next/no-img-element */
import {
  landingCardClass,
  landingCardTextClass,
  landingCardTitleClass,
  landingContainerClass,
  landingImageClass,
  landingImageFrameClass,
  landingSectionHeaderClass,
  landingSectionKickerClass,
  landingSectionSoftClass,
  landingSectionTitleClass,
  landingTwoColumnClass,
} from "./classes";

type Props = {
  advisorName: string;
  advisorTitle: string;
  phone: string;
  email: string;
  image: string;
};

export default function DefaultLandingContactSection({
  advisorName,
  advisorTitle,
  phone,
  email,
  image,
}: Props) {
  if (!advisorName && !advisorTitle && !phone && !email && !image) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={`${landingContainerClass} ${landingTwoColumnClass}`}>
        <div>
          {image ? (
            <div className={landingImageFrameClass}>
              <img src={image} alt={advisorName || "Advisor"} className={landingImageClass} />
            </div>
          ) : null}
        </div>

        <div>
          <div className={landingSectionHeaderClass}>
            <p className={landingSectionKickerClass}>Contact</p>
            <h2 className={landingSectionTitleClass}>Speak with an advisor</h2>
          </div>

          <div className={landingCardClass}>
            {advisorName ? <h3 className={landingCardTitleClass}>{advisorName}</h3> : null}
            {advisorTitle ? <p className={landingCardTextClass}>{advisorTitle}</p> : null}
            {phone ? <p className={landingCardTextClass}>Phone: {phone}</p> : null}
            {email ? <p className={landingCardTextClass}>Email: {email}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
