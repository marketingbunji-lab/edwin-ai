"use client";

import { Check, ChevronUp, Languages, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDashboardLanguage } from "@/components/dashboard/DashboardLanguageProvider";
import { createClient } from "@/utils/supabase/client";

type AdminUser = {
  name: string;
  email: string;
};

type LocalUserResponse = {
  ok?: boolean;
  user?: AdminUser;
};

type ThemeMode = "light" | "dark";

type Props = {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
};

export default function AdminUserMenu({ theme, onThemeChange }: Props) {
  const router = useRouter();
  const { language, setLanguage, t } = useDashboardLanguage();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [authProvider, setAuthProvider] = useState<"local" | "supabase">(
    "supabase",
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const localResponse = await fetch("/api/auth/local/me");

        if (localResponse.ok) {
          const payload = (await localResponse.json()) as LocalUserResponse;

          if (payload.user && isMounted) {
            setAuthProvider("local");
            setUser(payload.user);
            return;
          }
        }

        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          if (isMounted) setUser(null);
          return;
        }

        if (isMounted) {
          const profileName =
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email ||
            "User";

          setUser({
            name: profileName,
            email: authUser.email || "",
          });
        }
      } finally {
            if (isMounted) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      if (authProvider === "local") {
        await fetch("/api/auth/local/logout", { method: "POST" });
      } else {
        const supabase = createClient();
        await supabase.auth.signOut();
      }

      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div
      className="relative w-full"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--bunji-primary-soft)_54%,white)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(244,247,255,0.76))] px-3 py-3 text-sm text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:border-[color-mix(in_srgb,var(--bunji-cyan)_50%,var(--bunji-primary-soft))] hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(232,240,255,0.9))] hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bunji-cyan)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(125,227,234,0.04))] dark:text-slate-100 dark:hover:border-[var(--bunji-cyan)]/30 dark:hover:bg-[linear-gradient(135deg,rgba(62,57,137,0.34),rgba(125,227,234,0.12))] dark:hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <UserCircle className="h-5 w-5 shrink-0 text-[var(--bunji-primary)] transition group-hover:text-[var(--bunji-primary-dark)] dark:text-[var(--bunji-cyan)] dark:group-hover:text-[var(--bunji-cyan-light)]" />
          <span className="truncate text-sm font-semibold text-slate-900 transition group-hover:text-slate-950 dark:text-slate-50 dark:group-hover:text-white">
            {loading ? t("userMenu.loading") : user?.email || user?.name || t("userMenu.user")}
          </span>
        </span>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-100 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--bunji-primary-soft)_54%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,249,255,0.94))] p-1 shadow-[0_22px_48px_rgba(26,32,65,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(7,11,28,0.94))]"
        >
          <div className="rounded-md px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
              {loading ? t("userMenu.loading") : user?.name || t("userMenu.user")}
            </p>
            {user?.email ? (
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            ) : null}
          </div>

          <div className="my-1 h-px bg-[color-mix(in_srgb,var(--bunji-primary-soft)_58%,white)] dark:bg-white/10" />

          <div className="px-3 pb-2 pt-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {t("userMenu.language")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["en", "es"] as const).map((option) => {
                const active = language === option;

                return (
                  <button
                    key={option}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => setLanguage(option)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                      active
                        ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white))] text-slate-950 dark:bg-white/10 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      {option === "en"
                        ? t("userMenu.english")
                        : t("userMenu.spanish")}
                    </span>
                    {active ? <Check className="h-4 w-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-1 h-px bg-[color-mix(in_srgb,var(--bunji-primary-soft)_58%,white)] dark:bg-white/10" />

          <button
            type="button"
            role="menuitemradio"
            aria-checked={theme === "light"}
            onClick={() => {
              onThemeChange("light");
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
              theme === "light"
                ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white))] text-slate-950 dark:bg-white/10 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
            }`}
          >
            <Sun className="h-4 w-4" />
            {t("userMenu.lightMode")}
          </button>

          <button
            type="button"
            role="menuitemradio"
            aria-checked={theme === "dark"}
            onClick={() => {
              onThemeChange("dark");
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
              theme === "dark"
                ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white))] text-slate-950 dark:bg-white/10 dark:text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
          }`}
          >
            <Moon className="h-4 w-4" />
            {t("userMenu.darkMode")}
          </button>

          <div className="my-1 h-px bg-[color-mix(in_srgb,var(--bunji-primary-soft)_58%,white)] dark:bg-white/10" />

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? t("userMenu.signingOut") : t("userMenu.signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
