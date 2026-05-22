/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, FolderOpen, Pencil } from "lucide-react";
import DeleteBrandButton from "./DeleteBrandButton";
import { normalizeBrandColorPalette } from "@/lib/brandColors";
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
  const colorPalette = normalizeBrandColorPalette(brand);
  const primaryDarkest = colorPalette.primary?.darkest ?? "#020617";
  const primaryDark = colorPalette.primary?.dark ?? "#0F172A";
  const primaryLight = colorPalette.primary?.light ?? "#94A3B8";
  const secondaryLight = colorPalette.secondary?.light ?? "#A78BFA";
  const secondaryDark = colorPalette.secondary?.dark ?? "#4F46E5";
  const secondaryDarkest = colorPalette.secondary?.darkest ?? "#312E81";
  const brandCardBackground = [
    `radial-gradient(circle at 12% 18%, ${secondaryLight}3D 0%, transparent 28%)`,
    `radial-gradient(circle at 86% 8%, ${primaryLight}26 0%, transparent 32%)`,
    `linear-gradient(145deg, ${primaryDarkest} 0%, ${primaryDark} 54%, ${secondaryDarkest} 140%)`,
  ].join(", ");

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
        <Link
          href={`/admin/brands/${brand.slug}`}
          className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <div className="grid grid-cols-3 items-center gap-5">
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
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-sm font-medium text-white/80">
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
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 text-sm font-semibold text-white transition hover:border-[rgba(125,227,234,0.42)] hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Link>

            <Link
              href={`/admin/brands/${brand.slug}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-white shadow-[0_10px_24px_rgba(2,6,23,0.22)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                background: `linear-gradient(135deg, ${secondaryDark}, ${secondaryDarkest})`,
              }}
            >
              <FolderOpen className="h-4 w-4" />
              Ver marca
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
