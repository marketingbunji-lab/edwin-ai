"use client";

import { useEffect } from "react";
import { buildEmbeddedFormConfiguratorScript } from "./embeddedFormConfiguratorScript";
import { EMBEDDED_FORM_SELECT_FIELDS, type EmbeddedSelectOption } from "./embeddedFormFieldOptions";

type Props = {
  programName: string;
  campusValue?: string;
  hiddenProgramFieldName?: string;
  originValue?: string;
};

function dispatchFieldEvents(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

function ensureSelectOption(select: HTMLSelectElement, value: string) {
  const existing = Array.from(select.options).find((option) => option.value === value);

  if (existing) {
    select.value = value;
    return;
  }

  const nextOption = document.createElement("option");
  nextOption.value = value;
  nextOption.textContent = value;
  select.appendChild(nextOption);
  select.value = value;
}

function ensureSelectOptions(
  select: HTMLSelectElement,
  options: EmbeddedSelectOption[],
) {
  const currentValue = select.value;

  select.innerHTML = "";

  for (const { value, label, disabled } of options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.disabled = Boolean(disabled);
    select.appendChild(option);
  }

  if (currentValue && options.some((option) => option.value === currentValue)) {
    select.value = currentValue;
    return;
  }

  const firstEnabledOption = options.find((option) => !option.disabled);
  select.value = firstEnabledOption?.value ?? "";
}

function replaceInputWithSelect(
  field: HTMLInputElement,
  options: EmbeddedSelectOption[],
) {
  const select = document.createElement("select");
  select.name = field.name;
  select.id = field.id || field.name;
  select.className = field.className || "bricks-form__input required";
  select.required = field.required;
  select.setAttribute("aria-label", field.getAttribute("aria-label") || "");
  select.style.cssText = field.style.cssText;

  ensureSelectOptions(select, options);
  field.replaceWith(select);

  return select;
}

function hideField(field: HTMLElement | null) {
  if (!field) return;

  field.style.display = "none";
  field.setAttribute("aria-hidden", "true");

  const container =
    field.closest(".bricks-form__field") ||
    field.closest(".form-group") ||
    field.closest(".field") ||
    field.closest(".rd-form-field") ||
    field.closest("[data-type='form-field']") ||
    field.parentElement;

  if (container instanceof HTMLElement && container.tagName !== "FORM") {
    container.style.display = "none";
    container.setAttribute("aria-hidden", "true");
  }

  const documentNode = field.ownerDocument;
  const fieldId = field.getAttribute("id");

  if (fieldId) {
    const label = documentNode.querySelector(`label[for="${CSS.escape(fieldId)}"]`);

    if (label instanceof HTMLElement) {
      label.style.display = "none";
      label.setAttribute("aria-hidden", "true");
    }
  }

  const closestLabel = field.closest("label");

  if (closestLabel instanceof HTMLElement) {
    closestLabel.style.display = "none";
    closestLabel.setAttribute("aria-hidden", "true");
  }
}

function setFieldValue(
  field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  value: string,
) {
  if (field instanceof HTMLSelectElement) {
    ensureSelectOption(field, value);
  } else {
    field.value = value;
  }

  dispatchFieldEvents(field);
}

function findNamedField(
  root: ParentNode,
  fieldNames: string[],
) {
  for (const fieldName of fieldNames) {
    const field = root.querySelector(
      `[name="${CSS.escape(fieldName)}"]`,
    ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

    if (field) {
      return field;
    }
  }

  return null;
}

function upsertHiddenInput(form: HTMLFormElement, fieldName: string, fieldValue: string) {
  let hidden = form.querySelector(
    `input[type="hidden"][name="${CSS.escape(fieldName)}"]`,
  ) as HTMLInputElement | null;

  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = fieldName;
    form.appendChild(hidden);
  }

  hidden.value = fieldValue;
}

function configureDocument(
  root: ParentNode,
  {
    programName,
    campusValue,
    hiddenProgramFieldName,
    originValue,
  }: Required<Props>,
) {
  const forms = Array.from(root.querySelectorAll("form"));

  for (const form of forms) {
    for (const [fieldName, options] of Object.entries(EMBEDDED_FORM_SELECT_FIELDS)) {
      const existingField = form.querySelector(
        `[name="${CSS.escape(fieldName)}"]`,
      ) as HTMLInputElement | HTMLSelectElement | null;

      if (!existingField) continue;

      if (existingField instanceof HTMLSelectElement) {
        ensureSelectOptions(existingField, options);
      } else {
        replaceInputWithSelect(existingField, options);
      }
    }

    if (hiddenProgramFieldName.trim() && programName.trim()) {
      upsertHiddenInput(form, hiddenProgramFieldName, programName);
    }

    if (campusValue.trim()) {
      upsertHiddenInput(form, "campus", campusValue);
    }

    const programField = findNamedField(form, [
      "cf_programas",
      hiddenProgramFieldName,
      "program",
    ]);

    if (programField && programName.trim()) {
      setFieldValue(programField, programName);
      hideField(programField);
    }

    const campusField = findNamedField(form, ["cf_campus", "campus"]);

    if (campusField && campusValue.trim()) {
      setFieldValue(campusField, campusValue);
      hideField(campusField);
    }

    const originField = findNamedField(form, ["cf_origen", "origen"]);

    if (originField && originValue.trim()) {
      setFieldValue(originField, originValue);
      hideField(originField);
    }

    const consentField = form.querySelector(
      "input[name='privacy_data[consent]']",
    ) as HTMLInputElement | null;

    if (consentField) {
      consentField.checked = true;
      consentField.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  return forms.length > 0;
}

export default function EmbeddedFormConfigurator({
  programName,
  campusValue = "",
  hiddenProgramFieldName = "program",
  originValue = "google",
}: Props) {
  useEffect(() => {
    const apply = () => {
      const docs: ParentNode[] = [document];

      for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
        try {
          const iframeDocument =
            iframe.contentDocument || iframe.contentWindow?.document;

          if (iframeDocument) {
            docs.push(iframeDocument);
          }
        } catch {
          // Ignore cross-origin frames the browser doesn't let us inspect.
        }
      }

      let applied = false;

      for (const doc of docs) {
        applied =
          configureDocument(doc, {
            programName,
            campusValue,
            hiddenProgramFieldName,
            originValue,
          }) || applied;
      }

      return applied;
    };

    let tries = 0;
    const maxTries = 30;

    apply();

    const interval = window.setInterval(() => {
      tries += 1;
      const applied = apply();

      if (applied || tries >= maxTries) {
        window.clearInterval(interval);
      }
    }, 600);

    return () => {
      window.clearInterval(interval);
    };
  }, [campusValue, hiddenProgramFieldName, originValue, programName]);

  return null;
}
