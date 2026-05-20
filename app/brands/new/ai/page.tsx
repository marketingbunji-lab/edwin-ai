import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AiBrandChat from "../../../../components/editor/AiBrandChat";

export default function NewBrandAiPage() {
  return (
    <main className="admin-page">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Bunji</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">
              Crear marca con IA
            </h1>
          </div>

          <Link
            href="/admin/brands/new"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 px-0 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800"
            aria-label="Volver a nueva marca"
            title="Volver a nueva marca"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <AiBrandChat />
      </div>
    </main>
  );
}
