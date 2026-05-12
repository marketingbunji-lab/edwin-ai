import type { Landing } from "@/lib/data";

type Props = {
  opportunityToWork?: Landing["opportunityToWork"];
  primaryColor: string;
  secondaryColor: string;
};

function getItems(items?: NonNullable<Landing["opportunityToWork"]>["items"]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return [item?.title, item?.description || item?.content || item?.text]
        .filter(Boolean)
        .join(": ")
        .trim();
    })
    .filter(Boolean);
}

export default function OpportunityToWorkSection({
  opportunityToWork,
  primaryColor,
  secondaryColor,
}: Props) {
  const title = opportunityToWork?.title?.trim() ?? "";
  const subtitle = opportunityToWork?.subtitle?.trim() ?? "";
  const items = getItems(opportunityToWork?.items);

  if (!title && !subtitle && items.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        background: "#ffffff",
        padding: "72px 24px",
      }}
    >
      <style>{`
        .opportunity-to-work-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 40px;
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 820px) {
          .opportunity-to-work-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="opportunity-to-work-grid">
        <div>
          <p
            style={{
              margin: "0 0 12px",
              color: primaryColor,
              fontSize: 13,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Oportunidades laborales
          </p>

          {title ? (
            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.05,
                fontWeight: 900,
              }}
            >
              {title}
            </h2>
          ) : null}

          {subtitle ? (
            <p
              style={{
                margin: "18px 0 0",
                color: "#4B5563",
                fontSize: 18,
                lineHeight: 1.65,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px minmax(0, 1fr)",
                  gap: 16,
                  alignItems: "start",
                  border: "1px solid #E5E7EB",
                  borderRadius: 18,
                  background: "#F9FAFB",
                  padding: 18,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: secondaryColor,
                    color: "#111827",
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </span>
                <p
                  style={{
                    margin: 0,
                    color: "#111827",
                    fontSize: 17,
                    lineHeight: 1.55,
                    fontWeight: 700,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
