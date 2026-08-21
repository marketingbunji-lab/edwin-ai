import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  CircleAlert,
  Code2,
  BookOpenText,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  Palette,
  Sparkles,
  SunMedium,
  Type,
} from "lucide-react";
import EdwinButton from "@/components/ui/EdwinButton";
import EdwinSwitchShowcase from "@/components/ui/EdwinSwitchShowcase";

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

const backgroundSpecs = [
  {
    name: "Shell light",
    description:
      "Fondo base del dashboard en modo claro. Mezcla gradiente vertical con halos cyan y purple para dar profundidad sin competir con el contenido.",
    previewClassName:
      "bg-[var(--bunji-shell-bg)] border-slate-200/90",
  },
  {
    name: "Shell dark",
    description:
      "Version oscura del shell. Usa la misma logica de halos, pero con capas profundas para mantener contraste y atmosfera premium.",
    previewClassName:
      "bg-[var(--bunji-shell-bg-dark)] border-white/10",
    darkPreview: true,
  },
  {
    name: "Strategic knowledge",
    description:
      "Fondo de cards estratégicas para conocimiento. Usa cyan suave en la esquina superior y base blanca fría para comunicar estructura y progreso.",
    previewClassName:
      "bg-[radial-gradient(circle_at_12%_14%,rgba(125,227,234,0.16),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,244,255,0.97))] border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)]",
  },
  {
    name: "Strategic agents",
    description:
      "Fondo de cards para agentes y activación. Lleva el brillo hacia la esquina opuesta para sentirse más dinámico y orientado a acción.",
    previewClassName:
      "bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)]",
  },
];

