# Consolidacion de visual assets

Fecha: 2026-08-21

## Alcance

- Se auditan todos los JSON vigentes de `data/programs` y `data/landings`.
- Las referencias visuales recuperables se materializan en `public/generated-assets/{brand}/programs-assets/{programa}`.
- Los JSON de programa y landing se actualizan para usar rutas locales.
- `data/visual-assets/{brand}` se reconstruye sin duplicados por `brand + programId + url`.
- Cada registro conserva en `notes` los archivos y campos JSON desde los que fue descubierto.

## Resultado aplicado

- 41 JSON de programa/landing inspeccionados.
- 126 referencias visuales encontradas.
- 98 combinaciones unicas de asset y programa.
- 98 registros unificados en `data/visual-assets`:
  - 63 de Corporacion Universitaria Minuto de Dios.
  - 6 de Fundacion Politecnico Minuto de Dios.
  - 29 de PCI Health.
- 0 rutas locales inexistentes.
- 0 registros duplicados por programa y URL.

## Fuentes historicas no recuperables

Las referencias que permanecen remotas respondieron con `403`, `404` o fallo de conexion y se conservaron para no reemplazarlas por una imagen incorrecta:

- URLs antiguas de `cdn.uploadtourl.com` usadas por PCI Health.
- `GED-Hero.jpg`, `Med-Hybrid-Hero.jpg` y `hero2.jpg` del sitio historico de PCI Health.
- Cinco registros historicos de Supabase/UploadToURL que no estan presentes en programas o landings vigentes.

Las copias locales equivalentes verificables de `Dental-Assistant-Hero.jpg` y `PCI-Medical-Office-Hero-scaled-1-1920x1080.jpg` si se consolidaron.

## Repeticion y recuperacion

- Auditoria sin escritura: `node scripts/consolidate-visual-assets.mjs`
- Aplicar consolidacion: `node scripts/consolidate-visual-assets.mjs --apply`
- Respaldos previos a cada aplicacion: `.tmp/asset-consolidation-backup-*`

El script nunca sobrescribe archivos binarios existentes: usa nombres estables derivados de la fuente y un hash corto.
