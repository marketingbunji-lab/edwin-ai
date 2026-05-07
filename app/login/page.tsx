import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-[#020617]">
      <div className="mx-auto max-w-md bg-white p-6 dark:bg-slate-950">
        <div className="mb-8 flex items-center gap-3">
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-md"
            priority
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
              Bunji
            </p>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              Landing Engine
            </h1>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
