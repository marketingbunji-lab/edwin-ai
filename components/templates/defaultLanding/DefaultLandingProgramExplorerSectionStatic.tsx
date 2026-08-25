import type {
  Landing,
  ProgramExplorerCard,
  ProgramExplorerTab,
} from "@/lib/data";
import { ChevronDown } from "../templateIcons";
import DefaultLandingSectionHeader from "./DefaultLandingSectionHeader";
import LiveEditableText, {
  type LandingLiveEditConfig,
} from "@/components/editor/LiveEditableText";
import { Award, BriefcaseBusiness, Globe } from "../templateIcons";
import { landingContainerClass, landingSectionClass } from "./classes";
import DefaultLandingProgramExplorerItemText from "./DefaultLandingProgramExplorerItemText";

type Props = {
  explorer: NonNullable<Landing["programExplorer"]>;
  planDownloadUrl?: string;
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

function renderTabContent(
  activeTabData: ProgramExplorerTab,
  tabIndex: number,
  liveEdit?: LandingLiveEditConfig,
  explorerImage?: string,
  explorerTitle?: string,
  planDownloadUrl?: string,
) {
  return (
    <div>
      {activeTabData.title ? (
        <h3 className="text-2xl font-bold text-[var(--landing-primary-darkest)]">
          <LiveEditableText
            path={`programExplorer.tabs.${tabIndex}.title`}
            value={activeTabData.title}
            liveEdit={liveEdit}
            singleLine
          />
        </h3>
      ) : null}

      {activeTabData.description ? (
        <p className="mt-3 text-lg leading-8 text-slate-600">
          <LiveEditableText
            path={`programExplorer.tabs.${tabIndex}.description`}
            value={activeTabData.description}
            liveEdit={liveEdit}
          />
        </p>
      ) : null}

      {activeTabData.groups?.length ? (
        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
          <div className="space-y-2">
            {activeTabData.groups.map((group, groupIndex) => (
              <details
                key={`${group.title || "group"}-${groupIndex}`}
                name={`program-explorer-groups-${tabIndex}`}
                open={groupIndex === 0}
                className="landing-export-group-card group overflow-hidden rounded-2xl border border-[var(--landing-primary-light)]"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 marker:content-none">
                  <span className="text-sm font-extrabold uppercase tracking-wide text-[var(--landing-primary-dark)]">
                    <LiveEditableText
                      path={`programExplorer.tabs.${tabIndex}.groups.${groupIndex}.title`}
                      value={group.title || `Grupo ${groupIndex + 1}`}
                      liveEdit={liveEdit}
                      singleLine
                    />
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--landing-primary-dark)] transition-transform group-open:rotate-180"
                  />
                </summary>

                <ul className="mx-4 border-t border-slate-100 pt-2 pb-3 text-sm leading-5 text-slate-700">
                  {(group.items ?? []).map((item, itemIndex) => (
                    <li
                      key={`${item.label || "item"}-${itemIndex}`}
                      className="flex items-start justify-between gap-3 border-b border-slate-100 py-1 last:border-0"
                    >
                      <span>
                        <LiveEditableText
                          path={`programExplorer.tabs.${tabIndex}.groups.${groupIndex}.items.${itemIndex}.label`}
                          value={item.label || ""}
                          liveEdit={liveEdit}
                        />
                      </span>
                      {item.value ? (
                        <span className="shrink-0 rounded-md bg-[color-mix(in_srgb,var(--landing-secondary)_18%,transparent)] px-2 text-xs font-bold text-[var(--landing-secondary-dark)]">
                          <LiveEditableText
                            path={`programExplorer.tabs.${tabIndex}.groups.${groupIndex}.items.${itemIndex}.value`}
                            value={item.value}
                            liveEdit={liveEdit}
                            singleLine
                          />
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </details>
            ))}

            {planDownloadUrl ? (
              <a
                href={planDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--landing-secondary),var(--landing-secondary-dark))] px-5 py-2.5 text-sm font-bold text-[var(--landing-secondary-text)] shadow-[0_10px_24px_color-mix(in_srgb,var(--landing-secondary)_28%,transparent)]"
              >
                Descargar el plan de estudios
              </a>
            ) : null}
          </div>

          {explorerImage ? (
            <div className="aspect-video self-start overflow-hidden rounded-2xl border border-[var(--landing-primary-light)] bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={explorerImage}
                alt={`Recurso visual de ${explorerTitle || "el programa"}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
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
                  <DefaultLandingProgramExplorerItemText
                    isSteps={isSteps}
                    item={item}
                    path={`programExplorer.tabs.${tabIndex}.items.${itemIndex}`}
                    liveEdit={liveEdit}
                  />
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

export default function DefaultLandingProgramExplorerSectionStatic({
  explorer,
  planDownloadUrl = "",
  liveEdit,
}: Props) {
  const tabs = (explorer.tabs ?? []).filter(hasTabContent);
  const cards = (explorer.cards ?? []).filter(hasCardContent);
  if (!explorer.enabled || (!tabs.length && !cards.length)) {
    return null;
  }

  return (
    <section
      id="landing-menu"
      className={`${landingSectionClass} relative overflow-hidden bg-[linear-gradient(180deg,#fff,#fffae0)]`}
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
              aria-label={explorer.title || "Program information tabs"}
              className="landing-export-tabbar flex flex-wrap justify-center gap-2 border-b border-slate-200"
            >
              {tabs.map((tab, index) => {
                const tabId = tab.id || `program-explorer-tab-${index}`;
                const panelId = `${tabId}-panel`;
                const isActive = index === 0;

                return (
                  <a
                    key={tabId}
                    href={`#${panelId}`}
                    data-export-tab-target={panelId}
                    className={`landing-export-tab relative rounded-t-[12px] px-[1.1rem] py-[0.7rem] text-[0.95rem] font-bold ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    <LiveEditableText
                      path={`programExplorer.tabs.${index}.label`}
                      value={tab.label || ""}
                      liveEdit={liveEdit}
                      singleLine
                    />
                    <span className="landing-export-tab-indicator absolute inset-x-4 bottom-[-1px] h-[3px] rounded-full bg-[var(--landing-secondary)]" />
                  </a>
                );
              })}
            </div>

            <div className="mt-6">
              {tabs.map((tab, index) => {
                const tabId = tab.id || `program-explorer-tab-${index}`;
                const panelId = `${tabId}-panel`;

                return (
                  <div
                    key={panelId}
                    id={panelId}
                    className={`landing-export-panel landing-export-surface rounded-2xl border border-[var(--landing-primary-light)] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-6 ${
                      index === 0 ? "is-default is-active" : ""
                    }`}
                  >
                    {renderTabContent(
                      tab,
                      index,
                      liveEdit,
                      explorer.image,
                      explorer.title,
                      planDownloadUrl,
                    )}
                  </div>
                );
              })}
            </div>
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
                  cardIcons[(card.icon as keyof typeof cardIcons) || "award"] ||
                  Award;

                return (
                  <article
                    key={`${card.title || "card"}-${index}`}
                    className="landing-export-card rounded-2xl border border-[var(--landing-primary-light)] p-7 text-center"
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
                          <li
                            key={`${item}-${itemIndex}`}
                            className="flex gap-2"
                          >
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
