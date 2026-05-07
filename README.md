# bunji-landing-engine

Internal landing page generator for Bunji Growth. Create, customize and export landing pages with multi-brand support.

## Getting started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data

- Brands live in `data/brands`.
- Landing page content lives in `data/landings/<brand>`.
- The main editable template is `UamProgramLanding`.

## Useful commands

```bash
npm run lint
npm run build
```

## Export

Open a landing detail page and use **Exportar HTML**, or call:

```text
/api/export/<brand>/<landing>
```
