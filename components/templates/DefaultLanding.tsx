/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import { getBrandLogo } from "@/lib/brandLogo";
import type {
  Brand,
  BrandCertification,
  IconTextItem,
  Landing,
  LegalLink,
  ProgramInfoItem,
} from "@/lib/data";
import ClientifyFormEmbed from "../forms/ClientifyFormEmbed";
import GenericLeadForm from "./GenericLeadForm";
import OpportunityToWorkSection from "./OpportunityToWorkSection";
import LandingAccordion from "../ui/LandingAccordion";

type Props = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

function normalizeProgramInfo(programInfo?: Landing["programInfo"]) {
  if (!Array.isArray(programInfo)) {
    return [];
  }

  return programInfo
    .map((item, index): ProgramInfoItem | null => {
      if (typeof item === "string") {
        const value = item.trim();

        return value
          ? {
              key: `legacy-${index}`,
              label: `Dato ${index + 1}`,
              value,
            }
          : null;
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const label = item.label?.trim() || `Dato ${index + 1}`;
      const value = item.value?.trim() || "";

      return value
        ? {
            key: item.key?.trim() || `program-info-${index}`,
            label,
            value,
          }
        : null;
    })
    .filter((item): item is ProgramInfoItem => Boolean(item));
}

function getTextColor(hexColor: string) {
  const hex = hexColor.replace("#", "");

  if (hex.length !== 6) {
    return "#ffffff";
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#111827" : "#ffffff";
}

function getSoftBackground(hexColor: string) {
  return `${hexColor}14`;
}

function isDirectVideoUrl(url?: string) {
  return /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(url?.trim() ?? "");
}

function getOverlayColorValue(color?: string, fallback = "rgba(17, 24, 39, 0.82)") {
  const value = color?.trim();

  if (!value) return fallback;

  if (value.startsWith("#")) {
    const hex = value.slice(1);

    if (hex.length === 3) {
      const red = Number.parseInt(hex[0] + hex[0], 16);
      const green = Number.parseInt(hex[1] + hex[1], 16);
      const blue = Number.parseInt(hex[2] + hex[2], 16);

      return `rgba(${red}, ${green}, ${blue}, 0.72)`;
    }

    if (hex.length === 6) {
      const red = Number.parseInt(hex.slice(0, 2), 16);
      const green = Number.parseInt(hex.slice(2, 4), 16);
      const blue = Number.parseInt(hex.slice(4, 6), 16);

      return `rgba(${red}, ${green}, ${blue}, 0.72)`;
    }
  }

  return value;
}

function getCertificationLogo(
  certification: BrandCertification,
  mode?: "light" | "dark",
) {
  if (mode === "dark") {
    return certification.logos?.dark || certification.logos?.light || "";
  }

  return certification.logos?.light || certification.logos?.dark || "";
}

function getCertificationResolution(
  landing: Landing,
  certification: BrandCertification,
  index: number,
) {
  const items = landing.certifications?.items ?? [];
  const certificationKey = `${certification.name || ""}|${certification.url || ""}`;
  const matchedItem = items.find(
    (item) =>
      typeof item !== "string" &&
      `${item.name || item.title || ""}|${item.url || ""}` === certificationKey,
  );

  const indexedItem = items[index];

  return typeof matchedItem !== "string"
    ? matchedItem?.resolutionText ??
        (typeof indexedItem !== "string" ? indexedItem?.resolutionText : "") ??
        ""
    : "";
}

function normalizeAccordionItems(items?: NonNullable<Landing["whyStudy"]>["items"]) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (typeof item === "string") {
        const value = item.trim();
        return value
          ? {
              title: `Item ${index + 1}`,
              content: value,
            }
          : null;
      }

      const title = item?.title?.trim() || `Item ${index + 1}`;
      const content = item?.content?.trim() || item?.description?.trim() || "";

      return content || title
        ? {
            title,
            content,
          }
        : null;
    })
    .filter((item): item is { title: string; content: string } => Boolean(item));
}

