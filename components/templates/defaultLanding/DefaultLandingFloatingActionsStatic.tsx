/* eslint-disable @next/next/no-img-element */
import { ArrowUp } from "../templateIcons";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=573241000400&text=Hola%2C+quiero+m%C3%A1s+informaci%C3%B3n+sobre+el+programa&type=phone_number&app_absent=0";

export default function DefaultLandingFloatingActionsStatic() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-3 md:right-7 md:bottom-7">
      <button
        type="button"
        data-export-back-to-top
        className="back-to-top hidden h-8 w-8 place-items-center rounded-full bg-slate-900 text-white shadow-[0_8px_18px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 md:h-9 md:w-9"
        aria-label="Volver al inicio"
        title="Volver al inicio"
      >
        <ArrowUp
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={2.4}
        />
      </button>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="grid h-12 w-12 place-items-center rounded-full shadow-[0_12px_30px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/35 md:h-14 md:w-14"
        aria-label="Solicitar más información por WhatsApp"
        title="Solicitar más información por WhatsApp"
      >
        <img
          src="/whatsapp-button.png"
          alt=""
          width="56"
          height="56"
          className="h-full w-full object-contain"
        />
      </a>
    </div>
  );
}
