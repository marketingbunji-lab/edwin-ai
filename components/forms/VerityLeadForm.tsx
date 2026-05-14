type Props = {
  form: {
    programName?: string;
    campus?: string;
    campusOptions?: Array<{
      label?: string;
      campus?: string;
      campaigntype?: string;
    }>;
    language?: string;
    campaigntype?: string;
    campaigncode?: string;
    leadsource?: string;
    leadid?: string;
    tenantid?: string;
    schoolname?: string;
    channel?: string;
    veritySysKey?: string;
    verityLeadPostUrl?: string;
    hiddenProgramFieldName?: string;
    submitLabel?: string;
  };
  buttonText?: string;
  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  zipLabel?: string;
};

function toDomId(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function VerityLeadForm({
  form,
  buttonText = "Submit",
  fullNameLabel = "Full Name",
  phoneLabel = "Phone",
  emailLabel = "Email",
  zipLabel = "ZIP Code",
}: Props) {
  const formId = `verity-form-${toDomId(form.programName || "program")}`;
  const statusId = `${formId}-status`;
  const hiddenProgramFieldName = form.hiddenProgramFieldName?.trim() || "program";
  const programValue = form.programName || "";
  const campusValue = form.campus || "";
  const campusOptions = (form.campusOptions ?? []).filter(
    (option) => option?.campus?.trim(),
  );
  const hasCampusSelect = campusOptions.length > 1;
  const defaultCampusOption = campusOptions[0];
  const submitLabel = buttonText || form.submitLabel || "Submit";
  const showZipField = Boolean(zipLabel?.trim());
  const campusTypeMap = Object.fromEntries(
    campusOptions.map((option) => [
      option.campus || "",
      option.campaigntype || option.campus || "",
    ]),
  );

  const leadDefaults = {
    veritySysKey: form.veritySysKey || "",
    tenantid: form.tenantid || "",
    schoolname: form.schoolname || "",
    channel: form.channel || "",
    language: form.language || "English",
    campaigntype: form.campaigntype || "",
    campaigncode: form.campaigncode || "",
    leadsource: form.leadsource || "",
    leadid: form.leadid || "",
    campus: defaultCampusOption?.campus || campusValue,
    defaultCampaigntype:
      defaultCampusOption?.campaigntype ||
      defaultCampusOption?.campus ||
      form.campaigntype ||
      "",
    program: programValue,
  };

  const script = `(function () {
    const form = document.getElementById(${JSON.stringify(formId)});
    const status = document.getElementById(${JSON.stringify(statusId)});
    if (!form || form.dataset.verityBound === "true") return;
    form.dataset.verityBound = "true";

    const endpoint = ${JSON.stringify(form.verityLeadPostUrl || "")};
    const defaults = ${JSON.stringify(leadDefaults)};
    const campusTypeMap = ${JSON.stringify(campusTypeMap)};
    const campusField = form.querySelector('select[name="campus"], input[name="campus"]');
    const campaigntypeField = form.querySelector('input[name="campaigntype"]');

    const syncCampusType = () => {
      if (!campusField || !campaigntypeField) return;
      const selectedCampus = String(campusField.value || defaults.campus || "");
      campaigntypeField.value =
        campusTypeMap[selectedCampus] ||
        defaults.defaultCampaigntype ||
        selectedCampus;
    };

    if (campusField && campusField.tagName === "SELECT") {
      syncCampusType();
      campusField.addEventListener("change", syncCampusType);
    }

    const setStatus = (message, tone) => {
      if (!status) return;
      status.textContent = message;
      status.dataset.tone = tone;
    };

    const splitName = (fullName) => {
      const cleaned = String(fullName || "").trim().replace(/\\s+/g, " ");
      if (!cleaned) return { fname: "", lname: "" };
      const parts = cleaned.split(" ");
      return {
        fname: parts.shift() || "",
        lname: parts.join(" "),
      };
    };

    const createLeadId = () =>
      Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      if (!endpoint) {
        setStatus("Missing Verity endpoint.", "error");
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").replace(/\\D/g, "");
      const email = String(formData.get("email") || "").trim();
      const zip = String(formData.get("zip") || "").trim();
      const { fname, lname } = splitName(name);

      const payload = new URLSearchParams();

      Object.entries(defaults).forEach(([key, value]) => {
        payload.append(key, value || "");
      });

      payload.set("fname", fname);
      payload.set("lname", lname);
      payload.set("email", email);
      payload.set("phone", phone);
      payload.set("zip", zip);
      const selectedCampus = String(formData.get("campus") || defaults.campus || "");
      const selectedCampusType = String(
        formData.get("campaigntype") || defaults.defaultCampaigntype || selectedCampus,
      );
      payload.set("campus", selectedCampus);
      payload.set("campaigntype", selectedCampusType);
      payload.set("program", String(formData.get(${JSON.stringify(hiddenProgramFieldName)}) || defaults.program || ""));
      payload.set("leadid", defaults.leadid || createLeadId());

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.forEach((value, key) => {
        if (!payload.has(key)) {
          payload.append(key, value);
        }
      });

      if (currentUrl.hash.length > 1) {
        const hashParams = new URLSearchParams(currentUrl.hash.slice(1));
        hashParams.forEach((value, key) => {
          if (!payload.has(key)) {
            payload.append(key, value);
          }
        });
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }
        setStatus("", "idle");
        console.log("[Verity] Sending payload", Object.fromEntries(payload.entries()));

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload.toString(),
        });

        const responseText = await response.text();
        let responseBody;

        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = responseText;
        }

        console.log("[Verity] Response", {
          status: response.status,
          ok: response.ok,
          body: responseBody,
        });

        if (!response.ok) {
          const message =
            typeof responseBody === "object" &&
            responseBody &&
            "Message" in responseBody &&
            typeof responseBody.Message === "string"
              ? responseBody.Message
              : "The lead could not be sent.";

          throw new Error(message);
        }

        setStatus("Information sent successfully.", "success");
        form.reset();
      } catch (error) {
        console.error(error);
        setStatus("There was an error sending your information.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }());`;

  return (
    <>
      <form
        id={formId}
        className="grid gap-[14px]"
        action="#"
        method="post"
      >
        <input
          type="hidden"
          name={hiddenProgramFieldName}
          value={programValue}
        />

        <label className="grid min-w-0 gap-1.5">
          <span className="text-[13px] font-bold text-slate-700">
            {fullNameLabel}
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={fullNameLabel}
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
          />
        </label>

        <label className="grid min-w-0 gap-1.5">
          <span className="text-[13px] font-bold text-slate-700">
            {emailLabel}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={emailLabel}
            className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
          />
        </label>

        <div
          className={
            showZipField
              ? "grid gap-[14px] md:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]"
              : "grid gap-[14px]"
          }
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-[13px] font-bold text-slate-700">
              {phoneLabel}
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder={phoneLabel}
              className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
            />
          </label>

          {showZipField ? (
            <label className="grid min-w-0 gap-1.5">
              <span className="text-[13px] font-bold text-slate-700">
                {zipLabel}
              </span>
              <input
                name="zip"
                type="text"
                autoComplete="postal-code"
                required
                inputMode="numeric"
                maxLength={5}
                pattern="[0-9]{5}"
                placeholder={zipLabel}
                className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
              />
            </label>
          ) : null}
        </div>

        {hasCampusSelect ? (
          <label className="grid min-w-0 gap-1.5">
            <span className="text-[13px] font-bold text-slate-700">
              Campus
            </span>
            <select
              name="campus"
              required
              defaultValue={defaultCampusOption?.campus || ""}
              className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/90 px-4 text-[15px] text-slate-950 outline-none transition focus:border-[var(--landing-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)]"
            >
              {campusOptions.map((option) => (
                <option key={`${option.campus}-${option.campaigntype}`} value={option.campus || ""}>
                  {option.label || option.campus}
                </option>
              ))}
            </select>
            <input
              type="hidden"
              name="campaigntype"
              value={defaultCampusOption?.campaigntype || defaultCampusOption?.campus || ""}
            />
          </label>
        ) : (
          <>
            <input
              type="hidden"
              name="campus"
              value={defaultCampusOption?.campus || campusValue}
            />
            <input
              type="hidden"
              name="campaigntype"
              value={
                defaultCampusOption?.campaigntype ||
                defaultCampusOption?.campus ||
                form.campaigntype ||
                ""
              }
            />
          </>
        )}

        <button
          type="submit"
          className="mt-2 min-h-14 rounded-xl border-0 bg-[linear-gradient(135deg,var(--landing-primary),var(--landing-primary-dark))] px-5 py-[15px] text-base font-extrabold tracking-[0.01em] text-white shadow-lg shadow-[color-mix(in_srgb,var(--landing-primary)_25%,transparent)] transition duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[color-mix(in_srgb,var(--landing-primary)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>

        <p
          id={statusId}
          className="min-h-5 text-center text-sm text-slate-600 data-[tone=error]:text-red-600 data-[tone=success]:text-emerald-600"
          data-tone="idle"
        />
      </form>

      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: script }}
      />
    </>
  );
}
