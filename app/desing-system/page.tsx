import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Code2,
  Palette,
  Sparkles,
  Type,
} from "lucide-react";
import EdwinButton from "@/components/ui/EdwinButton";

export const metadata: Metadata = {
  title: "Design System | EDwin AI",
  description:
    "Base documental de colores, tipografias y componentes UI de EDwin AI.",
};

const colorFamilies = [
  {
    name: "EDwin Cyan",
    role: "Acento tecnologico",
    usage: "Focus states, highlights, estados informativos y detalles vivos.",
    colors: [
      { name: "Darker", token: "--bunji-cyan-darker", value: "#147180" },
      { name: "Dark", token: "--bunji-cyan-dark", value: "#2ea7b4" },
      { name: "Base", token: "--bunji-cyan", value: "#7de3ea" },
      { name: "Light", token: "--bunji-cyan-light", value: "#c9f6fa" },
      { name: "Lightest", token: "--bunji-cyan-lightest", value: "#ecfdff" },
    ],
  },
  {
    name: "EDwin Red",
    role: "Energia de accion",
    usage: "CTAs especiales, alertas, momentos de decision y enfasis de marca.",
    colors: [
      { name: "Darker", token: "--bunji-red-darker", value: "#8f061a" },
      { name: "Dark", token: "--bunji-red-dark", value: "#c80824" },
      { name: "Base", token: "--bunji-red", value: "#ff0b2e" },
      { name: "Light", token: "--bunji-red-light", value: "#ff8fa0" },
      { name: "Lightest", token: "--bunji-red-lightest", value: "#ffe6eb" },
    ],
  },
  {
    name: "EDwin Purple",
    role: "Base del producto",
    usage: "Acciones principales, navegacion, profundidad visual y superficies.",
    colors: [
      { name: "Darker", token: "--bunji-primary-darker", value: "#24204f" },
      { name: "Dark", token: "--bunji-primary-dark", value: "#2f2b69" },
      { name: "Base", token: "--bunji-primary", value: "#3e3989" },
      { name: "Light", token: "--bunji-primary-light", value: "#d9d7f3" },
      { name: "Lightest", token: "--bunji-primary-lightest", value: "#eeedfa" },
    ],
  },
];

const heroColors = colorFamilies.map((family) =>
  family.colors.find((color) => color.name === "Base") ?? family.colors[0],
);

const buttonSpecs = [
  {
    name: "Primario",
    variant: "primary" as const,
    description: "Accion principal del dashboard. Usa morado con profundidad.",
  },
  {
    name: "Secundario",
    variant: "secondary" as const,
    description: "Acciones complementarias, navegacion y estados neutrales.",
  },
  {
    name: "Oscuro",
    variant: "dark" as const,
    description: "Acciones dentro de superficies densas o de mayor contraste.",
  },
  {
    name: "Peligro",
    variant: "danger" as const,
    description: "Eliminar, descartar o acciones destructivas.",
  },
  {
    name: "Rojo EDwin",
    variant: "red" as const,
    description: "CTA solido con el rojo de marca para acciones de alta energia.",
  },
  {
    name: "Cyan + Purple",
    variant: "gradientCyanPurple" as const,
    description: "Gradiente frio para acciones AI, tecnologia y exploracion.",
  },
  {
    name: "Red + Purple",
    variant: "gradientRedPurple" as const,
    description: "Gradiente de conversion para CTAs fuertes y pasos decisivos.",
  },
  {
    name: "Spectrum EDwin",
    variant: "gradientSpectrum" as const,
    description: "Gradiente completo con cyan, red y purple para momentos hero.",
  },
];

const surfaceSpecs = [
  {
    name: "admin-panel",
    className: "admin-panel",
    description: "Contenedor principal con borde suave, sombra y blur ligero.",
  },
  {
    name: "admin-panel-soft",
    className: "admin-panel-soft",
    description: "Superficie secundaria para bloques internos y previews.",
  },
  {
    name: "admin-empty-state",
    className: "admin-empty-state",
    description: "Estado vacio con borde dashed y lectura centrada.",
  },
];

