"use client";

import type { FormEvent } from "react";

type Props = {
  programName: string;
  primaryColor: string;
  buttonText?: string;
  submitLabel?: string;
  campusValue?: string;
  hiddenProgramFieldName?: string;
  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export default function GenericLeadForm({
  programName,
  buttonText = "Submit",
  submitLabel = "Submit",
  campusValue = "",
  hiddenProgramFieldName = "program",
  fullNameLabel = "Full Name",
  phoneLabel = "Phone",
  emailLabel = "Email",
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "formSubmission",
        formId: form.id || "",
        ...Object.fromEntries(new FormData(form).entries()),
      });
    }
  };

  return (
    <form
      action="#"
      method="post"
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 14 }}
    >
      {hiddenProgramFieldName ? (
        <input
          type="hidden"
          name={hiddenProgramFieldName}
          value={programName}
        />
      ) : null}
      <input type="hidden" name="campus" value={campusValue} />

      <label style={{ display: "grid", gap: 6 }}>
        <span className="text-[13px] font-bold text-slate-700">
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
        <span className="text-[13px] font-bold text-slate-700">
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
        <span className="text-[13px] font-bold text-slate-700">
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
