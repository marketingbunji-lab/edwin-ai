/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { EllipsisVertical, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import DeleteBrandButton from "./DeleteBrandButton";
import { normalizeBrandColorPalette } from "@/lib/brandColors";
import { formatCountLabel } from "@/lib/dashboardI18n";
import { getBrandLogo } from "@/lib/brandLogo";
import type { Brand } from "@/lib/data";

type Props = {
  brand: Brand;
  programCount: number;
  canDeleteJson?: boolean;
  canDeleteSupabase?: boolean;
};

export default function BrandCard({
  brand,
  programCount,
  canDeleteJson = true,
  canDeleteSupabase = false,
}: Props) {
  const { language, t } = useDashboardLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lightLogo = getBrandLogo(brand, "light");
  const darkLogo = getBrandLogo(brand, "dark");
  const colorPalette = normalizeBrandColorPalette(brand);
  const primaryDarkest = colorPalette.primary?.darkest ?? "#020617";
  const primaryDark = colorPalette.primary?.dark ?? "#0F172A";
  const primaryLight = colorPalette.primary?.light ?? "#94A3B8";
  const secondaryLight = colorPalette.secondary?.light ?? "#A78BFA";
  const secondaryDark = colorPalette.secondary?.dark ?? "#4F46E5";
  const brandCardBackground = [
    `radial-gradient(circle at 12% 18%, ${secondaryLight}3D 0%, transparent 28%)`,
    `radial-gradient(circle at 86% 8%, ${primaryLight}26 0%, transparent 32%)`,
    `linear-gradient(145deg, ${primaryDarkest} 0%, ${primaryDark} 54%, ${colorPalette.secondary?.darkest ?? "#312E81"} 140%)`,
  ].join(", ");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (!menuOpen) {
      return;
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen]);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 text-white shadow-[0_18px_45px_rgba(2,6,23,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(125,227,234,0.38)] hover:shadow-[0_24px_60px_rgba(2,6,23,0.38)]"
      style={{ background: brandCardBackground }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "linear-gradient(140deg, black, transparent 72%)",
        }}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/10 blur-3xl transition duration-300 group-hover:bg-white/15" />
      <div
        className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full blur-3xl"
        style={{ backgroundColor: `${secondaryDark}40` }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-75" />

      <div className="relative">
        <div ref={menuRef} className="absolute right-0 top-0 z-10">
          <button
            type="button"
            aria-label={language === "en" ? "Open brand options" : "Abrir opciones de la marca"}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/[0.08] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur transition hover:bg-white/[0.14] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <EllipsisVertical className="h-4 w-4" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-2 min-w-[168px] rounded-2xl border border-white/14 bg-slate-950/96 p-2 shadow-[0_20px_50px_rgba(2,6,23,0.42)] backdrop-blur-xl">
              <Link
                href={`/admin/brands/${brand.slug}/edit`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Pencil className="h-4 w-4" />
                {t("brandCard.edit")}
              </Link>

              {canDeleteJson ? (
                <DeleteBrandButton
                  brandName={brand.name}
                  brandSlug={brand.slug}
                  className="mt-1 w-full justify-start rounded-xl border-transparent bg-transparent px-3 py-2 font-semibold text-red-300 hover:bg-red-500/10 dark:border-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                />
              ) : null}

              {canDeleteSupabase ? (
                <DeleteBrandButton
                  brandName={brand.name}
                  brandSlug={brand.slug}
                  source="supabase"
                  className="mt-1 w-full justify-start rounded-xl border-transparent bg-transparent px-3 py-2 font-semibold text-red-300 hover:bg-red-500/10 dark:border-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <Link
          href={`/admin/brands/${brand.slug}`}
          className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <div className="grid grid-cols-3 items-center gap-5 pr-14">
            <div className="col-span-1">
              <div className="flex h-20 items-center rounded-2xl border border-white/10 bg-white/[0.08] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
                <img
                  src={lightLogo}
                  alt={brand.name}
                  className="h-12 max-w-full object-contain object-left dark:hidden"
                />
                <img
                  src={darkLogo}
                  alt={brand.name}
                  className="hidden h-12 max-w-full object-contain object-left dark:block"
                />
              </div>
            </div>

            <div className="col-span-2">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-white">
                {brand.name}
              </h2>
              <p className="mt-2 break-words text-sm leading-5 text-white/70">
                {brand.shortName || brand.description || brand.name}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-sm font-medium text-white/80">
              {formatCountLabel(
                language,
                programCount,
                t("brandCard.programSingular"),
                t("brandCard.programPlural"),
              )}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
