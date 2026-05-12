/* eslint-disable @next/next/no-img-element */
import type { LegalLink } from "@/lib/data";
import { landingContainerClass } from "./classes";

type Props = {
  logo: string;
  brandName: string;
  description: string;
  legalLinks: LegalLink[];
};

export default function DefaultLandingFooterSection({
  logo,
  brandName,
  description,
  legalLinks,
}: Props) {
  return (
    <footer className="bg-slate-900 py-[42px] text-white">
      <div className={`${landingContainerClass} flex flex-wrap items-center justify-between gap-6`}>
        <div>
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
        </div>

        {legalLinks.length > 0 ? (
          <nav
            className="flex flex-wrap justify-end gap-x-[18px] gap-y-3 text-sm"
            aria-label="Links legales"
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