function normalizeIconTextItems(items?: NonNullable<Landing["benefits"]>["items"]) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index): IconTextItem | null => {
      if (typeof item === "string") {
        const value = item.trim();
        return value
          ? {
              title: `Item ${index + 1}`,
              text: value,
            }
          : null;
      }

      const title = item?.title?.trim() || `Item ${index + 1}`;
      const text = item?.text?.trim() || item?.description?.trim() || "";

      return title || text
        ? {
            ...item,
            title,
            text,
          }
        : null;
    })
    .filter((item): item is IconTextItem => Boolean(item));
}

export default function DefaultLanding({
  brand,
  landing,
  mode = "preview",
}: Props) {
  const primaryColor = brand.primaryColor || "#111827";
  const secondaryColor = brand.secondaryColor || "#F8D74A";
  const primaryTextColor = getTextColor(primaryColor);
  const secondaryTextColor = getTextColor(secondaryColor);
  const brandName = brand.name || brand.slug;
  const logo = getBrandLogo(brand, landing.logoMode || "light") || brand.logo;
  const fontFamily =
    brand.typography?.fontFamily?.trim() || "Inter, Arial, sans-serif";
  const googleFontHref = brand.typography?.googleFontHref?.trim() || "";
  const hero = landing.hero ?? {};
  const whyStudy = landing.whyStudy ?? {};
  const supportSection = landing.supportSection ?? landing.studentSupport ?? {};
  const benefits = landing.benefits ?? {};
  const cta = landing.cta ?? {};
  const form = landing.form ?? {};
  const programInfo = normalizeProgramInfo(landing.programInfo);
  const whyStudyItems = normalizeAccordionItems(whyStudy.items);
  const supportItems = normalizeIconTextItems(supportSection.items);
  const benefitItems = normalizeIconTextItems(benefits.items);
  const legalLinks = brand.legalLinks ?? [];
  const footerScripts = landing.footerScripts ?? [];
  const certificationSettings = landing.certifications ?? {};
  const brandCertifications = brand.certifications ?? [];
  const activeCertifications = brandCertifications
    .map((certification, index) => {
      const items = landing.certifications?.items ?? [];
      const certificationKey = `${certification.name || ""}|${certification.url || ""}`;
      const landingItem =
        items.find(
          (item) =>
            typeof item !== "string" &&
            `${item.name || item.title || ""}|${item.url || ""}` === certificationKey,
        ) ?? items[index];

      return {
        certification,
        index,
        enabled:
          typeof landingItem === "string"
            ? certificationSettings.enabled
            : Boolean(landingItem?.enabled),
      };
    })
    .filter((item) => item.enabled);
  const hasCertifications = Boolean(
    certificationSettings.enabled && activeCertifications.length,
  );
  const hasCertificationHeadingRow = activeCertifications.length >= 3;
  const title = landing.title || landing.fullTitle || "";
  const fullTitle = landing.fullTitle || title;
  const heroTitle = hero.title || fullTitle;
  const heroDescription = hero.description || "";
  const heroOverlayColor = getOverlayColorValue(
    hero.overlayColor,
    getOverlayColorValue(primaryColor),
  );
  const supportTitle = supportSection.title || "";
  const supportVideoUrl = supportSection.videoUrl?.trim() || "";
  const hasSupportVideo = Boolean(supportVideoUrl);
  const ctaTitle = cta.title || "";
  const ctaButton = cta.button || "";
  const hasConfiguredForm = Boolean(form.scriptCode || form.scriptUrl);
  const hasForm = true;
  const hasWhyStudy = Boolean(
    whyStudy.title ||
    whyStudy.description ||
    whyStudy.image ||
    whyStudyItems.length,
  );
  const hasSupport = Boolean(supportTitle || hasSupportVideo || supportItems.length);
  const hasBenefits = Boolean(benefits.title || benefitItems.length);
  const hasCta = Boolean(ctaTitle || ctaButton);
  const metaItems = [
    hero.modality ? { label: "Modalidad", value: hero.modality } : null,
    landing.schedule ? { label: "Jornada", value: landing.schedule } : null,
    hero.semesterPrice
      ? { label: "Inversion", value: hero.semesterPrice }
      : null,
    ...programInfo.slice(0, 4).map((item, index) => ({
      label: item.label || `Dato ${index + 1}`,
      value: item.value || "",
    })),
  ].filter(
    (item): item is { label: string; value: string } =>
      Boolean(item?.label && item.value),
  );

  return (
    <div
      className="default-landing"
      style={{ fontFamily, color: "#111827", margin: 0, background: "#ffffff" }}
    >
      <style>{`
        ${googleFontHref ? `@import url("${googleFontHref}");` : ""}

        .default-landing,
        .default-landing * {
          box-sizing: border-box;
        }

        .default-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 80px 16px;
        }

        .default-hero {
          position: relative;
          background:
            ${
              hero.backgroundImage
                ? `linear-gradient(115deg, ${heroOverlayColor} 0%, ${heroOverlayColor} 42%, rgba(17, 24, 39, 0.28) 100%), url("${hero.backgroundImage}") center / cover`
                : `linear-gradient(115deg, ${heroOverlayColor} 0%, ${primaryColor}f2 50%, ${primaryColor}bf 100%)`
            };
          color: ${primaryTextColor};
        }

        .default-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) ${
            hasForm ? "minmax(320px, 420px)" : ""
          };
          gap: 48px;
          align-items: center;
          padding: 0 0 16px 0;
        }

        .default-logo {
          width: min(260px, 70vw);
          max-height: 96px;
          object-fit: contain;
          object-position: left center;
          margin-bottom: 36px;
        }

        .default-eyebrow {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 14px;
          background: ${secondaryColor};
          color: ${secondaryTextColor};
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          margin: 0 0 18px;
        }

        .default-title {
          margin: 0;
          color: ${primaryTextColor};
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: 0;
        }

        .default-description {
          max-width: 720px;
          margin: 24px 0 0;
          color: ${primaryTextColor};
          opacity: 0.92;
          font-size: 20px;
          line-height: 1.55;
        }

        .default-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .default-primary-button,
        .default-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 12px;
          padding: 14px 20px;
          font-weight: 800;
          text-decoration: none;
          border: 0;
        }

        .default-primary-button {
          background: ${secondaryColor};
          color: ${secondaryTextColor};
        }

        .default-secondary-button {
          background: rgba(255, 255, 255, 0.12);
          color: ${primaryTextColor};
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
        }

        .default-form-card {
          border-radius: 24px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
          color: #111827;
        }

        .default-form-card h2 {
          margin: 0 0 8px;
          font-size: 24px;
          line-height: 1.15;
        }

        .default-form-card p {
          margin: 0 0 18px;
          color: #4B5563;
          line-height: 1.5;
        }

        .default-meta-panel {
          border-radius: 18px;
          background: #ffffff;
          padding: 18px;
          box-shadow: 0 18px 60px rgba(17,24,39,0.12);
          border-top: 4px solid ${secondaryColor};
        }

        .default-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
        }

        .default-meta-card {
          min-height: 112px;
          padding: 18px;
          border-right: 1px solid #E5E7EB;
        }

        .default-meta-card:last-child {
          border-right: 0;
        }

        .default-meta-card span {
          display: block;
          color: #6B7280;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .default-meta-card strong {
          display: block;
          margin-top: 8px;
          color: #111827;
          line-height: 1.35;
        }

        .default-section {
          padding: 96px 0;
        }

        .default-section:first-of-type {
          padding-top: 132px;
        }

        .default-section-soft {
          background: ${getSoftBackground(primaryColor)};
        }

        .default-section-header {
          max-width: 760px;
          margin-bottom: 36px;
        }

        .default-section-header-centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .default-section-kicker {
          margin: 0 0 10px;
          color: ${primaryColor};
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .default-section-title {
          margin: 0;
          color: #111827;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.05;
          font-weight: 900;
        }

        .default-section-description {
          margin: 16px 0 0;
          color: #4B5563;
          font-size: 18px;
          line-height: 1.65;
        }

        .default-two-column {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 440px);
          gap: 48px;
          align-items: center;
        }

        .default-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .default-support-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 24px;
          align-items: start;
        }

        .default-support-grid-full {
          grid-template-columns: 1fr;
        }

        .default-support-items {
          display: grid;
          gap: 16px;
        }

        .default-support-items-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .default-video-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 20px;
          background: #111827;
          box-shadow: 0 18px 60px rgba(17,24,39,0.12);
        }

        .default-video-frame iframe,
        .default-video-frame video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .default-video-frame video {
          object-fit: cover;
        }

        .default-certification-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .default-certification-heading {
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 0;
        }

        .default-certification-heading-full {
          min-height: auto;
          grid-column: 1 / -1;
          align-items: center;
          text-align: center;
          padding: 0 0 12px;
        }

        .default-certification-card {
          min-height: 160px;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 12px 36px rgba(17,24,39,0.08);
          border: 1px solid #EEF2F7;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .default-certification-card img {
          width: auto;
          max-width: 180px;
          max-height: 64px;
          object-fit: contain;
          object-position: left center;
          margin-bottom: 16px;
        }

        .default-card {
          min-height: 190px;
          border-radius: 18px;
          background: #ffffff;
          padding: 24px;
          box-shadow: 0 12px 36px rgba(17,24,39,0.08);
          border: 1px solid #EEF2F7;
        }

        .default-card h3 {
          margin: 0;
          color: #111827;
          font-size: 18px;
          line-height: 1.25;
        }

        .default-card p {
          margin: 12px 0 0;
          color: #4B5563;
          line-height: 1.6;
        }

        .uam-accordion {
          display: grid;
          gap: 12px;
        }

        .uam-accordion-item {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          background: #ffffff;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 28px rgba(17,24,39,0.06);
        }

        .uam-accordion-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .uam-accordion-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          padding: 18px 20px;
          font-weight: 800;
          color: #111827;
        }

        .uam-accordion-icons {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          min-width: 26px;
          height: 26px;
          border-radius: 999px;
          background: ${secondaryColor};
          color: ${secondaryTextColor};
          font-size: 18px;
          line-height: 1;
          font-weight: 900;
        }

        .uam-accordion-minus {
          display: none;
        }

        .uam-accordion-input:checked + .uam-accordion-summary .uam-accordion-plus {
          display: none;
        }

        .uam-accordion-input:checked + .uam-accordion-summary .uam-accordion-minus {
          display: inline;
        }

        .uam-accordion-panel {
          display: none;
          padding: 0 20px 18px;
          color: #4B5563;
          line-height: 1.65;
        }

        .uam-accordion-input:checked + .uam-accordion-summary + .uam-accordion-panel {
          display: block;
        }

        .default-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: ${secondaryColor};
          color: ${secondaryTextColor};
          font-weight: 900;
          margin-bottom: 18px;
        }

        .default-image-frame {
          border-radius: 28px;
          overflow: hidden;
          background: ${getSoftBackground(secondaryColor)};
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .default-image-frame img {
          width: 100%;
          height: 100%;
          min-height: 420px;
          object-fit: cover;
        }

        .default-cta {
          background: ${primaryColor};
          color: ${primaryTextColor};
          padding: 80px 0;
          text-align: center;
        }

        .default-cta h2 {
          margin: 0 auto;
          max-width: 820px;
          color: ${primaryTextColor};
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.05;
          font-weight: 900;
        }

        .default-footer {
          background: #111827;
          color: #ffffff;
          padding: 42px 0;
        }

        .default-footer-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
        }

        .default-footer img {
          width: 220px;
          max-width: 70vw;
          max-height: 84px;
          object-fit: contain;
          object-position: left center;
        }

        .default-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 18px;
          justify-content: flex-end;
          font-size: 14px;
        }

        .default-footer-links a {
          color: #ffffff;
          text-decoration: none;
          opacity: 0.86;
        }

        @media (max-width: 980px) {
          .default-hero-grid,
          .default-support-grid,
          .default-two-column {
            grid-template-columns: 1fr;
          }

          .default-meta-grid,
          .default-card-grid,
          .default-certification-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .default-meta-card:nth-child(2n) {
            border-right: 0;
          }

          .default-section:first-of-type {
            padding-top: 88px;
          }
        }

        @media (max-width: 640px) {
          .default-container {
            width: min(100% - 28px, 1180px);
          }

          .default-hero-grid {
            min-height: auto;
            padding: 34px 0 72px;
          }

          .default-meta-grid,
          .default-card-grid,
          .default-certification-grid {
            grid-template-columns: 1fr;
          }

          .default-meta-card,
          .default-meta-card:nth-child(2n) {
            border-right: 0;
            border-bottom: 1px solid #E5E7EB;
          }

          .default-meta-card:last-child {
            border-bottom: 0;
          }

          .default-section {
            padding: 64px 0;
          }
        }
      `}</style>

      <section className="default-hero">
        <div className="default-container">
          <div className="default-hero-grid">
            <div>
              {logo ? (
                <img src={logo} alt={brandName} className="default-logo" />
              ) : null}

              <p className="default-eyebrow">
                {hero.eyebrow || `Estudia en ${brandName}`}
              </p>

              {heroTitle ? (
                <h1 className="default-title">{heroTitle}</h1>
              ) : null}

              {heroDescription ? (
                <p className="default-description">{heroDescription}</p>
              ) : null}

              {metaItems.length > 0 ? (
                <div className="default-meta-panel">
                  <div className="default-meta-grid">
                    {metaItems.map((item, index) => (
                      <MetaCard
                        key={`${item.label}-${index}`}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

            </div>

            {hasForm ? (
              <div id="default-form" className="default-form-card">
                {form.programName || fullTitle ? (
                  <h2>{form.programName || fullTitle}</h2>
                ) : null}
                {fullTitle ? <p>{fullTitle}</p> : null}
                {hasConfiguredForm && mode === "export" ? (
                  form.scriptCode ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: form.scriptCode,
                      }}
                    />
                  ) : form.scriptUrl ? (
                    <script type="text/javascript" src={form.scriptUrl} />
                  ) : null
                ) : hasConfiguredForm && form.scriptCode ? (
                  <ClientifyFormEmbed code={form.scriptCode} />
                ) : hasConfiguredForm && form.scriptUrl ? (
                  <Script src={form.scriptUrl} strategy="afterInteractive" />
                ) : (
                  <GenericLeadForm
                    programName={form.programName || fullTitle || title}
                    primaryColor={primaryColor}
                    buttonText={ctaButton || "Submit"}
                  />
                )}
              </div>
            ) : null}
          </div>

        </div>
      </section>

      {hasCertifications ? (
        <section className="default-section default-section-soft">
          <div className="default-container">
            <div className="default-certification-grid">
              <div
                className={`default-certification-heading ${
                  hasCertificationHeadingRow
                    ? "default-certification-heading-full"
                    : ""
                }`}
              >
                <h2 className="default-section-title">Accreditations</h2>
              </div>

              {activeCertifications.map(({ certification, index }) => {
                const certificationLogo = getCertificationLogo(
                  certification,
                  landing.logoMode,
                );
                const certificationResolution = getCertificationResolution(
                  landing,
                  certification,
                  index,
                );

                return (
                  <article className="default-certification-card" key={index}>
                    {certificationLogo ? (
                      <img src={certificationLogo} alt={certification.name} />
                    ) : null}
                    {certification.url ? (
                      <a
                        href={certification.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: primaryColor,
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {certification.name}
                      </a>
                    ) : (
                      <strong>{certification.name}</strong>
                    )}
                    {certificationResolution ? (
                      <p
                        style={{
                          margin: "8px 0 0 0",
                          color: "#4B5563",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {certificationResolution}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {hasWhyStudy ? (
        <section id="default-content" className="default-section">
          <div className="default-container default-two-column">
            <div>
              <div className="default-section-header">
                <p className="default-section-kicker">{brandName}</p>
                {whyStudy.title ? (
                  <h2 className="default-section-title">{whyStudy.title}</h2>
                ) : null}
                {whyStudy.description ? (
                  <p className="default-section-description">
                    {whyStudy.description}
                  </p>
                ) : null}
              </div>

              {whyStudyItems.length > 0 ? (
                <LandingAccordion
                  items={whyStudyItems}
                  id={`default-why-study-${landing.slug}`}
                />
              ) : null}
            </div>

            {whyStudy.image || logo ? (
              <div className="default-image-frame">
                {whyStudy.image ? (
                  <img src={whyStudy.image} alt={whyStudy.title || title} />
                ) : logo ? (
                  <img
                    src={logo}
                    alt={brandName}
                    style={{ width: "70%", height: "auto", minHeight: 0 }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <OpportunityToWorkSection
        opportunityToWork={landing.opportunityToWork ?? landing.careerOutcomes}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      {hasSupport ? (
        <section className="default-section default-section-soft">
          <div className="default-container">
            <div className="default-section-header default-section-header-centered">
              {supportTitle ? (
                <h2 className="default-section-title">{supportTitle}</h2>
              ) : null}
            </div>

            <div
              className={`default-support-grid ${
                hasSupportVideo ? "" : "default-support-grid-full"
              }`}
            >
              {hasSupportVideo ? (
                <div className="default-video-frame">
                  {isDirectVideoUrl(supportVideoUrl) ? (
                    <video controls playsInline preload="metadata">
                      <source src={supportVideoUrl} />
                    </video>
                  ) : (
                    <iframe
                      src={supportVideoUrl}
                      title={supportTitle || fullTitle}
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : null}

              {supportItems.length > 0 ? (
                <div
                  className={`default-support-items ${
                    hasSupportVideo ? "" : "default-support-items-grid"
                  }`}
                >
                  {supportItems.map((item: IconTextItem, index) => (
                    <article className="default-card" key={index}>
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "contain",
                            marginBottom: 18,
                          }}
                        />
                      ) : (
                        <div className="default-icon">{index + 1}</div>
                      )}
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {hasBenefits ? (
        <section className="default-section">
          <div className="default-container">
            <div className="default-section-header default-section-header-centered">
              {benefits.title ? (
                <h2 className="default-section-title">{benefits.title}</h2>
              ) : null}
            </div>

            {benefitItems.length > 0 ? (
              <div className="default-card-grid">
                {benefitItems.map((item: IconTextItem, index) => (
                  <article className="default-card" key={index}>
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt={item.title}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "contain",
                          marginBottom: 18,
                        }}
                      />
                    ) : (
                      <div className="default-icon">{index + 1}</div>
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {hasCta ? (
        <section className="default-cta">
          <div className="default-container">
            {ctaTitle ? <h2>{ctaTitle}</h2> : null}
            {ctaButton && hasForm ? (
              <div style={{ marginTop: 28 }}>
                <a href="#default-form" className="default-primary-button">
                  {ctaButton}
                </a>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="default-footer">
        <div className="default-container default-footer-grid">
          <div>
            {logo ? (
              <img src={logo} alt={brandName} />
            ) : (
              <strong>{brandName}</strong>
            )}
            {brand.description ? (
              <p
                style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.72)" }}
              >
                {brand.description}
              </p>
            ) : null}
          </div>

          {legalLinks.length > 0 ? (
            <nav className="default-footer-links" aria-label="Links legales">
              {legalLinks.map((link: LegalLink, index) => (
                <a key={index} href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </footer>

      {footerScripts.map((script, index) =>
        mode === "export" ? (
          <div
            key={`footer-script-${index}`}
            dangerouslySetInnerHTML={{ __html: script }}
          />
        ) : (
          <ClientifyFormEmbed
            key={`footer-script-${index}`}
            code={script}
            className="hidden"
          />
        ),
      )}
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="default-meta-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
