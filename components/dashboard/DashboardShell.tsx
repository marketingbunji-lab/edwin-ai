"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Pencil,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import AdminUserMenu from "@/components/dashboard/AdminUserMenu";
import { getBrandLogo } from "@/lib/brandLogo";
import type { Brand } from "@/lib/data";

type Props = {
  brands: Brand[];
  landingSummaries: LandingSummary[];
  children: React.ReactNode;
};

type LandingSummary = {
  brandSlug: string;
  landingSlug: string;
  title: string;
  fullTitle: string;
};

type ThemeMode = "light" | "dark";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type BrandSubNavItem = {
  href: string;
  label: string;
};

const themeChangeEvent = "bunji-theme-change";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function getPreferredTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem("bunji-theme");

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function saveTheme(theme: ThemeMode) {
  applyTheme(theme);
  window.localStorage.setItem("bunji-theme", theme);
  document.cookie = `bunji-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event(themeChangeEvent));
}

const primaryNav: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/brands",
    label: "Marcas",
    icon: FolderKanban,
  },
];

const backButtonClassName =
  "inline-flex items-center gap-2 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800";

function isNavItemActive(pathname: string, item: NavItem) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function getBrandLink(pathname: string, brand: Brand) {
  const brandBasePath = `/admin/brands/${brand.slug}`;

  if (pathname.startsWith(`${brandBasePath}/new/ai`)) {
    return `${brandBasePath}/new/ai`;
  }

  if (pathname.startsWith(`${brandBasePath}/new`)) {
    return `${brandBasePath}/new`;
  }

  if (pathname.startsWith(`${brandBasePath}/edit`)) {
    return `${brandBasePath}/edit`;
  }

  return brandBasePath;
}

function getBrandActiveState(pathname: string, brandSlug: string) {
  const brandBasePath = `/admin/brands/${brandSlug}`;
  return pathname === brandBasePath || pathname.startsWith(`${brandBasePath}/`);
}

function getBrandSubNavItems(brandSlug: string): BrandSubNavItem[] {
  return [
    {
      href: `/admin/brands/${brandSlug}/programs`,
      label: "Programs",
    },
    {
      href: `/admin/brands/${brandSlug}/buyer-person`,
      label: "Buyer Person",
    },
    {
      href: `/admin/brands/${brandSlug}/visual-assets`,
      label: "Visual Assets",
    },
    {
      href: `/admin/brands/${brandSlug}/landings`,
      label: "Landings",
    },
  ];
}

export default function DashboardShell({
  brands,
  landingSummaries,
  children,
}: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return getPreferredTheme();
  });
  const activeBrand =
    brands.find((brand) => getBrandActiveState(pathname, brand.slug)) ?? null;
  const isBrandOverviewPage = Boolean(
    activeBrand && pathname === `/admin/brands/${activeBrand.slug}`,
  );
  const isBrandEditPage = Boolean(
    activeBrand && pathname === `/admin/brands/${activeBrand.slug}/edit`,
  );
  const isNewLandingPage = Boolean(
    activeBrand && pathname === `/admin/brands/${activeBrand.slug}/new`,
  );
  const isNewLandingAiPage = Boolean(
    activeBrand && pathname === `/admin/brands/${activeBrand.slug}/new/ai`,
  );
  const landingRouteMatch = pathname.match(
    /^\/admin\/brands\/([^/]+)\/landings\/([^/]+)$/,
  );
  const activeLanding =
    landingRouteMatch && activeBrand
      ? landingSummaries.find(
          (landing) =>
            landing.brandSlug === activeBrand.slug &&
            landing.landingSlug === landingRouteMatch[2],
        ) ?? null
      : null;
  const isLandingEditorPage = Boolean(activeBrand && activeLanding);
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const syncTheme = () => {
      const preferredTheme = getPreferredTheme();

      setTheme((currentTheme) =>
        currentTheme === preferredTheme ? currentTheme : preferredTheme,
      );
    };

    syncTheme();
    window.addEventListener("storage", syncTheme);
    window.addEventListener(themeChangeEvent, syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(themeChangeEvent, syncTheme);
    };
  }, []);

  const handleThemeChange = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    saveTheme(nextTheme);
  };

  if (!pathname.startsWith("/admin")) {
    return children;
  }

  return (
    <div
      className="min-h-screen bg-[#f3f5f9] text-slate-900 dark:bg-[#020617] dark:text-slate-100"
    >
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar menu lateral"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {!mobileOpen ? (
        <button
          type="button"
          aria-label="Abrir menu lateral"
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-slate-200 bg-white text-slate-900 shadow-xl transition-transform duration-200 dark:border-slate-800 dark:bg-[#030712] dark:text-slate-100 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-md"
              priority
            />
            <div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white">
                EDwin
              </h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                AI
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
          <div className="mb-4">
            <Link
              href="/admin/brands/new"
              onClick={() => setMobileOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--bunji-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Nueva marca
            </Link>
          </div>

          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const active = isNavItemActive(pathname, item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)] ring-1 ring-[var(--bunji-primary-soft)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-white dark:ring-[var(--bunji-primary-muted)]/30"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2 px-4">
              <Sparkles className="h-4 w-4 text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Marcas activas
              </p>
            </div>

            <div className="space-y-1">
              {brands.map((brand) => {
                const active = getBrandActiveState(pathname, brand.slug);
                const href = getBrandLink(pathname, brand);
                const subNavItems = getBrandSubNavItems(brand.slug);

                return (
                  <div key={brand.slug} className="space-y-1">
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 transition ${
                        active
                          ? "bg-slate-100 text-slate-950 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/10"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{brand.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {brand.shortName || brand.description || brand.slug}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                    </Link>

                    {active ? (
                      <div className="ml-4 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-800">
                        {subNavItems.map((item) => {
                          const isSubNavActive =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                                isSubNavActive
                                  ? "bg-[var(--bunji-primary-light)] font-medium text-[var(--bunji-primary-dark)] dark:bg-[var(--bunji-primary-soft)]/30 dark:text-white"
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 p-3 dark:border-white/10">
          <AdminUserMenu theme={theme} onThemeChange={handleThemeChange} />
        </div>
      </aside>

      <div className="lg:pl-[286px]">
        {activeBrand &&
        (isNewLandingPage ||
          isNewLandingAiPage ||
          isLandingEditorPage) ? (
          <section className="border-b border-slate-200/80 bg-white/92 backdrop-blur dark:border-slate-800 dark:bg-slate-950/92">
            <div className="flex flex-wrap items-center justify-between gap-5 px-4 py-5 sm:px-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getBrandLogo(activeBrand, "light")}
                    alt={activeBrand.name}
                    className="max-h-full w-full object-contain dark:hidden"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getBrandLogo(activeBrand, "dark")}
                    alt={activeBrand.name}
                    className="hidden max-h-full w-full object-contain dark:block"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    {isLandingEditorPage
                      ? activeBrand.name
                      : isBrandEditPage
                        ? "Editar marca"
                        : isNewLandingAiPage
                          ? "Crear con AI"
                          : isNewLandingPage
                            ? "Nueva landing"
                            : "Marca activa"}
                  </p>
                  <h2 className="text-3xl font-bold text-slate-950 dark:text-slate-50">
                    {isLandingEditorPage
                      ? activeLanding?.fullTitle || activeLanding?.title
                      : activeBrand.name}
                    {!isLandingEditorPage && activeBrand.shortName ? (
                      <span className="ml-3 text-xl font-medium text-slate-500 dark:text-slate-300">
                        | {activeBrand.shortName}
                      </span>
                    ) : null}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isBrandOverviewPage ? (
                  <>
                    <Link
                      href={`/admin/brands/${activeBrand.slug}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar marca
                    </Link>

                    <Link
                      href={`/admin/brands/${activeBrand.slug}/new`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm dark:bg-[var(--bunji-primary)]"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva landing
                    </Link>
                  </>
                ) : null}

                {isBrandEditPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}`}
                    className={backButtonClassName}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a marca
                  </Link>
                ) : null}

                {isNewLandingPage ? (
                  <>
                    <Link
                      href={`/admin/brands/${activeBrand.slug}/new/ai`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm dark:bg-[var(--bunji-primary)]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Crear con AI
                    </Link>

                    <Link
                      href={`/admin/brands/${activeBrand.slug}/landings`}
                      className={backButtonClassName}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver a landings
                    </Link>
                  </>
                ) : null}

                {isNewLandingAiPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}/new`}
                    className={backButtonClassName}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a nueva landing
                  </Link>
                ) : null}

                {isLandingEditorPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}/landings`}
                    className={backButtonClassName}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a landings
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <div>{children}</div>
      </div>
    </div>
  );
}
