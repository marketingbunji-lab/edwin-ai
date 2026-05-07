/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, FolderOpen, Pencil } from "lucide-react";
import DeleteBrandButton from "./DeleteBrandButton";
import { getBrandLogo } from "@/lib/brandLogo";
import type { Brand } from "@/lib/data";

type Props = {
  brand: Brand;
  landingCount: number;
  canDeleteJson?: boolean;
  canDeleteSupabase?: boolean;
};

export default function BrandCard({
  brand,
  landingCount,
  canDeleteJson = true,
  canDeleteSupabase = false,
}: Props) {
  const lightLogo = getBrandLogo(brand, "light");
  const darkLogo = getBrandLogo(brand, "dark");

  return (
    <div className="border border-gray-200 bg-white p-6 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
      <Link href={`/admin/brands/${brand.slug}`} className="block">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <img
              src={lightLogo}
              alt={brand.name}
              className="h-14 max-w-full object-contain object-left dark:hidden"
            />
            <img
              src={darkLogo}
              alt={brand.name}
              className="hidden h-14 max-w-full object-contain object-left dark:block"
            />
          </div>

          <div className="max-w-28 shrink-0">
            <h2 className="text-xl font-semibold dark:text-slate-50">{brand.name}</h2>
            <p className="break-words text-sm leading-5 text-gray-500 dark:text-slate-400">
              {brand.shortName || brand.description || brand.name}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-gray-600 dark:text-slate-300">
          {landingCount} landing{landingCount === 1 ? "" : "s"}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {canDeleteJson ? (
            <DeleteBrandButton brandName={brand.name} brandSlug={brand.slug} />
          ) : null}
          {canDeleteSupabase ? (
            <DeleteBrandButton
              brandName={brand.name}
              brandSlug={brand.slug}
              source="supabase"
            />
          ) : null}

          <Link
            href={`/admin/brands/${brand.slug}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 dark:border-slate-700 dark:text-slate-100"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>

          <Link
            href={`/admin/brands/${brand.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: "var(--bunji-primary)", color: "#ffffff" }}
          >
            <FolderOpen className="h-4 w-4" />
            Ver marca
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