const badgeSpecs = [
  {
    name: "Virtual",
    helper: "Badge de tipo o modalidad",
    className:
      "border-[color-mix(in_srgb,var(--bunji-primary-soft)_68%,white)] bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)]",
  },
  {
    name: "Published",
    helper: "Estado neutral publicado",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
  {
    name: "Pendiente",
    helper: "Estado pendiente de flujo",
    className:
      "border-[color-mix(in_srgb,var(--bunji-primary-soft)_68%,white)] bg-[var(--bunji-primary-light)] text-[var(--bunji-primary-dark)]",
    icon: CircleDashed,
  },
  {
    name: "Completado",
    helper: "Estado listo o configurado",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
];

const shellPrimaryNavSpecs = [
  { label: "Inicio", icon: LayoutDashboard, active: false },
  { label: "Universidades", icon: FolderKanban, active: true },
];

const shellBrandSpecs = [
  {
    name: "American Healthcare Institute",
    subtitle: "American Healthcare Institute",
    active: false,
  },
  {
    name: "Corporación Universitaria Min...",
    subtitle: "Corporación Universitaria Minuto d...",
    active: true,
    children: [
      { label: "Mi Universidad", icon: BookOpenText, active: true },
      { label: "Acciones", icon: Sparkles, active: false },
    ],
  },
  {
    name: "Fundación Politécnico Minuto...",
    subtitle: "Fundación Politécnico Minuto de Di...",
    active: false,
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3f7ff_0%,#e8eef9_100%)] text-slate-950">
      <div className="dark bg-[#050817] text-slate-100">
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
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="admin-panel relative overflow-hidden border-slate-200/80 bg-white/90 p-8 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:p-10">
          <div className="absolute inset-0 opacity-90 [background:radial-gradient(circle_at_14%_12%,rgba(125,227,234,0.16),transparent_26%),radial-gradient(circle_at_84%_16%,rgba(62,57,137,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,246,255,0.96))]" />
          <div className="relative space-y-10">
            <SectionHeader
              eyebrow="Light mode"
              icon={<SunMedium className="h-5 w-5" />}
              title="Versiones claras de los componentes"
            />

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <article className="admin-panel space-y-6 border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div>
                  <p className="admin-eyebrow">Botones</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    Acciones principales sobre superficies claras
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {buttonSpecs.slice(0, 6).map((button) => (
                    <div
                      key={`light-${button.name}`}
                      className="admin-panel-soft space-y-3 border-slate-200/80 bg-slate-50/90 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {button.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {button.description}
                        </p>
                      </div>
                      <EdwinButton className="w-full" variant={button.variant}>
                        {button.name}
                      </EdwinButton>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel grid gap-5 border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div>
                  <p className="admin-eyebrow">Formularios</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">
                    Inputs y superficies para flujos del dashboard
                  </h3>
                </div>

                <div className="grid gap-4">
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-950">
                      Campo de texto
                    </span>
                    <input
                      className="admin-input"
                      placeholder="Ej. Universidad EDwin"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-semibold text-slate-950">
                      Area de texto
                    </span>
                    <textarea
                      className="admin-textarea min-h-28"
                      placeholder="Agrega contexto institucional o notas para el equipo..."
                    />
                  </label>
                  <div className="admin-empty-state border-slate-200/90 bg-slate-50/85 p-6">
                    <p className="text-sm font-semibold text-slate-950">
                      Estado vacio
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Utiliza este patron para espacios todavia no configurados o
                      pendientes de completar.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <div className="mb-6">
                <p className="admin-eyebrow">Switch</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Alternadores para preferencias y estados binarios
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  El switch funciona como patron base para activar funciones,
                  preferencias y estados de configuracion. Aqui queda documentado
                  en light mode y dark mode para mantener consistencia.
                </p>
              </div>
              <EdwinSwitchShowcase />
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div>
                  <p className="admin-eyebrow">Badges</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    Etiquetas y estados del dashboard
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Estos badges cubren tipologias de contenido, estados de flujo
                    y señales de activación. Se documentan con el mismo lenguaje
                    visual que ya vive en la plataforma.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {badgeSpecs.map((badge) => (
                    <div
                      key={badge.name}
                      className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4"
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${badge.className}`}
                      >
                        {badge.icon ? <badge.icon className="h-3.5 w-3.5" /> : null}
                        {badge.name}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {badge.helper}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div>
                  <p className="admin-eyebrow">Shell</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                    Estados de navegación del sidebar
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Aquí quedan documentados el botón inactivo, el activo
                    principal, la marca seleccionada y la subnavegación activa del
                    shell.
                  </p>
                </div>

                <div className="mt-6 max-w-[280px] rounded-[24px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,250,255,0.94)_100%),radial-gradient(circle_at_18%_12%,rgba(125,227,234,0.16)_0%,transparent_24%),radial-gradient(circle_at_82%_8%,rgba(62,57,137,0.14)_0%,transparent_26%)] p-4 shadow-[0_22px_64px_rgba(34,39,74,0.12)]">
                  <div className="space-y-1">
                    {shellPrimaryNavSpecs.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                          item.active
                            ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_70%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_80%,white))] text-[var(--bunji-primary-dark)] ring-1 ring-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] shadow-[0_12px_24px_rgba(125,227,234,0.16)]"
                            : "border border-slate-200/90 bg-white/78 text-slate-700 shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <div className="mb-3 flex items-center gap-2 px-4">
                      <Sparkles className="h-4 w-4 text-[var(--bunji-primary)]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Marcas activas
                      </p>
                    </div>

                    <div className="space-y-1">
                      {shellBrandSpecs.map((brand) => (
                        <div key={brand.name} className="space-y-1">
                          <div
                            className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 ${
                              brand.active
                                ? "bg-[linear-gradient(135deg,rgba(62,57,137,0.12),rgba(125,227,234,0.12))] text-slate-950 ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] shadow-[0_12px_28px_rgba(62,57,137,0.12)]"
                                : "text-slate-600"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{brand.name}</p>
                              <p className="truncate text-xs text-slate-500">
                                {brand.subtitle}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                          </div>

                          {brand.children ? (
                            <div
                              className="ml-4 space-y-1 border-l pl-4 pt-1"
                              style={{
                                borderColor:
                                  "color-mix(in srgb, var(--bunji-cyan) 30%, rgba(148, 163, 184, 0.4))",
                              }}
                            >
                              {brand.children.map((child) => (
                                <div
                                  key={child.label}
                                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                                    child.active
                                      ? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_84%,white))] font-medium text-[var(--bunji-primary-dark)]"
                                      : "text-slate-500"
                                  }`}
                                >
                                  <child.icon className="h-4 w-4 shrink-0" />
                                  <span>{child.label}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div>
              <div className="mb-6">
                <p className="admin-eyebrow">Backgrounds</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Fondos con gradientes y halos decorativos
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Esta librería documenta cómo usamos círculos difuminados,
                  gradientes suaves y capas atmosféricas para construir profundidad
                  visual. La idea es mantener variedad, pero con una lógica común:
                  un color dominante, un halo secundario y una base que no afecte
                  la legibilidad.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {backgroundSpecs.map((background) => (
                  <article
                    key={background.name}
                    className={`admin-panel overflow-hidden border p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] ${
                      background.darkPreview ? "dark" : ""
                    }`}
                  >
                    <div
                      className={`rounded-[24px] border p-5 ${background.previewClassName}`}
                    >
                      <div className="rounded-[20px] border border-white/45 bg-white/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {background.name}
                        </p>
                        <h4 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                          Layered atmospheric background
                        </h4>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {background.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <p className="admin-eyebrow">Progress bar</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Barra de progreso para cards estratégicas
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Este patrón se usa dentro de `Mi Universidad` para representar
                  avance visible del workspace. Combina un track suave, un fill con
                  gradiente purple-cyan y un badge de estado para que el progreso
                  se lea rápido sin verse pesado.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                  <p className="admin-eyebrow">Anatomía</p>
                  <div className="mt-5 rounded-[28px] border border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] bg-[radial-gradient(circle_at_12%_14%,rgba(125,227,234,0.16),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,244,255,0.97))] p-7 shadow-[0_24px_56px_rgba(62,57,137,0.12)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Porcentaje completado de Mi Universidad
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-5xl font-bold leading-none tracking-tight text-[var(--bunji-primary-dark)]">
                        50%
                      </p>
                      <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_78%,white)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bunji-primary-dark)]">
                        Completado
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="h-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,rgba(62,57,137,0.08),rgba(125,227,234,0.12))] ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_52%,white)]">
                        <div className="h-full w-1/2 rounded-full bg-[linear-gradient(100deg,var(--bunji-cyan)_0%,var(--bunji-red)_38%,color-mix(in_srgb,var(--bunji-red)_42%,var(--bunji-primary)_58%)_62%,var(--bunji-primary)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(125,227,234,0.22),0_0_28px_rgba(255,11,46,0.12)]" />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                  <p className="admin-eyebrow">Uso</p>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Track</p>
                      <p className="mt-1">
                        Base redondeada con gradiente muy suave para que el fondo
                        no compita con el porcentaje.
                      </p>
                    </div>
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Fill</p>
                      <p className="mt-1">
                        Relleno purple-cyan con brillo ligero para comunicar avance
                        y mantener conexión con la identidad EDwin.
                      </p>
                    </div>
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Contexto</p>
                      <p className="mt-1">
                        Úsalo en cards ejecutivas donde el usuario necesita ver
                        progreso resumido por área, no en tablas o formularios.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <p className="admin-eyebrow">Strategic cards</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Patrones especiales de Mi Universidad y Education Agents
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Estas cards son distintas a las superficies base. Aquí se
                  documentan como componentes editoriales y estratégicos del
                  overview de marca.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <StrategicCardShowcase
                  accentLabel="Mi Universidad"
                  ctaLabel="Construir conocimiento ->"
                  description="Organiza programas, diferenciales, estudiantes, historicos, expertos y competidores en una columna vertebral viva."
                  helperLabel="Porcentaje completado de Mi Universidad"
                  helperValue="50%"
                  icon={FileStack}
                  progressValue={50}
                  statusLabel="Completado"
                  tone="knowledge"
                  title="Construir Mi Universidad"
                />
                <StrategicCardShowcase
                  accentLabel="Education Agents"
                  ctaLabel="Ver journey y agentes ->"
                  description="Usa agentes especializados por fase para convertir el conocimiento en tareas, entregables y siguientes acciones."
                  helperLabel="Siguiente accion"
                  helperValue="Landing Activation"
                  icon={Sparkles}
                  tone="agents"
                  title="Desplegar Education Agents"
                />
              </div>
            </div>

            <div>
              <div className="mb-6">
                <p className="admin-eyebrow">Brand cards</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                  Card de universidades y marcas del listado principal
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Este patrón corresponde a las cards de `admin/brands`. Combina
                  fondo oscuro editorial, marca en primer plano, contador de
                  landings y acciones rápidas para editar o abrir el workspace.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                  <p className="admin-eyebrow">Preview</p>
                  <div className="relative mt-5 rounded-2xl border border-white/10 p-6 text-white shadow-[0_18px_45px_rgba(2,6,23,0.28)] [background:radial-gradient(circle_at_12%_18%,rgba(125,227,234,0.24)_0%,transparent_28%),radial-gradient(circle_at_86%_8%,rgba(148,163,184,0.15)_0%,transparent_32%),linear-gradient(145deg,#111827_0%,#1f2a44_54%,#312e81_140%)]">
                    <div
                      className="pointer-events-none absolute"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-45"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
                        backgroundSize: "34px 34px",
                        maskImage: "linear-gradient(140deg, black, transparent 72%)",
                      }}
                    />
                    <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-8 h-44 w-44 rounded-full bg-[rgba(79,70,229,0.25)] blur-3xl" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-75" />

                    <div className="absolute right-6 top-6 z-10">
                      <button
                        type="button"
                        aria-label="Abrir opciones de la marca"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/[0.08] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>

                      <div className="absolute right-0 mt-2 min-w-[168px] rounded-2xl border border-white/14 bg-slate-950/96 p-2 shadow-[0_20px_50px_rgba(2,6,23,0.42)] backdrop-blur-xl">
                        <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white">
                          Editar
                        </div>
                        <div className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-300">
                          Eliminar
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="grid grid-cols-3 items-center gap-5 pr-14">
                        <div className="col-span-1">
                          <div className="flex h-20 items-center rounded-2xl border border-white/10 bg-white/[0.08] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
                            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#facc15,#fb7185,#38bdf8)] text-sm font-bold text-white">
                              LOGO
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <h3 className="text-xl font-bold leading-tight tracking-tight text-white">
                            American Healthcare Institute
                          </h3>
                          <p className="mt-2 break-words text-sm leading-5 text-white/70">
                            American Healthcare Institute
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-sm font-medium text-white/80">
                          12 programas
                        </span>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="admin-panel border-slate-200/90 bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                  <p className="admin-eyebrow">Uso</p>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Fondo</p>
                      <p className="mt-1">
                        Usa un gradiente oscuro con halos y una retícula tenue para
                        dar sensación de workspace activo y premium.
                      </p>
                    </div>
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Contenido</p>
                      <p className="mt-1">
                        El bloque superior siempre prioriza logo, nombre y nombre
                        corto o descriptor institucional.
                      </p>
                    </div>
                    <div className="admin-panel-soft border-slate-200/80 bg-slate-50/85 p-4">
                      <p className="font-semibold text-slate-950">Acciones</p>
                      <p className="mt-1">
                        Las acciones secundarias viven dentro del menú de tres
                        puntos. La card se siente más limpia y el acceso al
                        workspace pasa a ser implícito por click en la propia
                        card.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="dark bg-[#050817] text-slate-100">
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
      </div>
    </main>
  );
}

function StrategicCardShowcase({
  accentLabel,
  ctaLabel,
  description,
  helperLabel,
  helperValue,
  icon: Icon,
  progressValue,
  statusLabel,
  title,
  tone,
}: {
  accentLabel: string;
  ctaLabel: string;
  description: string;
  helperLabel: string;
  helperValue: string;
  icon: React.ComponentType<{ className?: string }>;
  progressValue?: number;
  statusLabel?: string;
  title: string;
  tone: "knowledge" | "agents";
}) {
  const toneClasses =
    tone === "knowledge"
      ? {
          shell:
            "border-[color-mix(in_srgb,var(--bunji-primary-soft)_70%,white)] bg-[radial-gradient(circle_at_12%_14%,rgba(125,227,234,0.16),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(241,244,255,0.97))] shadow-[0_24px_56px_rgba(62,57,137,0.12)]",
          icon:
            "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-primary-light)_72%,white),color-mix(in_srgb,var(--bunji-cyan-soft)_85%,white))] text-[var(--bunji-primary-dark)]",
          accent: "text-[var(--bunji-primary)]",
        }
      : {
          shell:
            "border-[color-mix(in_srgb,var(--bunji-cyan)_36%,white)] bg-[radial-gradient(circle_at_88%_10%,rgba(125,227,234,0.18),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.99),rgba(238,250,251,0.95))] shadow-[0_24px_56px_rgba(125,227,234,0.14)]",
          icon:
            "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--bunji-cyan-soft)_88%,white),color-mix(in_srgb,var(--bunji-primary-light)_62%,white))] text-[var(--bunji-primary-dark)]",
          accent: "text-[var(--bunji-cyan-dark)]",
        };

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border p-7 transition-all duration-300 ${toneClasses.shell}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-[rgba(255,11,46,0.06)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,227,234,0.9),transparent)] opacity-80" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {accentLabel}
            </p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
              {title}
            </h3>
          </div>

          <div className={`admin-icon-tile h-12 w-12 ${toneClasses.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          {description}
        </p>

        <div className="mt-7 rounded-2xl border border-white/60 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {helperLabel}
          </p>
          {typeof progressValue === "number" ? (
            <>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-5xl font-bold leading-none tracking-tight text-[var(--bunji-primary-dark)]">
                  {helperValue}
                </p>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--bunji-cyan)_38%,white)] bg-[color-mix(in_srgb,var(--bunji-cyan-soft)_78%,white)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bunji-primary-dark)]">
                  {statusLabel}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-3 overflow-hidden rounded-full bg-[linear-gradient(90deg,rgba(62,57,137,0.08),rgba(125,227,234,0.12))] ring-1 ring-[color-mix(in_srgb,var(--bunji-primary-soft)_52%,white)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(100deg,var(--bunji-cyan)_0%,var(--bunji-red)_38%,color-mix(in_srgb,var(--bunji-red)_42%,var(--bunji-primary)_58%)_62%,var(--bunji-primary)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(125,227,234,0.22),0_0_28px_rgba(255,11,46,0.12)]"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {helperValue}
            </p>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <p className={`text-sm font-semibold ${toneClasses.accent}`}>{ctaLabel}</p>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(62,57,137,0.22),transparent)]" />
        </div>
      </div>
    </article>
  );
}
