"use client";

import { useState } from "react";

type Item = {
  title: string;
  content: string;
};

type Props = {
  items: Item[];
  id?: string;
  className?: string;
};

export default function LandingAccordion({
  items,
  id = "landing-accordion",
  className = "",
}: Props) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  return (
    <div className={`grid gap-4 ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <div
            key={`${id}-item-${index}`}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-expanded={isOpen}
              aria-controls={`${id}-panel-${index}`}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-lg font-extrabold leading-6 text-slate-900">
                {item.title}
              </span>
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <span className="text-2xl font-light leading-none">+</span>
              </span>
            </button>

            {isOpen ? (
              <div
                id={`${id}-panel-${index}`}
                className="border-t border-slate-200 px-6 py-5"
              >
                <p className="m-0 text-base leading-7 text-slate-600">
                  {item.content}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
