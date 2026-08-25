"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const VISIBILITY_OFFSET = 320;
const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=573241000400&text=Hola%2C+quiero+m%C3%A1s+informaci%C3%B3n+sobre+el+programa&type=phone_number&app_absent=0";

type Props = {
  showWhatsApp?: boolean;
};

export default function DefaultLandingBackToTopButton({
  showWhatsApp = true,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > VISIBILITY_OFFSET);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-3 md:right-7 md:bottom-7">
      {isVisible ? (
        <button
          type="button"
          className="back-to-top grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white shadow-[0_8px_18px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 md:h-9 md:w-9"
          aria-label="Volver al inicio"
          title="Volver al inicio"
          onClick={scrollToTop}
        >
          <ArrowUp
            aria-hidden="true"
            className="h-3.5 w-3.5"
            strokeWidth={2.4}
          />
        </button>
      ) : null}

      {showWhatsApp ? (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="grid h-12 w-12 place-items-center rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 md:h-14 md:w-14"
          aria-label="Solicitar más información por WhatsApp"
          title="Solicitar más información por WhatsApp"
        >
          <Image
            src="/whatsapp-button.png"
            alt=""
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        </a>
      ) : null}
    </div>
  );
}
