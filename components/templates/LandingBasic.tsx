type Props = {
  brand: {
    fontBody?: string;
    fontHeading?: string;
    primaryColor: string;
    secondaryColor: string;
    textColor?: string;
  };
  data: {
    title: string;
    subtitle?: string;
    cta?: string;
    benefits?: string[];
  };
};

export default function LandingBasic({ brand, data }: Props) {
  return (
    <div style={{ fontFamily: brand.fontBody }}>
      <section
        style={{
          background: brand.primaryColor,
          color: brand.textColor,
          padding: "60px 20px",
        }}
      >
        <h1 style={{ fontFamily: brand.fontHeading }}>
          {data.title}
        </h1>

        <p>{data.subtitle}</p>

        <button
          style={{
            background: brand.secondaryColor,
            border: "none",
            padding: "12px 20px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          {data.cta ?? "Conoce más"}
        </button>
      </section>

      <section style={{ padding: "40px 20px" }}>
        <ul>
          {(data.benefits ?? []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
