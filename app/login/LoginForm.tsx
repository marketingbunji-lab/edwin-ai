"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

function getLoginErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("failed to fetch") ||
      message.includes("network") ||
      message.includes("fetch failed")
    ) {
      return "No pudimos conectar con Supabase. Revisa tu conexion, DNS o la URL del proyecto en .env.local.";
    }

    return error.message;
  }

  return "Could not sign in.";
}

async function signInWithLocalAuth(email: string, password: string) {
  const response = await fetch("/api/auth/local/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 404) {
    return false;
  }

  const payload = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.error || "No se pudo iniciar sesion.");
  }

  return true;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const localAuthHandled = await signInWithLocalAuth(email, password);

      if (!localAuthHandled) {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      }

      router.replace(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="you@company.com"
          className="login-input"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="Enter your password"
          className="login-input"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="edwin-button-gradient-spectrum w-full"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
