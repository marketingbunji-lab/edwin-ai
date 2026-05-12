import {
  getBrandBySlug,
  getBrands,
  getLandingsByBrand,
  type Brand,
  type Landing,
} from "@/lib/data";

type LandingLookupResult = {
  brand: Brand;
  landing: Landing;
};

function slugFromUrl(value?: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);

    return segments.at(-1) ?? "";
  } catch {
    const segments = value.split("/").filter(Boolean);

    return segments.at(-1) ?? "";
  }
}

function matchesLanding(landing: Landing, landingSlug: string) {
  return [
    landing.slug,
    slugFromUrl(landing.sourceWebsite),
    slugFromUrl(landing.programUrl),
  ].some((alias) => alias === landingSlug);
}

export function findLandingBySlugOrAlias(
  landingSlug: string,
): LandingLookupResult | null {
  for (const brandSummary of getBrands()) {
    const landing = getLandingsByBrand(brandSummary.slug).find((item) =>
      matchesLanding(item, landingSlug),
    );

    if (landing) {
      const brand = getBrandBySlug(brandSummary.slug);

      if (!brand) {
        return null;
      }

      return { brand, landing };
    }
  }

  return null;
}
