import { BookOpenText, Sparkles } from "lucide-react";
import { projectDocumentation } from "@/docs/project/content";

export const dynamic = "force-dynamic";

export default function AdminDocsPage() {
  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <section className="admin-panel overflow-hidden p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary-light)] px-3 py-2 text-sm font-semibold text-[var(--bunji-primary)] dark:border-[var(--bunji-primary-muted)]/30 dark:bg-[var(--bunji-primary-soft)]/30 dark:text-[var(--bunji-primary-muted)]">
                <BookOpenText className="h-4 w-4" />
                Project Docs
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                {projectDocumentation.title}
              </h1>
              <p className="admin-muted mt-4 max-w-3xl text-base leading-7">
                {projectDocumentation.subtitle}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Última actualización
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                {projectDocumentation.lastUpdated}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Esta página se irá actualizando junto con nuevos ajustes del
                producto.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-2">
          {projectDocumentation.sections.map((section) => (
            <article key={section.id} className="admin-panel p-6">
              <div className="flex items-start gap-4">
                <div className="admin-icon-tile">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                    {section.title}
                  </h2>
                  {section.description ? (
                    <p className="admin-muted mt-3 leading-7">
                      {section.description}
                    </p>
                  ) : null}

                  <div className="mt-5 space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
