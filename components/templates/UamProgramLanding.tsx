/* eslint-disable @next/next/no-img-element, @next/next/no-sync-scripts */
import Script from "next/script";
import { getBrandLogo } from "@/lib/brandLogo";
import type {
  Brand,
  BrandCertification,
  IconTextItem,
  Landing,
  LegalLink,
} from "@/lib/data";
import ClientifyFormEmbed from "../forms/ClientifyFormEmbed";
import ClientifyProgramSelector from "../forms/ClientifyProgramSelector";
import LandingAccordion from "../ui/LandingAccordion";

type Props = {
  brand: Brand;
  landing: Landing;
  mode?: "preview" | "export";
};

function getClientifySelectorScript(programName: string) {
  return `
    const TARGET_TEXT = ${JSON.stringify(programName)};

    setTimeout(() => {
      function findSelectByOptionText(doc, text) {
        for (const sel of doc.querySelectorAll('select')) {
          const match = [...sel.options].find((o) => o.text.trim() === text);
          if (match) return { select: sel, option: match };
        }
        return null;
      }

      const docs = [document];
      for (const iframe of document.querySelectorAll('iframe')) {
        try {
          const idoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (idoc) docs.push(idoc);
        } catch (e) {}
      }

      let chosen = null;
      for (const d of docs) {
        chosen = findSelectByOptionText(d, TARGET_TEXT);
        if (chosen) break;
      }

      if (!chosen) return;

      const { select } = chosen;
      select.style.display = "none";
      select.setAttribute("aria-hidden", "true");
    }, 4000);
  `;
}

function getScheduleMeta(schedule?: string) {
  const normalized = schedule?.trim().toLowerCase() ?? "";

  if (normalized === "diurna") {
    return {
      label: "Diurna",
      icon: "sun" as const,
    };
  }

  if (normalized === "nocturna") {
    return {
      label: "Nocturna",
      icon: "moon" as const,
    };
  }

  return null;
}

function getOverlayColorValue(color?: string) {
  const value = color?.trim();

  if (!value) return "rgba(0, 105, 163, 0.62)";

  if (value.startsWith("#")) {
    const hex = value.slice(1);

    if (hex.length === 3) {
      const red = Number.parseInt(hex[0] + hex[0], 16);
      const green = Number.parseInt(hex[1] + hex[1], 16);
      const blue = Number.parseInt(hex[2] + hex[2], 16);

      return `rgba(${red}, ${green}, ${blue}, 0.62)`;
    }

    if (hex.length === 6) {
      const red = Number.parseInt(hex.slice(0, 2), 16);
      const green = Number.parseInt(hex.slice(2, 4), 16);
      const blue = Number.parseInt(hex.slice(4, 6), 16);

      return `rgba(${red}, ${green}, ${blue}, 0.62)`;
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
    (item) => `${item.name || ""}|${item.url || ""}` === certificationKey,
  );

  return matchedItem?.resolutionText ?? items[index]?.resolutionText ?? "";
}

function ScheduleIcon({ icon }: { icon: "sun" | "moon" }) {
  if (icon === "sun") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 5 3.79 8.79 8.79 8.79Z" />
    </svg>
  );
}

