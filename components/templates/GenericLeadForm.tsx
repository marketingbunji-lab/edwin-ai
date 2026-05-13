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
  buttonText = "Submit",
  submitLabel = "Submit",
  fullNameLabel = "Full Name",
  phoneLabel = "Phone",
  emailLabel = "Email",
}: Props) {
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
          className="h-12 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
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
          className="h-12 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
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
          className="h-12 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
        />
      </label>

      <button
        type="submit"
        className="mt-2 min-h-14 rounded-xl border-0 bg-[linear-gradient(135deg,var(--landing-primary),var(--landing-primary-dark))] px-5 py-[15px] text-base font-extrabold tracking-[0.01em] text-white shadow-lg shadow-[color-mix(in_srgb,var(--landing-primary)_25%,transparent)] transition duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[color-mix(in_srgb,var(--landing-primary)_30%,transparent)]"
      >
        {buttonText || submitLabel}
      </button>
    </form>
  );
}
