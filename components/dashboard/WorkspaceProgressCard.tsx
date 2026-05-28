"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import {
  getDashboardTranslator,
  type DashboardLanguage,
} from "@/lib/dashboardI18n";

export type WorkspaceProgressStep = {
  title: string;
  complete: boolean;
};

export type WorkspaceProgressSectionItem = {
  title: string;
  complete: boolean;
};

type WorkspaceProgressTabId = "knowledgeBase" | "educationAgents";

type Props = {
  language: DashboardLanguage;
  nextActionLabel: string;
  nextActionHref: string;
  knowledgeBaseItems: WorkspaceProgressSectionItem[];
  educationAgentItems: WorkspaceProgressSectionItem[];
};

export default function WorkspaceProgressCard({
  language,
  nextActionLabel,
  nextActionHref,
  knowledgeBaseItems,
  educationAgentItems,
}: Props) {
  const t = getDashboardTranslator(language);
  const [activeTab, setActiveTab] =
    useState<WorkspaceProgressTabId>("knowledgeBase");
  const activeItems =
    activeTab === "knowledgeBase" ? knowledgeBaseItems : educationAgentItems;
  const completedItems = activeItems.filter((item) => item.complete);
  const inProgressItems = activeItems.filter((item) => !item.complete);

  return (
    <aside className="admin-panel h-fit self-start overflow-hidden rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-200/90 dark:bg-white dark:text-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("workspaceProgress.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">
            {t("workspaceProgress.title")}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/70 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("knowledgeBase")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "knowledgeBase"
                ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-slate-950"
            }`}
          >
            {t("workspaceProgress.knowledgeBaseTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("educationAgents")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "educationAgents"
                ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-slate-950"
            }`}
          >
            {t("workspaceProgress.educationAgentsTab")}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <ProgressGroup
          items={completedItems}
          emptyLabel={t("workspaceProgress.noneCompleted")}
          tone="complete"
          completeLabel={t("workspaceProgress.complete")}
          pendingLabel={t("workspaceProgress.inProgress")}
        />
        <ProgressGroup
          items={inProgressItems}
          emptyLabel={t("workspaceProgress.noneInProgress")}
          tone="progress"
          completeLabel={t("workspaceProgress.complete")}
          pendingLabel={t("workspaceProgress.inProgress")}
        />
      </div>

      <div className="mt-6 rounded-[24px] border border-[color-mix(in_srgb,var(--bunji-cyan)_28%,white)] bg-[linear-gradient(145deg,rgba(240,253,250,0.9),rgba(239,246,255,0.9))] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {t("workspaceProgress.recommendedMove")}
        </p>
        <Link
          href={nextActionHref}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--bunji-primary-dark)] transition hover:translate-x-0.5"
        >
          {nextActionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}

function ProgressGroup({
  items,
  emptyLabel,
  tone,
  completeLabel,
  pendingLabel,
}: {
  items: WorkspaceProgressSectionItem[];
  emptyLabel: string;
  tone: "complete" | "progress";
  completeLabel: string;
  pendingLabel: string;
}) {
  return (
    <div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const complete = tone === "complete";

            return (
              <div
                key={`${tone}-${item.title}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {complete ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock3 className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {complete ? completeLabel : pendingLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
