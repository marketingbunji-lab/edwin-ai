"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getRandomEdwinAssistantMessage } from "@/lib/edwinAssistantMessages";

export default function EdwinMascot() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const messageTimer = window.setTimeout(() => {
      setMessage(getRandomEdwinAssistantMessage("welcome"));
      setVisible(true);
    }, 2000);

    return () => window.clearTimeout(messageTimer);
  }, []);

  return (
    <div
      className="group fixed bottom-5 right-5 z-30 flex items-end gap-3 sm:bottom-7 sm:right-7"
      role="img"
      aria-label="Asistente EDwin"
    >
      <div
        className={`relative mb-8 max-w-[220px] rounded-2xl border border-white/60 bg-white/92 px-4 py-3 text-xs font-medium leading-5 text-slate-800 shadow-[0_20px_42px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-500 ease-out before:absolute before:-right-2 before:bottom-3.5 before:h-4 before:w-4 before:rotate-45 before:border-r before:border-t before:border-white/60 before:bg-white/92 dark:border-white/10 dark:bg-slate-950/88 dark:text-slate-100 dark:before:border-white/10 dark:before:bg-slate-950/88 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {message}
      </div>

      <div className="relative h-20 w-20 shrink-0 transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] sm:h-24 sm:w-24">
        <Image
          src="/tom-01.png"
          alt=""
          fill
          sizes="96px"
          className="object-contain drop-shadow-[0_18px_28px_rgba(2,6,23,0.22)] transition-opacity duration-300 ease-out group-hover:opacity-0"
          priority={false}
        />
        <Image
          src="/tom-02.png"
          alt=""
          fill
          sizes="96px"
          className="object-contain opacity-0 drop-shadow-[0_22px_34px_rgba(62,57,137,0.26)] transition-opacity duration-300 ease-out group-hover:opacity-100"
          priority={false}
        />
      </div>
    </div>
  );
}
