"use client";

import { useEffect, useRef } from "react";

type Props = {
  code: string;
  className?: string;
};

type WindowWithRdStation = Window & {
  RDStationForms?: new (formId: string, token: string) => {
    createForm: () => void;
  };
};

function getRdStationToken(formId: string) {
  const parts = formId.split("-").filter(Boolean);

  return parts.at(-1) || formId;
}

function initializeRdStationForms(container: HTMLDivElement) {
  const rdWindow = window as WindowWithRdStation;

  if (!rdWindow.RDStationForms) return;
  const RDStationForms = rdWindow.RDStationForms;

  const formContainers = Array.from(
    container.querySelectorAll<HTMLDivElement>('div[role="main"][id]'),
  ).filter((element) => element.id);

  formContainers.forEach((element) => {
    if (element.dataset.rdStationBound === "true") return;

    try {
      new RDStationForms(
        element.id,
        getRdStationToken(element.id),
      ).createForm();
      element.dataset.rdStationBound = "true";
    } catch (error) {
      console.error("RD Station form init failed", error);
    }
  });
}

export default function ClientifyFormEmbed({ code, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.innerHTML = code;

    const scripts = Array.from(container.querySelectorAll("script"));
    const shouldAutoInitializeRdStation = scripts.some((script) =>
      script.src.includes("rdstation-forms"),
    ) && !code.includes("RDStationForms(");
    const mountedScripts: HTMLScriptElement[] = [];

    for (const script of scripts) {
      const nextScript = document.createElement("script");

      for (const attribute of Array.from(script.attributes)) {
        nextScript.setAttribute(attribute.name, attribute.value);
      }

      nextScript.text = script.text;
      nextScript.onload = () => {
        if (shouldAutoInitializeRdStation) {
          initializeRdStationForms(container);
        }
      };
      script.replaceWith(nextScript);
      mountedScripts.push(nextScript);
    }

    if (shouldAutoInitializeRdStation) {
      window.setTimeout(() => initializeRdStationForms(container), 250);
    }

    return () => {
      mountedScripts.forEach((script) => {
        script.onload = null;
      });
      container.innerHTML = "";
    };
  }, [code]);

  return <div ref={containerRef} className={className} />;
}