function ColorFamilyCard({
  colors,
  name,
  role,
  usage,
}: {
  colors: { name: string; token: string; value: string }[];
  name: string;
  role: string;
  usage: string;
}) {
  return (
    <article className="admin-panel-soft overflow-hidden p-0">
      <div className="grid grid-cols-5">
        {colors.map((color) => (
          <div
            key={color.token}
            className="h-24"
            style={{ backgroundColor: color.value }}
            title={`${color.name} ${color.value}`}
          />
        ))}
      </div>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              {name}
            </h3>
            <p className="admin-eyebrow mt-1">{role}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-[var(--bunji-cyan)]">
            5 tokens
          </span>
        </div>
        <p className="admin-muted">{usage}</p>
        <div className="grid gap-3">
          {colors.map((color) => (
            <div
              key={`${color.token}-detail`}
              className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-slate-950/42 p-3"
            >
              <span
                className="h-8 w-8 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
                style={{ backgroundColor: color.value }}
              />
              <div>
                <p className="text-sm font-semibold text-white">{color.name}</p>
                <p className="font-mono text-xs text-slate-400">{color.token}</p>
              </div>
              <p className="font-mono text-xs text-slate-300">{color.value}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  icon,
  title,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="admin-icon-tile h-10 w-10">{icon}</span>
          <p className="admin-eyebrow">{eyebrow}</p>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="hidden h-1 w-24 rounded-full bg-[linear-gradient(90deg,var(--bunji-cyan),var(--bunji-red),var(--bunji-primary))] md:block" />
    </div>
  );
}

export default function DesingSystemPage() {
  return (
    <main className="dark min-h-screen bg-[#050817] text-slate-100">
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <div className="admin-panel relative overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_18%,rgba(125,227,234,0.18),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(255,11,46,0.14),transparent_24%),radial-gradient(circle_at_68%_84%,rgba(62,57,137,0.42),transparent_32%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/edwin-logo.png"
                  alt="EDwin AI"
                  width={72}
                  height={72}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                <div>
                  <p className="admin-eyebrow">Design System</p>
                  <p className="font-mono text-xs tracking-[0.35em] text-[var(--bunji-cyan)]">
                    EDWIN AI
                  </p>
                </div>
              </div>

              <div className="max-w-3xl space-y-5">
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                  Sistema visual base para construir EDwin AI.
                </h1>
                <p className="text-lg leading-8 text-slate-300">
                  Esta seccion resume tokens, fuentes, botones, formularios y
                  superficies del dashboard para que la marca crezca con una UI
                  consistente, escalable y documentada.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <EdwinButton href="#buttons" variant="gradientSpectrum">
                  Ver botones
                  <ArrowRight className="h-4 w-4" />
                </EdwinButton>
                <EdwinButton href="#tokens" variant="secondary">
                  Revisar tokens
                </EdwinButton>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-3">
                {heroColors.map((color) => (
                  <div
                    key={color.token}
                    className="aspect-square rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
                    style={{ backgroundColor: color.value }}
                    title={`${color.name} ${color.value}`}
                  />
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-slate-950/70 p-5">
                <p className="admin-eyebrow">Formula de marca</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Morado como base de confianza, cyan como precision
                  tecnologica y rojo como energia de accion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tokens" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <SectionHeader
          eyebrow="Tokens"
          icon={<Palette className="h-5 w-5" />}
          title="Paleta extendida"
        />
        <div className="grid gap-5 xl:grid-cols-3">
          {colorFamilies.map((family) => (
            <ColorFamilyCard key={family.name} {...family} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <SectionHeader
          eyebrow="Tipografia"
          icon={<Type className="h-5 w-5" />}
          title="Fuentes del dashboard"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="admin-panel p-6">
            <p className="admin-eyebrow">Principal</p>
            <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
              IBM Plex Sans
            </h3>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              Se usa para navegacion, formularios, tablas, titulos y textos del
              producto. Pesos activos: 400, 500, 600 y 700.
            </p>
          </article>
          <article className="admin-panel p-6 font-mono">
            <p className="admin-eyebrow">Tecnica</p>
            <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">
              IBM Plex Mono
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Ideal para slugs, IDs, tokens, rutas y valores tecnicos donde la
              lectura caracter por caracter importa.
            </p>
          </article>
        </div>
      </section>

      <section id="buttons" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <SectionHeader
          eyebrow="Componentes UI"
          icon={<Sparkles className="h-5 w-5" />}
          title="Botones"
        />
        <div className="admin-panel overflow-hidden">
          <div className="grid border-b border-white/10 bg-white/[0.03] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:grid-cols-[220px_1fr_240px]">
            <span>Nombre</span>
            <span>Uso</span>
            <span>Componente</span>
          </div>
          {buttonSpecs.map((button) => (
            <div
              key={button.name}
              className="grid gap-4 border-b border-white/10 px-5 py-5 last:border-b-0 md:grid-cols-[220px_1fr_240px] md:items-center"
            >
              <div>
                <h3 className="font-semibold text-white">{button.name}</h3>
                <p className="mt-1 font-mono text-xs text-[var(--bunji-cyan)]">
                  {`variant="${button.variant}"`}
                </p>
              </div>
              <p className="admin-muted">{button.description}</p>
              <div>
                <EdwinButton variant={button.variant} className="w-full">
                  {button.name}
                </EdwinButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <SectionHeader
          eyebrow="Superficies"
          icon={<Code2 className="h-5 w-5" />}
          title="Cards y contenedores"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {surfaceSpecs.map((surface) => (
            <article key={surface.name} className={`${surface.className} p-6`}>
              <p className="admin-eyebrow">{surface.name}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {surface.name.replace("admin-", "")}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {surface.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <SectionHeader
          eyebrow="Formularios"
          icon={<Check className="h-5 w-5" />}
          title="Inputs base"
        />
        <div className="admin-panel grid gap-6 p-6 lg:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-white">
              Campo de texto
            </span>
            <input className="admin-input" placeholder="Ej. Universidad EDwin" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-white">
              Area de texto
            </span>
            <textarea
              className="admin-textarea min-h-28"
              placeholder="Notas, contexto o instrucciones..."
            />
          </label>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:pb-20">
        <div className="admin-panel grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
          <span className="admin-icon-tile">
            <CircleAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="admin-eyebrow">Siguiente paso</p>
            <p className="mt-2 text-lg leading-8 text-slate-300">
              Esta pagina queda como base documental. A partir de aqui podemos
              seguir convirtiendo patrones existentes en componentes UI
              reutilizables: cards, badges, tablas, inputs, menus y estados de
              carga.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
