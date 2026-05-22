export type ProjectDocSection = {
  id: string;
  title: string;
  description?: string;
  items: string[];
};

export type ProjectDocPage = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: ProjectDocSection[];
};

export const projectDocumentation: ProjectDocPage = {
  title: "Documentación del proyecto",
  subtitle:
    "Base viva del sistema, su propósito, módulos actuales y decisiones de producto para seguir orquestando la plataforma.",
  lastUpdated: "2026-05-22",
  sections: [
    {
      id: "vision",
      title: "Visión del producto",
      description:
        "EDwin AI busca consolidar en una sola plataforma el proceso operativo de marketing digital para marcas educativas.",
      items: [
        "La meta no es solo crear landings, sino orquestar marca, contenido, buyer persona, creatividad, campañas y captación.",
        "Los agentes en n8n se usan como capa de generación y enriquecimiento, mientras la app actúa como workspace operativo.",
        "La dirección actual apunta a convertir módulos aislados en un flujo guiado por etapas.",
      ],
    },
    {
      id: "modules",
      title: "Módulos actuales",
      items: [
        "Brands: configuración de identidad, sitio oficial, colores, logos, campuses, legal y certificaciones.",
        "Buyer Persona: perfiles editables por marca para orientar mensajes y campañas.",
        "Programs: base estructurada de contenido por programa y origen de la mayor parte del contenido de landing.",
        "Visual Assets: recursos gráficos por marca y por programa, con generación vía agentes de IA.",
        "Landings: editor, preview, export HTML y publicación pública por marca.",
      ],
    },
    {
      id: "orchestration",
      title: "Estado de orquestación",
      description:
        "Se comenzó a transformar el detalle de marca en un control room orientado a workflow.",
      items: [
        "La página `/admin/brands/[brand]` ahora funciona como centro de orquestación.",
        "Cada etapa muestra un estado derivado: `done`, `in_progress` o `empty`.",
        "Cada etapa tiene un CTA principal y explica qué desbloquea para la siguiente fase.",
        "El objetivo del MVP actual es que la experiencia se sienta como pipeline y no solo como menú.",
      ],
    },
    {
      id: "data-model",
      title: "Modelo de datos actual",
      description:
        "Hoy la app usa principalmente JSON locales como fuente de verdad operativa, con una integración parcial con Supabase.",
      items: [
        "Las marcas viven en `data/brands`.",
        "Los programas/landings viven en `data/programs/{brand}`.",
        "Buyer persona vive en `data/buyer-person/{brand}`.",
        "Visual assets vive en `data/visual-assets/{brand}`.",
        "`lib/data.ts` centraliza el contrato principal para brands, programs y landings.",
        "Cuando una landing no trae imágenes configuradas, `lib/data.ts` ahora puede completar varias secciones usando `programs-assets` del programa relacionado sin sobrescribir configuración manual.",
        "El hero de landing ahora soporta variantes seleccionables desde `hero.variant`, incluyendo una `option-b` completa con menú de anclas para navegar entre secciones sin mezclar esa lógica con el hero default.",
        "Supabase ya existe en el proyecto, pero todavía no es la fuente central de todas las entidades.",
      ],
    },
    {
      id: "integrations",
      title: "Integraciones activas",
      items: [
        "n8n se usa como capa de agentes externos para generación y enriquecimiento.",
        "Supabase se usa para auth, brands parciales y mantiene utilidades listas para persistencia futura de imágenes generadas por IA.",
        "Los formularios de ciertas landings están conectados a CRMs externos como Verity.",
        "El export HTML ya funciona desde el preview renderizado en la app.",
      ],
    },
    {
      id: "ia-assets",
      title: "Flujo actual de imágenes IA",
      description:
        "El flujo operativo vigente sigue apoyándose en `Upload a File` dentro de n8n para obtener una URL final usable desde el editor.",
      items: [
        "El agente genera la imagen en n8n.",
        "El nodo `Upload a File` sigue siendo la estrategia activa para convertir el binario en una URL visible por la app.",
        "La app recibe la respuesta del webhook por `/api/visual-assets-ai` o `/api/program-assets-ai` y la usa para poblar el preview del asset.",
        "Existe una base en código para persistir imágenes en Supabase Storage, pero esa ruta no es la operación principal actual del flujo.",
      ],
    },
    {
      id: "admin-guardrails",
      title: "Guardrails del admin",
      items: [
        "Los botones de guardar en Brand Editor, Program Editor, Landing Editor y formularios de buyer persona / visual assets ya se bloquean cuando no hay cambios pendientes.",
        "Mientras una petición de guardado está en curso, el botón también queda deshabilitado para evitar envíos duplicados.",
        "Después de un guardado exitoso, el estado guardado pasa a ser la nueva referencia y el botón solo se reactiva cuando el usuario vuelve a editar.",
        "Los botones de regreso del admin ahora siguen un patrón icon-only, conservando `aria-label` y `title` para accesibilidad sin ocupar ancho visual innecesario.",
      ],
    },
    {
      id: "public-experience",
      title: "Experiencia pública actual",
      items: [
        "Las landings públicas están organizadas por marca bajo `/landings/[brand]` y `/landings/[brand]/[landing]`.",
        "La página pública de cada marca solo muestra landings con `status = published`.",
        "La vista pública de marca está en light mode para simplificar lectura y navegación.",
      ],
    },
    {
      id: "next-steps",
      title: "Siguientes pasos sugeridos",
      items: [
        "Extender la orquestación al listado general de marcas para visualizar progreso global.",
        "Definir si el flujo de imágenes IA seguirá con `Upload a File` o si más adelante migrará de forma estable a Supabase Storage.",
        "Definir si la evolución natural del modelo de datos irá hacia Supabase híbrido o migración más amplia.",
        "Seguir documentando cambios importantes aquí a medida que el producto gane más cohesión entre módulos.",
      ],
    },
  ],
};
