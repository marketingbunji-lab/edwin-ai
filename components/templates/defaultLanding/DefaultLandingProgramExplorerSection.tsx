"use client";

import { useState } from "react";
import type { Landing, ProgramExplorerCard, ProgramExplorerTab } from "@/lib/data";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import {
  Award,
  BriefcaseBusiness,
  Globe,
} from "lucide-react";
import { landingContainerClass, landingSectionClass } from "./classes";

type Props = {
  explorer: NonNullable<Landing["programExplorer"]>;
  liveEdit?: LandingLiveEditConfig;
};

const cardIcons = {
  award: Award,
  globe: Globe,
  briefcase: BriefcaseBusiness,
};

function hasTabContent(tab?: ProgramExplorerTab) {
  return Boolean(
    tab?.title?.trim() ||
      tab?.description?.trim() ||
      tab?.items?.some((item) => item.trim()) ||
      tab?.groups?.some(
        (group) =>
          group.title?.trim() ||
          group.items?.some((item) => item.label?.trim() || item.value?.trim()),
      ),
  );
}

function hasCardContent(card?: ProgramExplorerCard) {
  return Boolean(
    card?.title?.trim() || card?.items?.some((item) => item.trim()),
  );
}

export default function DefaultLandingProgramExplorerSection({
  explorer,
  liveEdit,
}: Props) {
  const tabs = (explorer.tabs ?? []).filter(hasTabContent);
  const cards = (explorer.cards ?? []).filter(hasCardContent);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "program-explorer-tab-0");
  const activeTabData =
    tabs.find((tab, index) => (tab.id || `program-explorer-tab-${index}`) === activeTab) ??
    tabs[0];

  if (!explorer.enabled || (!tabs.length && !cards.length)) {
    return null;
  }

  return (
    <section
      id="landing-menu"
      className={`${landingSectionClass} relative overflow-hidden bg-[linear-gradient(180deg,#fff,var(--landing-page-bg))]`}
    >
      <div className={landingContainerClass}>
        <div className="mx-auto max-w-[760px]">
          <DefaultLandingSectionHeader
            eyebrow={explorer.eyebrow || ""}
            title={explorer.title || ""}
            description={explorer.description || ""}
            centered
            liveEdit={liveEdit}
            eyebrowPath="programExplorer.eyebrow"
            titlePath="programExplorer.title"
            descriptionPath="programExplorer.description"
          />
        </div>

        {tabs.length > 0 ? (
          <>
            <div
              role="tablist"
              aria-label={explorer.title || "Program information tabs"}
              className="flex flex-wrap justify-center gap-2 border-b border-slate-200"
            >
              {tabs.map((tab, index) => {
                const tabId = tab.id || `program-explorer-tab-${index}`;
                const isActive = tabId === (activeTabData?.id || activeTab);

                return (
                  <button
                    key={tabId}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${tabId}-panel`}
                    className={`relative rounded-t-[12px] px-[1.1rem] py-[0.7rem] text-[0.95rem] font-bold transition ${
                      isActive
                        ? "bg-white text-[var(--landing-primary-darkest)]"
                        : "text-slate-500 hover:text-[var(--landing-primary-darkest)]"
                    }`}
                    onClick={() => setActiveTab(tabId)}
                  >
                    <LiveEditableText
                      path={`programExplorer.tabs.${index}.label`}
                      value={tab.label || ""}
                      liveEdit={liveEdit}
                      singleLine
                    />
                    {isActive ? (
                      <span className="absolute inset-x-4 bottom-[-1px] h-[3px] rounded-full bg-[var(--landing-secondary)]" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {activeTabData ? (
              <div className="mt-8 rounded-2xl border border-[var(--landing-primary-light)] bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-8">
                <div
                  id={`${activeTabData.id || "program-explorer"}-panel`}
                  role="tabpanel"
                >
                  {activeTabData.title ? (
                    <h3 className="text-2xl font-bold text-[var(--landing-primary-darkest)]">
                      <LiveEditableText
                        path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.title`}
                        value={activeTabData.title}
                        liveEdit={liveEdit}
                        singleLine
                      />
                    </h3>
                  ) : null}

                  {activeTabData.description ? (
                    <p className="mt-3 text-lg leading-8 text-slate-600">
                      <LiveEditableText
                        path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.description`}
                        value={activeTabData.description}
                        liveEdit={liveEdit}
                      />
                    </p>
                  ) : null}

                  {activeTabData.groups?.length ? (
                    <div className="mt-5 grid items-start gap-4 lg:grid-cols-3">
                      {activeTabData.groups.map((group, groupIndex) => (
                        <div
                          key={`${group.title || "group"}-${groupIndex}`}
                          className="rounded-2xl border border-[var(--landing-primary-light)] bg-white p-5"
                          style={{ borderTop: "4px solid var(--landing-secondary)" }}
                        >
                          {group.title ? (
                            <p className="text-sm font-extrabold uppercase tracking-wide text-[var(--landing-primary-dark)]">
                              <LiveEditableText
                                path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.groups.${groupIndex}.title`}
                                value={group.title}
                                liveEdit={liveEdit}
                                singleLine
                              />
                            </p>
                          ) : null}

                          <ul className="mt-3 text-sm leading-6 text-slate-700">
                            {(group.items ?? []).map((item, itemIndex) => (
                              <li
                                key={`${item.label || "item"}-${itemIndex}`}
                                className="flex items-start justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0"
                              >
                                <span>
                                  <LiveEditableText
                                    path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.groups.${groupIndex}.items.${itemIndex}.label`}
                                    value={item.label || ""}
                                    liveEdit={liveEdit}
                                  />
                                </span>
                                {item.value ? (
                                  <span className="shrink-0 rounded-md bg-[color-mix(in_srgb,var(--landing-secondary)_18%,transparent)] px-2 text-xs font-bold text-[var(--landing-secondary-dark)]">
                                    <LiveEditableText
                                      path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.groups.${groupIndex}.items.${itemIndex}.value`}
                                      value={item.value}
                                      liveEdit={liveEdit}
                                      singleLine
                                    />
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeTabData.items?.length ? (
                    <ol
                      className={`mt-5 ${
                        activeTabData.listStyle === "steps" ? "space-y-4" : "space-y-3"
                      }`}
                    >
                      {activeTabData.items.map((item, itemIndex) => {
                        const isSteps = activeTabData.listStyle === "steps";

                        return (
                          <li
                            key={`${item}-${itemIndex}`}
                            className={`flex ${isSteps ? "gap-4" : "gap-3"}`}
                          >
                            <span
                              className={
                                isSteps
                                  ? "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--landing-primary)] font-bold text-white"
                                  : "mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--landing-secondary-dark)]"
                              }
                            >
                              {isSteps ? itemIndex + 1 : null}
                            </span>
                            <span
                              className={
                                isSteps
                                  ? "text-slate-700"
                                  : "text-base leading-7 text-slate-700"
                              }
                            >
                              <LiveEditableText
                                path={`programExplorer.tabs.${tabs.indexOf(activeTabData)}.items.${itemIndex}`}
                                value={item}
                                liveEdit={liveEdit}
                              />
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  ) : null}
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {cards.length > 0 ? (
          <div className="mt-10">
            <h3 className="mb-6 text-center text-2xl font-bold text-[var(--landing-primary-darkest)]">
              {explorer.cardsTitle || "Program highlights"}
            </h3>
            <div className="grid gap-5 md:grid-cols-3">
              {cards.map((card, index) => {
                const Icon =
                  cardIcons[
                    (card.icon as keyof typeof cardIcons) || "award"
                  ] || Award;

                return (
                  <article
                    key={`${card.title || "card"}-${index}`}
                    className="rounded-2xl border border-[var(--landing-primary-light)] bg-white/95 p-7 text-center"
                  >
                    <span className="mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-[rgba(21,39,68,0.06)] text-[var(--landing-primary-darkest)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    {card.title ? (
                      <h4 className="text-lg font-bold text-[var(--landing-primary-darkest)]">
                        <LiveEditableText
                          path={`programExplorer.cards.${index}.title`}
                          value={card.title}
                          liveEdit={liveEdit}
                        />
                      </h4>
                    ) : null}
                    {(card.items ?? []).length > 0 ? (
                      <ul className="mt-4 space-y-2 text-left text-sm leading-6 text-slate-600">
                        {card.items?.map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-secondary-dark)]" />
                            <span>
                              <LiveEditableText
                                path={`programExplorer.cards.${index}.items.${itemIndex}`}
                                value={item}
                                liveEdit={liveEdit}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
