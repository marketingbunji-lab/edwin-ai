"use client";

import { useEffect, useRef } from "react";

type Props = {
  code: string;
  className?: string;
};

export default function ClientifyFormEmbed({ code, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.innerHTML = code;

    const scripts = Array.from(container.querySelectorAll("script"));

    for (const script of scripts) {
      const nextScript = document.createElement("script");

      for (const attribute of Array.from(script.attributes)) {
        nextScript.setAttribute(attribute.name, attribute.value);
      }

      nextScript.text = script.text;
      script.replaceWith(nextScript);
    }

    return () => {
      container.innerHTML = "";
    };
  }, [code]);

  return <div ref={containerRef} className={className} />;
}
