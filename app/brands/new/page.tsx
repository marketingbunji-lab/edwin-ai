import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import BrandEditor from "../../../components/editor/BrandEditor";

const emptyBrand = {
  slug: "",
  name: "",
  shortName: "",
  logo: "",
  logos: {
    light: "",
    dark: "",
  },
  typography: {
    fontFamily: "",
    googleFontHref: "",
  },
  primaryColor: "#111827",
  secondaryColor: "#F8D74A",
  description: "",
  legalLinks: [],
  certifications: [],
};

export default function NewBrandPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 dark:bg-[#020617]">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Bunji</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Crear nueva marca</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/brands/new/ai"
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-[var(--bunji-primary)]"
            >
              <Sparkles className="h-4 w-4" />
              Crear con IA
            </Link>

            <Link
              href="/admin/brands"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-slate-700 dark:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
        </div>

        <BrandEditor mode="create" initialBrand={emptyBrand} />
      </div>
    </main>
  );
}
