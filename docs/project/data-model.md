# EDwin AI data model

This project stores operational data as JSON files under `data/`.

## Folders

- `data/brands`: one JSON file per brand.
- `data/programs/<brand>`: one JSON file per academic program. These files are the source data for landing rendering.
- `data/buyer-person/<brand>`: buyer persona records for a brand.
- `data/visual-assets/<brand>`: brand and program visual asset records.

## Program data conventions

Program JSON files should use the canonical fields below and avoid storing duplicated aliases:

- Use `careerOutcomes` for job opportunities. Do not store `opportunityToWork`.
- Use `studentSupport` for support/accreditation content. Do not store `supportSection`.
- Use `delivery.schedule` instead of top-level `schedule`.
- Use `delivery.modality` instead of `hero.modality` when the value is the same.
- Use `duration.display` instead of `hero.duration` when the value is the same.
- Use `tuition.display` instead of `hero.semesterPrice` or `hero.price` when the value is the same.
- Use `sourceWebsite` for the official/source URL. Only use `programUrl` when it is intentionally different.

`normalizeLandingSchema()` in `lib/data.ts` keeps runtime compatibility by reconstructing the fields that current templates still read. `serializeLandingForStorage()` should be used by write paths so saved JSON remains canonical.
