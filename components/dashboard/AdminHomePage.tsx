import BrandCard from "@/components/dashboard/BrandCard";
import { getBrands, getLandingsByBrand } from "@/lib/data";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  FileStack,
  Plus,
  Rocket,
  SwatchBook,
} from "lucide-react";

export default function HomePage() {
  const brands = getBrands();
  const totalLandings = brands.reduce(
    (count, brand) => count + getLandingsByBrand(brand.slug).length,
    0,
  );

  const highlights = [
    {
      title: "Crea y organiza tus marcas",
      description:
        "Configura la identidad de cada universidad o cliente con logos, colores, tipografías y enlaces legales desde un solo lugar.",
      href: "/admin/brands/new",
      cta: "Crear una marca",
      icon: SwatchBook,
      featured: true,
    },
    {
      title: "Construye landings listas para editar",
      description:
        "Genera nuevas páginas, ajusta sus secciones visuales, administra formularios y exporta HTML para tus campañas.",
      href: "/admin/brands",
      cta: "Explorar marcas",
      icon: FileStack,
    },
    {
      title: "Acelera el flujo con AI",
      description:
        "Usa la creación asistida para cargar programas más rápido, proponer contenidos y dejar una base lista para revisión.",
      href: "/admin",
      cta: "Ir al panel",
      icon: Bot,
    },
  ];

  return (
    <main className="min-h-screen bg-transparent px-6 py-8">
      <div className="w-full">
        <section className="overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[minmax(0,1.3fr)_220px] lg:items-center lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                Bienvenido
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-slate-950 dark:text-slate-50 md:text-5xl">
                Todo est&aacute; listo para
                {" "}
                <span className="text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">crear, editar y escalar</span>
                {" "}
                tus landings desde un solo dashboard.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Bunji Landing Engine te ayuda a centralizar marcas, construir
                programas acad&eacute;micos, ajustar contenido visual, preparar
                formularios y exportar p&aacute;ginas listas para campa&ntilde;as o
                implementaci&oacute;n.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/admin/brands/new"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Crear nueva marca
                </Link>

                <Link
                  href="/admin/brands"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  Ver todas las marcas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary-light)] text-[var(--bunji-primary)] dark:border-slate-700 dark:bg-slate-900 dark:text-[var(--bunji-primary-muted)] md:h-40 md:w-40">
                <Rocket className="h-16 w-16 md:h-20 md:w-20" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-slate-300" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Pasos recomendados
              </p>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {brands.length} marcas configuradas y {totalLandings} landings creadas
            </p>
          </div>

          <div className="grid border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group border-r border-slate-200 p-8 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${
                    item.featured
                      ? "bg-[var(--bunji-primary-light)]/80 dark:bg-slate-900"
                      : "bg-white dark:bg-slate-950"
                  }`}
                >
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${
                      item.featured
                        ? "border-[var(--bunji-primary-soft)] bg-[var(--bunji-primary)] text-white dark:border-[var(--bunji-primary-muted)]"
                        : "border-slate-200 bg-slate-100 text-[var(--bunji-primary)] dark:border-slate-700 dark:bg-slate-900 dark:text-[var(--bunji-primary-muted)]"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h2 className="mt-8 text-3xl font-bold leading-tight text-slate-950 dark:text-slate-50">
                    {item.title}
                  </h2>

                  <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--bunji-primary)] dark:text-[var(--bunji-primary-muted)]">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Marcas
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-950 dark:text-slate-50">
                Espacios de trabajo disponibles
              </h2>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
                Entra a cada marca para editar su identidad, crear nuevas
                landings, ajustar programas existentes y exportar entregables.
              </p>
            </div>

            <Link
              href="/admin/brands/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Nueva marca
            </Link>
          </div>

          <div className="grid gap-8 border border-none dark:border-none md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => {
              const landings = getLandingsByBrand(brand.slug);

              return (
                <BrandCard
                  key={brand.slug}
                  brand={brand}
                  landingCount={landings.length}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
