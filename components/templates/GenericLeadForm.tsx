type Props = {
  programName: string;
  primaryColor: string;
  buttonText?: string;
  submitLabel?: string;
  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
};

export default function GenericLeadForm({
  programName,
  primaryColor,
  buttonText = "Submit",
  submitLabel = "Submit",
  fullNameLabel = "Full Name",
  phoneLabel = "Phone",
  emailLabel = "Email",
}: Props) {
  const fieldStyle = {
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: 12,
    padding: "12px 14px",
    color: "#111827",
    fontSize: 14,
    outline: "none",
    background: "#ffffff",
  };

  return (
    <form action="#" method="post" style={{ display: "grid", gap: 14 }}>
      <input type="hidden" name="program" value={programName} />

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ color: "#374151", fontSize: 13, fontWeight: 700 }}>
          {fullNameLabel}
        </span>
        <input
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder={fullNameLabel}
          style={fieldStyle}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ color: "#374151", fontSize: 13, fontWeight: 700 }}>
          {phoneLabel}
        </span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder={phoneLabel}
          style={fieldStyle}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ color: "#374151", fontSize: 13, fontWeight: 700 }}>
          {emailLabel}
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={emailLabel}
          style={fieldStyle}
        />
      </label>

      <button
        type="submit"
        style={{
          minHeight: 48,
          border: 0,
          borderRadius: 12,
          background: primaryColor,
          color: "#ffffff",
          cursor: "pointer",
          fontSize: 15,
          fontWeight: 800,
          marginTop: 4,
          padding: "13px 18px",
        }}
      >
        {buttonText || submitLabel}
      </button>
    </form>
  );
}
