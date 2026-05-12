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
  getCertificationLogo: (
    certification: BrandCertification,
    mode?: "light" | "dark",
  ) => string;
  logoMode?: "light" | "dark";
};

export default function DefaultLandingCertificationsSection({
  activeCertifications,
  getCertificationLogo,
  logoMode,
}: Props) {
  if (!activeCertifications.length) {
    return null;
  }

  return (
    <section className={landingSectionSoftClass}>
      <div className={landingContainerClass}>
        <div className="flex flex-col gap-5 rounded-[18px] border border-[#EEF2F7] bg-white px-6 py-5 shadow-[0_12px_36px_rgba(17,24,39,0.08)] md:flex-row md:items-center md:justify-between">
          <div className="shrink-0">
            <h2 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-black leading-[1.05] text-slate-900">
              Accreditations
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:justify-end">
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
                        className="inline-flex transition-opacity hover:opacity-90"
                        aria-label={certification.name}
                      >
                        <img
                          src={certificationLogo}
                          alt={certification.name}
                          className="max-h-14 max-w-[160px] object-contain"
                        />
                      </a>
                    ) : (
                      <img
                        src={certificationLogo}
                        alt={certification.name}
                        className="max-h-14 max-w-[160px] object-contain"
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
