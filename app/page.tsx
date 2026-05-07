import { Suspense } from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login/LoginForm";
import { createClient } from "@/utils/supabase/server";

async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="dark min-h-screen bg-[#05050a] text-white">
      <section className="grid min-h-screen lg:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
        <div className="flex min-h-screen items-center bg-[#05050a] px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 flex items-center gap-3">
              <Image
                src="/icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-md"
                priority
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bunji-primary-muted)]">
                  Bunji
                </p>
                <h1 className="text-base font-semibold text-white">
                  Landing Engine
                </h1>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a78bfa]">
                Admin access
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                Ingresa para gestionar tus landings.
              </h2>
            </div>

            <div className="border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>

        <div
          className="relative hidden min-h-screen bg-cover bg-center lg:block"
          style={{ backgroundImage: "url('/edwin-landing-engine.jpg')" }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#05050a] via-[#05050a]/20 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>
    </main>
  );
}
