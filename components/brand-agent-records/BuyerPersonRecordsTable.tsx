"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import type { BuyerPersonRecord } from "@/lib/brandAgentRecords";

type Props = {
  brandSlug: string;
  records: BuyerPersonRecord[];
};

export default function BuyerPersonRecordsTable({
  brandSlug,
  records,
}: Props) {
  const { t } = useDashboardLanguage();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");

  const deleteRecord = async (recordId: string) => {
    try {
      setDeletingId(recordId);
      setMessage("");

      const response = await fetch(
        `/api/brand-agent-records/${brandSlug}/buyer-person/${recordId}`,
        {
          method: "DELETE",
        },
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || t("buyerPersonTable.deleteError"));
      }

      setMessage(t("buyerPersonTable.deleteSuccess"));
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : t("buyerPersonTable.deleteError"),
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-3">
      <section className="admin-table-shell">
        <div className="min-w-[1060px]">
          <div className="admin-table-header grid grid-cols-[minmax(220px,1fr)_minmax(160px,0.5fr)_minmax(240px,1fr)_150px_260px]">
            <span>{t("buyerPersonTable.profile")}</span>
            <span>{t("buyerPersonTable.stage")}</span>
            <span>{t("buyerPersonTable.motivations")}</span>
            <span>{t("buyerPersonTable.updatedAt")}</span>
            <span className="text-right">{t("buyerPersonTable.actions")}</span>
          </div>
          {records.map((record) => (
            <article
              key={record.id}
              className="admin-table-row grid grid-cols-[minmax(220px,1fr)_minmax(160px,0.5fr)_minmax(240px,1fr)_150px_260px] gap-4"
            >
              <div>
                <p className="font-semibold text-slate-950 dark:text-slate-50">
                  {record.profileName}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {record.id}
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {record.stage || t("buyerPersonTable.pending")}
              </p>
              <p className="line-clamp-2 text-slate-600 dark:text-slate-400">
                {record.motivations.length
                  ? record.motivations.join(", ")
                  : t("buyerPersonTable.pending")}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {record.metadata.updatedAt}
              </p>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/brands/${brandSlug}/buyer-person/${record.id}`}
                  className="admin-button-secondary px-3 py-2 text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("buyerPersonTable.view")}
                </Link>
                <Link
                  href={`/admin/brands/${brandSlug}/buyer-person/${record.id}/edit`}
                  className="admin-button-primary px-3 py-2 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("buyerPersonTable.edit")}
                </Link>
                <button
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                  disabled={deletingId === record.id}
                  className="admin-button-danger px-3 py-2 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === record.id
                    ? t("buyerPersonTable.deleting")
                    : t("buyerPersonTable.delete")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {message ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}
