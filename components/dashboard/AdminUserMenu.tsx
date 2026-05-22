"use client";

import { ChevronUp, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AdminUser = {
  name: string;
};

type ThemeMode = "light" | "dark";

type Props = {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
};

export default function AdminUserMenu({ theme, onThemeChange }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
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
            "Usuario";

          setUser({
            name: profileName,
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

      const supabase = createClient();
      await supabase.auth.signOut();
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
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--bunji-primary-soft)_54%,white)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(244,247,255,0.76))] px-3 py-3 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,247,255,0.88))] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(125,227,234,0.04))] dark:hover:bg-white/[0.08]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <UserCircle className="h-5 w-5 shrink-0 text-[var(--bunji-primary)] dark:text-[var(--bunji-cyan)]" />
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {loading ? "Cargando..." : user?.name || "Usuario"}
          </span>
        </span>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--bunji-primary-soft)_54%,white)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,249,255,0.94))] p-1 shadow-[0_22px_48px_rgba(26,32,65,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(7,11,28,0.94))]"
        >
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
            Light mode
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
            Dark mode
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
            {signingOut ? "Saliendo..." : "Cerrar sesion"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