export default function UamProgramLanding({
  brand,
  landing,
  mode = "preview",
}: Props) {
  const hero = landing?.hero ?? {};
  const whyStudy = landing?.whyStudy ?? {};
  const supportSection = landing?.supportSection ?? {};
  const benefits = landing?.benefits ?? {};
  const cta = landing?.cta ?? {};
  const form = landing?.form ?? {};

  const programInfo = landing?.programInfo ?? [];
  const whyStudyItems = whyStudy?.items ?? [];
  const supportItems = supportSection?.items ?? [];
  const hasSupportVideo = Boolean(supportSection?.videoUrl);
  const benefitItems = benefits?.items ?? [];
  const legalLinks = brand?.legalLinks ?? [];
  const footerScripts = landing?.footerScripts ?? [];
  const certificationSettings = landing?.certifications ?? {};
  const brandCertifications = brand?.certifications ?? [];
  const activeCertifications = brandCertifications
    .map((certification, index) => {
      const items = landing?.certifications?.items ?? [];
      const certificationKey = `${certification.name || ""}|${certification.url || ""}`;
      const landingItem =
        items.find(
          (item) =>
            `${item.name || ""}|${item.url || ""}` === certificationKey,
        ) ?? items[index];

      return {
        certification,
        index,
        enabled: Boolean(landingItem?.enabled),
      };
    })
    .filter((item) => item.enabled);
  const hasCertifications = Boolean(
    certificationSettings.enabled && activeCertifications.length,
  );

  const primaryColor = brand?.primaryColor ?? "#0069A3";
  const secondaryColor = brand?.secondaryColor ?? "#F8D74A";
  const logo = brand ? getBrandLogo(brand, landing?.logoMode || "dark") : "";
  const brandName = brand?.name ?? "Brand";
  const fontFamily = brand?.typography?.fontFamily?.trim() || "Inter, Arial, sans-serif";
  const googleFontHref = brand?.typography?.googleFontHref?.trim() || "";
  const manizalesImage =
    "https://www.autonoma.edu.co/sites/default/files/styles/webp/public/2021-11/conolauam.jpg.webp";
  const scheduleMeta = getScheduleMeta(landing?.schedule);
  const heroOverlayColor = getOverlayColorValue(hero?.overlayColor);
  const heroInfoOverlayColor = hero?.overlayColor?.trim()
    ? getOverlayColorValue(hero.overlayColor).replace("0.62)", "0.7)")
    : "rgba(15, 121, 181, 0.7)";
  const showManizalesSection =
    landing?.programType?.trim().toLowerCase() === "pregrado" &&
    hero?.modality?.trim().toLowerCase() === "presencial" &&
    landing?.schedule?.trim().toLowerCase() === "diurna";

  const title = landing?.title ?? "Programa";
  const fullTitle = landing?.fullTitle ?? title;

  return (
    <div
      className="uam-landing"
      style={{ fontFamily, color: "#111827", margin: 0 }}
    >
      <style>{`
        ${googleFontHref ? `@import url("${googleFontHref}");` : ""}

        .uam-landing img,
        .uam-landing iframe {
          max-width: 100%;
        }

        .uam-landing {
          container-type: inline-size;
        }

        .uam-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        .uam-hero-shell {
          position: relative;
          padding-top: 48px;
          padding-bottom: 48px;
        }

        .uam-hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(120px, 0.34fr) minmax(320px, 420px);
          gap: 32px;
          align-items: center;
        }

        .uam-hero-content {
          color: #fff;
          position: relative;
          z-index: 2;
        }

        .uam-hero-title {
          margin: 0;
          font-size: clamp(2.3rem, 5vw, 4rem);
          line-height: 1.05;
          font-weight: 800;
        }

        .uam-hero-logo {
          width: 280px;
          max-width: 100%;
          height: auto;
          margin-bottom: 24px;
        }

        .uam-hero-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-top: 24px;
          max-width: 720px;
        }

        .uam-hero-person {
          position: absolute;
          bottom: 0;
          right: 32%;
          z-index: 1;
          width: min(38vw, 540px);
          height: auto;
          pointer-events: none;
        }

        .uam-form-column {
          position: relative;
          z-index: 3;
        }

        .uam-two-column-section {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 32px;
          align-items: end;
        }

        .uam-support-grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .uam-support-grid-full {
          grid-template-columns: 1fr;
        }

        .uam-support-items {
          display: grid;
          gap: 16px;
        }

        .uam-support-items-three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .uam-benefits-grid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .uam-certifications-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        .uam-certifications-heading {
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 0;
        }

        .uam-certification-card {
          border-radius: 18px;
          background: #fff;
          min-height: 160px;
          padding: 24px;
          border: 1px solid #E5E7EB;
          box-shadow: 0 12px 36px rgba(17,24,39,0.08);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .uam-certification-card img {
          width: auto;
          max-width: 180px;
          max-height: 64px;
          object-fit: contain;
          object-position: left center;
          margin-bottom: 16px;
        }

        .uam-accordion {
          display: grid;
          gap: 12px;
        }

        .uam-accordion-item {
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          background: #fff;
          overflow: hidden;
          position: relative;
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
          font-weight: 700;
          color: #111827;
        }

        .uam-accordion-icons {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          min-width: 24px;
          height: 24px;
          color: #6B7280;
          font-size: 18px;
          line-height: 1;
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
          line-height: 1.6;
        }

        .uam-accordion-input:checked + .uam-accordion-summary + .uam-accordion-panel {
          display: block;
        }

        @media (max-width: 1199.98px) {
          .uam-hero-person {
            right: 38%;
            width: min(34vw, 420px);
          }
        }

        @media (max-width: 991.98px) {
          .uam-hero-grid,
          .uam-two-column-section,
          .uam-support-grid {
            grid-template-columns: 1fr;
          }

          .uam-hero-grid {
            gap: 24px;
          }

          .uam-hero-spacer {
            display: none;
          }

          .uam-hero-title {
            font-size: clamp(2.35rem, 9vw, 4rem);
          }

          .uam-hero-person {
            display: none;
          }

          .uam-form-column {
            grid-row: 2;
          }

          .uam-support-items-three {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 991.98px) {
          .uam-hero-grid,
          .uam-two-column-section,
          .uam-support-grid {
            grid-template-columns: 1fr;
          }

          .uam-hero-grid {
            gap: 24px;
          }

          .uam-hero-spacer {
            display: none;
          }

          .uam-hero-title {
            font-size: clamp(2.35rem, 9cqw, 4rem);
          }

          .uam-hero-person {
            display: none;
          }

          .uam-form-column {
            grid-row: 2;
          }

          .uam-support-items-three {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 767.98px) {
          .uam-benefits-grid,
          .uam-certifications-grid {
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 575.98px) {
          .uam-container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .uam-hero-shell {
            padding-top: 36px;
            padding-bottom: 40px;
          }

          .uam-hero-logo {
            width: 230px;
          }

          .uam-hero-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767.98px) {
          .uam-benefits-grid,
          .uam-certifications-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 575.98px) {
          .uam-container {
            padding-left: 16px;
            padding-right: 16px;
          }

          .uam-hero-shell {
            padding-top: 36px;
            padding-bottom: 40px;
          }

          .uam-hero-logo {
            width: 230px;
          }

          .uam-hero-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section
        style={{
          backgroundImage: hero?.backgroundImage
            ? `linear-gradient(90deg, ${heroOverlayColor}, rgba(0, 65, 105, 0)), url(${hero.backgroundImage})`
            : "linear-gradient(90deg, rgba(0, 65, 105, 0.92), rgba(0, 105, 163, 0.62))",
          backgroundPosition: "center",
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <div
          className="uam-container uam-hero-shell"
        >
          <div
            className="uam-hero-grid"
          >
            <div className="uam-hero-content">
              {logo ? (
                <img
                  src={logo}
                  alt={brandName}
                  className="uam-hero-logo"
                />
              ) : null}

              <p style={{ margin: "0 0 16px 0", fontSize: 18, color: "#fff" }}>
                {hero?.eyebrow ?? `Estudia en ${brandName}`}
              </p>

              <h1
                className="uam-hero-title"
                style={{ color: "#fff" }}
              >
                {hero?.highlight ? (
                  <>
                    <span style={{ color: secondaryColor }}>{hero.highlight}</span>{" "}
                    {hero?.title ?? title}
                  </>
                ) : (
                  hero?.title ?? fullTitle
                )}
              </h1>

              {(hero?.description || hero?.supportText) && (
                <>
                  {hero?.description ? (
                    <p style={{ margin: "20px 0 0 0", fontSize: 18, color: "#fff" }}>
                      {hero.description}
                    </p>
                  ) : null}

                  {hero?.supportText ? (
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {hero.supportText}
                    </p>
                  ) : null}
                </>
              )}

              {hero?.modality ? (
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontSize: 13,
                      fontWeight: 700,
                      background: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      boxShadow: `inset 0 0 0 1px ${secondaryColor}`,
                    }}
                  >
                    {hero.modality}
                  </span>

                  {scheduleMeta ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        borderRadius: 999,
                        padding: "8px 14px",
                        fontSize: 13,
                        fontWeight: 700,
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        boxShadow: `inset 0 0 0 1px ${secondaryColor}`,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          color: secondaryColor,
                        }}
                      >
                        <ScheduleIcon icon={scheduleMeta.icon} />
                      </span>
                      <span>{scheduleMeta.label}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}

              {(hero?.semesterPrice || programInfo.length > 0) && (
                <div
                  className="uam-hero-info-grid"
                >
                  <div>
                    {hero?.semesterPrice ? (
                      <p style={{ margin: 0, color: "#fff" }}>
                        <span style={{ fontSize: "2.2rem", fontWeight: 700 }}>
                          {hero.semesterPrice}
                        </span>
                        <br />
                        Valor semestre
                      </p>
                    ) : null}
                  </div>

                  {programInfo.length > 0 ? (
                    <div
                      style={{
                        background: heroInfoOverlayColor,
                        borderLeft: `4px solid ${secondaryColor}`,
                        padding: 16,
                      }}
                    >
                      <p style={{ margin: 0, color: "#fff", lineHeight: 1.5 }}>
                        <strong>Información general</strong>
                        <br />
                        {programInfo.map((item: string, i: number) => (
                          <span key={i}>
                            {item}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {hero?.personImage ? (
              <img
                src={hero.personImage}
                alt={fullTitle}
                className="uam-hero-person"
              />
            ) : null}

            <div className="uam-hero-spacer" />

            <div className="uam-form-column">
              <div
                id="anclaForm"
                className="form-shell"
              >
                {form?.scriptCode || form?.scriptUrl ? (
                  mode === "export" ? (
                    <>
                      {form?.scriptCode ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: form.scriptCode,
                          }}
                        />
                      ) : (
                        <script type="text/javascript" src={form.scriptUrl} />
                      )}
                      {form?.programName ? (
                        <script
                          dangerouslySetInnerHTML={{
                            __html: getClientifySelectorScript(form.programName),
                          }}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      {form?.scriptCode ? (
                        <ClientifyFormEmbed code={form.scriptCode} />
                      ) : (
                        <Script src={form.scriptUrl} strategy="afterInteractive" />
                      )}
                      {form?.programName ? (
                        <ClientifyProgramSelector programName={form.programName} />
                      ) : null}
                    </>
                  )
                ) : (
                  <div
                    style={{
                      border: "1px dashed #D1D5DB",
                      borderRadius: 16,
                      padding: 20,
                      background: "#F9FAFB",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700 }}>Formulario no configurado</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#6B7280" }}>
                      Puedes agregar <code>form.scriptUrl</code> en el JSON de esta landing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasCertifications ? (
        <section
          style={{
            background: "#F8F8FF",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="uam-certifications-grid">
              <div className="uam-certifications-heading">
                <h2
                  style={{
                    margin: 0,
                    fontSize: 36,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  Acreditaciones
                </h2>
              </div>

              {activeCertifications.map(({ certification, index }) => {
                const certificationLogo = getCertificationLogo(
                  certification,
                  landing?.logoMode,
                );
                const certificationResolution = getCertificationResolution(
                  landing,
                  certification,
                  index,
                );

                return (
                  <article className="uam-certification-card" key={index}>
                    {certificationLogo ? (
                      <img
                        src={certificationLogo}
                        alt={certification.name}
                      />
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

      {(whyStudy?.title || whyStudy?.description || whyStudyItems.length > 0) && (
        <section style={{ padding: "64px 24px" }}>
          <div
            className="uam-two-column-section"
          >
            <div>
              {whyStudy?.title ? (
                <h2
                  style={{
                    margin: 0,
                    fontSize: 36,
                    lineHeight: 1.1,
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  {whyStudy.title}
                </h2>
              ) : null}

              {whyStudy?.description ? (
                <p style={{ margin: "16px 0 24px 0", fontSize: 18, color: "#374151" }}>
                  {whyStudy.description}
                </p>
              ) : null}

              {whyStudyItems.length > 0 ? (
                <LandingAccordion items={whyStudyItems} id="whyStudyAccordion" />
              ) : (
                <div
                  style={{
                    border: "1px dashed #D1D5DB",
                    borderRadius: 14,
                    background: "#F9FAFB",
                    padding: 18,
                    color: "#6B7280",
                  }}
                >
                  Esta landing todavía no tiene beneficios o razones del programa configuradas.
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              {whyStudy?.image ? (
                <img
                  src={whyStudy.image}
                  alt={whyStudy?.title ?? fullTitle}
                  style={{
                    width: "100%",
                    minHeight: 520,
                    objectFit: "contain",
                    objectPosition: "center bottom",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    minHeight: 520,
                    borderRadius: 24,
                    background:
                      "linear-gradient(180deg, rgba(0,105,163,0.08), rgba(248,215,74,0.18))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <p style={{ margin: 0, color: "#6B7280" }}>Imagen de apoyo del programa</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {showManizalesSection ? (
        <section
          style={{
            padding: "64px 24px",
            background: "#ffffff",
          }}
        >
          <div className="uam-two-column-section" style={{ alignItems: "center" }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 36,
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Manizales
              </h2>

              <p
                style={{
                  margin: "16px 0 0 0",
                  fontSize: 22,
                  lineHeight: 1.3,
                  color: "#111827",
                }}
              >
                <strong>Calidad de vida para tu formación universitaria</strong>
              </p>

              <p
                style={{
                  margin: "16px 0 0 0",
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: "#374151",
                }}
              >
                Reconocida por la UNESCO como &quot;Ciudad del Aprendizaje&quot; y por ONU-Hábitat
                como referente en sostenibilidad y calidad de vida, Manizales ofrece un entorno
                tranquilo, asequible y enriquecedor para tu formación académica.
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <img
                src={manizalesImage}
                alt="Manizales"
                style={{
                  width: "100%",
                  borderRadius: 24,
                  display: "block",
                  objectFit: "cover",
                  minHeight: 320,
                }}
              />
            </div>
          </div>
        </section>
      ) : null}

      {(supportSection?.title || supportSection?.videoUrl || supportItems.length > 0) && (
        <section
          style={{
            background: "#FED821",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {supportSection?.title ? (
              <h2
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {supportSection.title}
              </h2>
            ) : null}

            <div
              className={`uam-support-grid ${
                hasSupportVideo ? "" : "uam-support-grid-full"
              }`}
            >
              {hasSupportVideo ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%",
                    background: "#111827",
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={supportSection.videoUrl}
                    title={supportSection.title ?? fullTitle}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </div>
              ) : null}

              <div
                className={`uam-support-items ${
                  hasSupportVideo ? "" : "uam-support-items-three"
                }`}
              >
                {supportItems.length > 0 ? (
                  supportItems.map((item: IconTextItem, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#FFDB47",
                        borderRadius: 18,
                        padding: 20,
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          minWidth: 64,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {item?.icon ? (
                          <img
                            src={item.icon}
                            alt={item?.title ?? `Icono ${i + 1}`}
                            style={{ width: 48, height: "auto" }}
                          />
                        ) : null}
                      </div>

                      <div>
                        <p style={{ margin: 0, lineHeight: 1.6 }}>
                          <strong>{item?.title ?? `Beneficio ${i + 1}`}</strong>
                          <br />
                          {item?.text ?? ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background: "#FFDB47",
                      borderRadius: 18,
                      padding: 20,
                      color: "#374151",
                    }}
                  >
                    Esta sección aún no tiene cards configuradas.
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <a
                href="#anclaForm"
                style={{
                  display: "inline-block",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: primaryColor,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                ¡Inscríbete ahora!
              </a>
            </div>
          </div>
        </section>
      )}

      {(benefits?.title || benefitItems.length > 0) && (
        <section
          style={{
            background: "#F8F8FF",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {benefits?.title ? (
              <h2
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {benefits.title}
              </h2>
            ) : null}

            {benefitItems.length > 0 ? (
              <div
                className="uam-benefits-grid"
              >
                {benefitItems.map((item: IconTextItem, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: 24,
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      minHeight: 180,
                    }}
                  >
                    <div style={{ width: 48, minWidth: 48 }}>
                      {item?.icon ? (
                        <img
                          src={item.icon}
                          alt={item?.title ?? `Icono ${i + 1}`}
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>
                        <strong>{item?.title ?? `Beneficio ${i + 1}`}</strong>
                        <br />
                        {item?.text ?? ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 24,
                  border: "1px dashed #D1D5DB",
                  borderRadius: 18,
                  padding: 24,
                  background: "#fff",
                  textAlign: "center",
                  color: "#6B7280",
                }}
              >
                Esta landing aún no tiene beneficios configurados.
              </div>
            )}
          </div>
        </section>
      )}

      {(cta?.title || cta?.button) && (
        <section
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 68, 105, 0.6), rgba(0, 68, 105, 0.6)), url('https://bunjigrowth.io/wp-content/uploads/2026/04/students-group.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            {cta?.title ? (
              <h2
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: 40,
                  fontWeight: 800,
                }}
              >
                {cta.title}
              </h2>
            ) : null}

            {cta?.button ? (
              <a
                href="#anclaForm"
                style={{
                  marginTop: 24,
                  display: "inline-block",
                  padding: "14px 24px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: secondaryColor,
                  color: "#111827",
                  fontWeight: 700,
                }}
              >
                {cta.button}
              </a>
            ) : null}
          </div>
        </section>
      )}

      <footer
        style={{
          background: primaryColor,
          color: "#fff",
          padding: "40px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          {logo ? (
            <img
              src={logo}
              alt={brandName}
              style={{ width: 280, maxWidth: "100%", height: "auto" }}
            />
          ) : null}

          {legalLinks.length > 0 ? (
            <div style={{ marginTop: 20, fontSize: 14, lineHeight: 1.8 }}>
              {legalLinks.map((link: LegalLink, i) => (
                <span key={i}>
                  <a
                    href={link?.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {link?.label ?? `Link ${i + 1}`}
                  </a>
                  {i < legalLinks.length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              Links legales pendientes por configurar.
            </div>
          )}
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
        )
      )}
    </div>
  );
}
