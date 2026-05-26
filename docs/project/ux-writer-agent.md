# UX Writer Agent

The platform now includes a reusable UX Writer agent scaffold focused on **dashboard UI copy only**.

It is designed for:

- university marketing teams
- admissions and enrollment teams
- content teams
- academic and institutional staff

It should **never** rewrite:

- brand names
- university names
- program names
- institutional descriptions stored in the data
- academic content owned by each institution

## Files

- `lib/agents/uxWriterAgent.ts`
  - section catalog
  - prompt builder
  - payload builder
  - route-to-section resolution
- `lib/agents/uxWriterAgentClient.ts`
  - browser-side helper for calling the agent
- `app/api/ux-writer-agent/route.ts`
  - `GET`: inspect available sections and selected copy
  - `POST`: generate payload or call an external webhook

## Default behavior

If `UX_WRITER_AGENT_WEBHOOK_URL` is **not** configured, the API returns a `dryRun` payload so the team can:

- inspect the prompt
- inspect the selected sections
- wire the agent to n8n or another orchestration layer later

If `UX_WRITER_AGENT_WEBHOOK_URL` **is** configured, the route will forward the payload to that webhook when `dryRun: false`.

## Example: inspect copy catalog

`GET /api/ux-writer-agent`

Example with filters:

`GET /api/ux-writer-agent?sectionId=shell&sectionId=brandEditor`

## Example: dry run review

```json
POST /api/ux-writer-agent
{
  "sectionIds": ["shell", "brandEditor", "programDataEditor"],
  "language": "both",
  "contextNotes": "Focus on guided language for admissions and academic teams."
}
```

## Example: review a route with custom copy

```json
POST /api/ux-writer-agent
{
  "route": "/brands/fundacion-politecnico-minuto-de-dios/knowledge-base",
  "language": "both",
  "customSections": [
    {
      "id": "knowledgeBasePage",
      "title": "Knowledge Base Page",
      "summary": "Top bar and workflow cards shown on the knowledge base page.",
      "routeHints": ["/brands/[brand]/knowledge-base"],
      "entries": [
        {
          "key": "knowledgeBase.header.title",
          "kind": "page_title",
          "current": {
            "en": "Knowledge Base",
            "es": "Knowledge Base"
          }
        }
      ]
    }
  ]
}
```

## Intended output

The agent should return:

- a short summary
- proposed rewrites
- rationale for each change
- bilingual UI wording
- global tone and terminology guidance

This makes it possible to reuse the same agent across:

- dashboard shell
- brand setup
- programs
- knowledge base
- journey
- buyer persona
- landing management
- future dashboard modules
