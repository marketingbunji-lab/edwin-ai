/* eslint-disable @next/next/no-img-element */
import type { LegalLink } from "@/lib/data";
import { landingContainerClass } from "./classes";

type Props = {
  logo: string;
  brandName: string;
  description: string;
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

  return (
    <footer className="bg-slate-900 py-[42px] text-white">
      <div className={`${landingContainerClass} flex flex-wrap items-start justify-between gap-8`}>
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
            <p className="mt-3 text-white/70">
              {description}
            </p>
          ) : null}

          {hasContactInfo ? (
            <div className="mt-5 space-y-1 text-sm text-white/80">
              {advisorName ? (
                <p className="font-semibold text-white">{advisorName}</p>
              ) : null}
              {advisorTitle ? <p>{advisorTitle}</p> : null}
              {phone ? <p>{phoneLabel}: {phone}</p> : null}
              {email ? <p>{emailLabel}: {email}</p> : null}
            </div>
          ) : null}
        </div>

        {legalLinks.length > 0 ? (
          <nav
            className="flex max-w-[420px] flex-wrap justify-end gap-x-[18px] gap-y-3 text-sm"
            aria-label={legalLinksAriaLabel}
          >
            {legalLinks.map((link, index) => (
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
    </footer>
  );
}
