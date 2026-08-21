"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpenText,
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
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import EdwinMascot from "@/components/dashboard/EdwinMascot";
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
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

type BrandSubNavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefixes?: string[];
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
    labelKey: "shell.dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/brands",
    labelKey: "shell.brands",
    icon: FolderKanban,
  },
];

const backButtonClassName =
  "admin-button-secondary admin-button-icon";

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
      href: `/admin/brands/${brandSlug}/knowledge-base`,
      labelKey: "shell.knowledgeBase",
      icon: BookOpenText,
      matchPrefixes: [
        `/admin/brands/${brandSlug}/knowledge-base`,
        `/admin/brands/${brandSlug}/edit`,
        `/admin/brands/${brandSlug}/documents`,
        `/admin/brands/${brandSlug}/university`,
        `/admin/brands/${brandSlug}/golden-circle`,
        `/admin/brands/${brandSlug}/programs`,
      ],
    },
    {
      href: `/admin/brands/${brandSlug}/journey`,
      labelKey: "shell.journey",
      icon: Sparkles,
      matchPrefixes: [
        `/admin/brands/${brandSlug}/journey`,
        `/admin/brands/${brandSlug}/buyer-person`,
        `/admin/brands/${brandSlug}/buyer-person-university`,
        `/admin/brands/${brandSlug}/buyer-person-program`,
        `/admin/brands/${brandSlug}/visual-assets`,
        `/admin/brands/${brandSlug}/landings`,
      ],
    },
  ];
}

