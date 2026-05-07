"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AdminUser = {
  email: string;
  name: string;
};

export default function AdminUserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

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

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", authUser.id)
          .maybeSingle();

        if (isMounted) {
          setUser({
            email: authUser.email || "",
            name: profile?.full_name || authUser.email || "Usuario",
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
    <div className="flex items-center gap-3 rounded-2xl px-4 py-2 text-sm">
      <UserCircle className="h-5 w-5 text-slate-500 dark:text-slate-300" />

      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900 dark:text-slate-50">
          {loading ? "Cargando..." : user?.name || "Usuario"}
        </p>
        {user?.email && user.email !== user.name ? (
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-100"
      >
        <LogOut className="h-4 w-4" />
        {signingOut ? "Saliendo..." : "Salir"}
      </button>
    </div>
  );
}
