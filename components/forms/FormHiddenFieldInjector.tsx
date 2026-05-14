"use client";

import { useEffect } from "react";

type Props = {
  fieldName: string;
  fieldValue: string;
};

function upsertHiddenInput(root: ParentNode, fieldName: string, fieldValue: string) {
  const forms = Array.from(root.querySelectorAll("form"));

  for (const form of forms) {
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

    if ((form as HTMLFormElement).dataset.formSubmissionBound !== "true") {
      form.addEventListener("submit", () => {
        if (
          typeof window !== "undefined" &&
          window.dataLayer &&
          Array.isArray(window.dataLayer)
        ) {
          window.dataLayer.push({
            event: "formSubmission",
            formId: (form as HTMLFormElement).id || "",
            ...Object.fromEntries(new FormData(form as HTMLFormElement).entries()),
          });
        }
      });

      (form as HTMLFormElement).dataset.formSubmissionBound = "true";
    }
  }

  return forms.length > 0;
}

export default function FormHiddenFieldInjector({
  fieldName,
  fieldValue,
}: Props) {
  useEffect(() => {
    if (!fieldName.trim()) {
      return;
    }

    const applyHiddenField = () => {
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
        applied = upsertHiddenInput(doc, fieldName, fieldValue) || applied;
      }

      return applied;
    };

    let tries = 0;
    const maxTries = 20;

    const interval = window.setInterval(() => {
      tries += 1;
      const applied = applyHiddenField();

      if (applied || tries >= maxTries) {
        window.clearInterval(interval);
      }
    }, 1000);

    applyHiddenField();

    return () => {
      window.clearInterval(interval);
    };
  }, [fieldName, fieldValue]);

  return null;
}