function isBrandSubNavItemActive(pathname: string, item: BrandSubNavItem) {
  const matchPrefixes = item.matchPrefixes?.length ? item.matchPrefixes : [item.href];

  return matchPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function DashboardShell({
  brands,
  landingSummaries,
  children,
}: Props) {
  const pathname = usePathname();
  const { t } = useDashboardLanguage();
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
    <div className="admin-shell-bg min-h-screen">
      {mobileOpen ? (
        <button
          type="button"
          aria-label={t("shell.closeSidebar")}
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--bunji-primary-darker)_62%,transparent)] backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {!mobileOpen ? (
        <button
          type="button"
          aria-label={t("shell.openSidebar")}
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-white/88 text-[var(--bunji-primary)] shadow-[0_16px_36px_rgba(62,57,137,0.2)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--bunji-cyan)_55%,white)] hover:bg-white dark:border-white/10 dark:bg-slate-900/88 dark:text-[var(--bunji-cyan)] dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,250,255,0.94)_100%),radial-gradient(circle_at_18%_12%,rgba(125,227,234,0.16)_0%,transparent_24%),radial-gradient(circle_at_82%_8%,rgba(62,57,137,0.14)_0%,transparent_26%)] text-slate-900 shadow-[0_22px_64px_rgba(34,39,74,0.18)] backdrop-blur-xl transition-transform duration-200 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(5,8,23,0.96)_0%,rgba(2,6,23,0.95)_100%),radial-gradient(circle_at_16%_10%,rgba(125,227,234,0.12)_0%,transparent_24%),radial-gradient(circle_at_84%_8%,rgba(62,57,137,0.28)_0%,transparent_30%)] dark:text-slate-100 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] px-5 py-5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Image
              src="/edwin-logo.png"
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bunji-primary)] dark:text-[var(--bunji-cyan)]">
                AI
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label={t("shell.closeSidebar")}
            title={t("shell.closeSidebar")}
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white/75 text-[var(--bunji-primary)] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[var(--bunji-cyan)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
          <div className="mb-4">
            <Link
              href="/admin/brands/new"
              onClick={() => setMobileOpen(false)}
              className="admin-button-primary w-full"
            >
              <Plus className="h-4 w-4" />
              {t("shell.newBrand")}
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
                      ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_70%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_80%,white))] text-[var(--bunji-primary-dark)] ring-1 ring-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] shadow-[0_12px_24px_rgba(125,227,234,0.16)] dark:bg-[linear-gradient(135deg,rgba(62,57,137,0.36),rgba(125,227,234,0.14))] dark:text-white dark:ring-[rgba(125,227,234,0.24)]"
                      : "text-slate-600 hover:bg-white/72 hover:text-slate-950 hover:ring-1 hover:ring-[color-mix(in_srgb,var(--bunji-primary-soft)_60%,white)] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-2 px-4">
              <Sparkles className="h-4 w-4 text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {t("shell.activeBrands")}
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
                          ? "bg-[linear-gradient(135deg,rgba(62,57,137,0.12),rgba(125,227,234,0.12))] text-slate-950 ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] shadow-[0_12px_28px_rgba(62,57,137,0.12)] dark:bg-[linear-gradient(135deg,rgba(62,57,137,0.28),rgba(125,227,234,0.12))] dark:text-white dark:ring-[rgba(125,227,234,0.14)]"
                          : "text-slate-600 hover:bg-white/72 hover:text-slate-950 hover:ring-1 hover:ring-[color-mix(in_srgb,var(--bunji-primary-soft)_55%,white)] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
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
                      <div className="ml-4 space-y-1 border-l pl-4 pt-1 dark:border-slate-800"
                        style={{
                          borderColor:
                            "color-mix(in srgb, var(--bunji-cyan) 30%, rgba(148, 163, 184, 0.4))",
                        }}
                      >
                        {subNavItems.map((item) => {
                          const isSubNavActive = isBrandSubNavItemActive(
                            pathname,
                            item,
                          );
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                                isSubNavActive
                                  ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white))] font-medium text-[var(--bunji-primary-dark)] dark:bg-[linear-gradient(135deg,rgba(62,57,137,0.3),rgba(125,227,234,0.12))] dark:text-white"
                                  : "text-slate-500 hover:bg-white/68 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                              }`}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span>{t(item.labelKey)}</span>
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

        <div className="border-t border-[color-mix(in_srgb,var(--bunji-primary-soft)_56%,white)] p-3 dark:border-white/10">
          <AdminUserMenu theme={theme} onThemeChange={handleThemeChange} />
        </div>
      </aside>

      <div className="lg:pl-[286px]">
        {activeBrand &&
        (isNewLandingPage ||
          isNewLandingAiPage ||
          isLandingEditorPage) ? (
          <section className="border-b border-[color-mix(in_srgb,var(--bunji-primary-soft)_54%,rgba(148,163,184,0.35))] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(247,249,255,0.86)_100%),radial-gradient(circle_at_12%_18%,rgba(125,227,234,0.1),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(62,57,137,0.1),transparent_24%)] shadow-[0_10px_35px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.92)_0%,rgba(6,10,26,0.88)_100%),radial-gradient(circle_at_16%_16%,rgba(125,227,234,0.08),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(62,57,137,0.18),transparent_24%)]">
            <div className="flex flex-wrap items-center justify-between gap-5 px-4 py-5 sm:px-6">
              <div className="flex items-center gap-4">
                {!isLandingEditorPage ? (
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
                ) : null}

                <div>
                  {!isLandingEditorPage ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--bunji-primary)]/70 dark:text-[var(--bunji-cyan)]/75">
                      {isBrandEditPage
                        ? t("shell.editBrand")
                        : isNewLandingAiPage
                          ? t("shell.createWithAi")
                          : isNewLandingPage
                            ? t("shell.newLanding")
                            : t("shell.activeBrand")}
                    </p>
                  ) : null}
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
                      className="admin-button-secondary"
                    >
                      <Pencil className="h-4 w-4" />
                      {t("shell.editBrand")}
                    </Link>

                    <Link
                      href={`/admin/brands/${activeBrand.slug}/new`}
                      className="admin-button-primary"
                    >
                      <Plus className="h-4 w-4" />
                      {t("shell.newLanding")}
                    </Link>
                  </>
                ) : null}

                {isBrandEditPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}`}
                    className={backButtonClassName}
                    aria-label={t("shell.backToBrand")}
                    title={t("shell.backToBrand")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                ) : null}

                {isNewLandingPage ? (
                  <>
                    <Link
                      href={`/admin/brands/${activeBrand.slug}/new/ai`}
                      className="admin-button-primary"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t("shell.createWithAi")}
                    </Link>

                    <Link
                      href={`/admin/brands/${activeBrand.slug}/landings`}
                      className={backButtonClassName}
                      aria-label={t("shell.backToLandings")}
                      title={t("shell.backToLandings")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </>
                ) : null}

                {isNewLandingAiPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}/new`}
                    className={backButtonClassName}
                    aria-label={t("shell.backToNewLanding")}
                    title={t("shell.backToNewLanding")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                ) : null}

                {isLandingEditorPage ? (
                  <Link
                    href={`/admin/brands/${activeBrand.slug}/landings`}
                    className={backButtonClassName}
                    aria-label={t("shell.backToLandings")}
                    title={t("shell.backToLandings")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <div>{children}</div>
      </div>
      <EdwinMascot />
    </div>
  );
}
