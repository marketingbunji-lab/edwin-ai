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
    let isCancelled = false;

    const mountScriptsSequentially = async () => {
      for (const script of scripts) {
        if (isCancelled) return;

        const nextScript = document.createElement("script");

        for (const attribute of Array.from(script.attributes)) {
          nextScript.setAttribute(attribute.name, attribute.value);
        }

        nextScript.async = false;
        nextScript.text = script.text;

        const execution = new Promise<void>((resolve) => {
          if (nextScript.src) {
            nextScript.onload = () => {
              if (shouldAutoInitializeRdStation) {
                initializeRdStationForms(container);
              }
              resolve();
            };
            nextScript.onerror = () => resolve();
          }
        });

        script.replaceWith(nextScript);
        mountedScripts.push(nextScript);

        if (nextScript.src) {
          await execution;
          continue;
        }

        if (shouldAutoInitializeRdStation) {
          initializeRdStationForms(container);
        }
      }

      if (shouldAutoInitializeRdStation && !isCancelled) {
        window.setTimeout(() => {
          if (!isCancelled) {
            initializeRdStationForms(container);
          }
        }, 250);
      }
    };

    void mountScriptsSequentially();

    return () => {
      isCancelled = true;
      mountedScripts.forEach((script) => {
        script.onload = null;
        script.onerror = null;
      });
      container.innerHTML = "";
    };
  }, [code]);

  return <div ref={containerRef} className={className} />;
}
