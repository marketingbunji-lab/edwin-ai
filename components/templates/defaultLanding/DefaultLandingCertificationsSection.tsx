/* eslint-disable @next/next/no-img-element */
import type { BrandCertification } from "@/lib/data";
import {
  landingContainerClass,
  landingSectionSoftClass,
} from "./classes";

type ActiveCertification = {
  certification: BrandCertification;
  index: number;
};

type Props = {
  activeCertifications: ActiveCertification[];
  title: string;
  getCertificationLogo: (
    certification: BrandCertification,
    mode?: "light" | "dark",
  ) => string;
  logoMode?: "light" | "dark";
};

export default function DefaultLandingCertificationsSection({
  activeCertifications,
  title,
  getCertificationLogo,
  logoMode,
}: Props) {
  if (!activeCertifications.length) {
    return null;
  }

  return (
    <section className={`${landingSectionSoftClass} bg-white border border-slate-200`}>
      <div className={landingContainerClass}>
        <div className="flex flex-col gap-6 rounded-[18px] px-6 md:flex-row md:items-center md:justify-between md:gap-10 lg:px-8">
          <div className="shrink-0 md:pr-8">
            <h2 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-black leading-[1.05] text-slate-900">
              {title}
            </h2>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-start gap-6 md:justify-end md:gap-8 lg:gap-10">
            {activeCertifications.map(({ certification, index }) => {
              const certificationLogo = getCertificationLogo(
                certification,
                logoMode,
              );

              return (
                <div key={index} className="shrink-0">
                  {certificationLogo ? (
                    certification.url ? (
                      <a
                        href={certification.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
                        aria-label={certification.name}
                      >
                        <img
                          src={certificationLogo}
                          alt={certification.name}
                          className="max-h-14 max-w-[180px] object-contain object-center"
                        />
                      </a>
                    ) : (
                      <img
                        src={certificationLogo}
                        alt={certification.name}
                        className="max-h-14 max-w-[180px] object-contain object-center"
                      />
                    )
                  ) : certification.url ? (
                    <a
                      href={certification.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-extrabold text-slate-900 no-underline"
                    >
                      {certification.name}
                    </a>
                  ) : (
                    <strong className="text-sm text-slate-900">
                      {certification.name}
                    </strong>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
