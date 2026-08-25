/* eslint-disable @next/next/no-img-element */
import type { LegalLink } from "@/lib/data";
import { landingContainerClass } from "./classes";

type Props = {
  logo: string;
  brandName: string;
  description: string;
  legalText: string;
  advisorName: string;
  advisorTitle: string;
  phone: string;
  email: string;
  legalLinks: LegalLink[];
  phoneLabel: string;
  emailLabel: string;
  legalLinksAriaLabel: string;
};

export default function DefaultLandingFooterSection({
  logo,
  brandName,
  description,
  legalText,
  advisorName,
  advisorTitle,
  phone,
  email,
  legalLinks,
  phoneLabel,
  emailLabel,
  legalLinksAriaLabel,
}: Props) {
  const hasContactInfo = Boolean(advisorName || advisorTitle || phone || email);
  const visibleLegalLinks = legalLinks.filter((link) => {
    const normalizedLabel = link.label
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return (
      normalizedLabel !== "sitio oficial" && normalizedLabel !== "official site"
    );
  });

  return (
    <footer className="bg-slate-900 py-16 text-white md:py-20">
      <div
        className={`${landingContainerClass} flex flex-wrap items-start justify-between gap-8`}
      >
        <div className="max-w-[420px]">
          {logo ? (
            <img
              src={logo}
              alt={brandName}
              className="max-h-[84px] w-[220px] max-w-[70vw] object-contain object-left"
            />
          ) : (
            <strong>{brandName}</strong>
          )}
          {description ? (
            <p className="mt-3 text-sm leading-[1.5] text-white/70">
              {description}
            </p>
          ) : null}
          {legalText ? (
            <p className="mt-4 whitespace-pre-line text-xs leading-[1.65] text-white/70">
              {legalText}
            </p>
          ) : null}
        </div>

        {hasContactInfo || visibleLegalLinks.length > 0 ? (
          <div className="flex max-w-[420px] flex-col items-start gap-5 text-sm md:items-end">
            {hasContactInfo ? (
              <div className="space-y-1 text-white/80 md:text-right">
                {advisorName ? (
                  <p className="font-semibold text-white">{advisorName}</p>
                ) : null}
                {advisorTitle ? <p>{advisorTitle}</p> : null}
                {phone ? (
                  <p>
                    {phoneLabel}: {phone}
                  </p>
                ) : null}
                {email ? (
                  <p>
                    {emailLabel}: {email}
                  </p>
                ) : null}
              </div>
            ) : null}

            {visibleLegalLinks.length > 0 ? (
              <nav
                className="flex flex-wrap gap-x-[18px] gap-y-3 text-sm md:justify-end"
                aria-label={legalLinksAriaLabel}
              >
                {visibleLegalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/85 no-underline transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
