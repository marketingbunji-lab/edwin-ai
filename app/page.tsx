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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#edf3fb_100%)] text-slate-950">
      <section className="grid min-h-screen lg:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.22fr)]">
        <div className="relative flex min-h-screen items-center overflow-hidden px-6 py-10 sm:px-10 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute left-[-80px] top-[-60px] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(62,57,137,0.16)_0%,_rgba(62,57,137,0)_72%)]" />
            <div className="absolute bottom-[-100px] right-[-60px] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(125,227,234,0.28)_0%,_rgba(125,227,234,0)_70%)]" />
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="mb-10 flex items-center gap-3">
              <Image
                src="/icon.png"
                alt=""
                width={32}
                height={32}
                className="h-9 w-9 rounded-xl shadow-[0_10px_25px_rgba(62,57,137,0.22)]"
                priority
              />
              <div>
                <h1 className="text-base font-semibold text-slate-950">
                  EDwin
                </h1>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bunji-primary)]">
                  AI
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/88 p-3 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-slate-200/80 bg-white px-6 py-7 sm:px-8 sm:py-8">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Secure login
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    Sign in to continue
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Use your admin credentials to access the EDwin dashboard.
                  </p>
                </div>

                <Suspense fallback={null}>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative hidden min-h-screen overflow-hidden lg:block"
          style={{
            backgroundImage:
              "url('https://raw.githubusercontent.com/marketingbunji-lab/edwin-ai/refs/heads/main/public/home-edwin-login.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.04)_28%,rgba(6,147,227,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,249,252,0.9)_0%,rgba(247,249,252,0.2)_24%,rgba(15,23,42,0.05)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-8 xl:p-12">
            <div className="max-w-md rounded-[30px] border border-white/50 bg-white/20 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                EDwin AI
              </p>
              <h3 className="mt-4 text-3xl font-semibold leading-tight text-slate-950">
                AI Agents working faster, smarter,
                 together for your university and your school
              </h3>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-800/80">
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
