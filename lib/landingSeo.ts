import type { Metadata } from "next";
import type { Brand, Landing } from "@/lib/data";

function normalizeOriginCandidate(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getPublicSiteOrigin() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeOriginCandidate(candidate);

    if (!normalized) {
      continue;
    }

    try {
      return new URL(normalized);
    } catch {
      continue;
    }
  }

  return undefined;
}

function resolveAbsoluteMetadataUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  const publicOrigin = getPublicSiteOrigin();

  if (!publicOrigin) {
    return undefined;
  }

  return new URL(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, publicOrigin)
    .toString();
}

function getLandingSeoDescription(brand: Brand, landing: Landing) {
  return (
    landing.seo?.metaDescription?.trim() ||
    landing.hero?.description?.trim() ||
    landing.overview?.description?.trim() ||
    brand.description?.trim() ||
    ""
  );
}

function getLandingSeoImage(brand: Brand, landing: Landing) {
  return resolveAbsoluteMetadataUrl(
    landing.hero?.backgroundImage?.trim() ||
      landing.overview?.image?.trim() ||
      brand.imageBrand?.trim() ||
      brand.images?.find((image) => image?.trim()) ||
      "",
  );
}

export function buildLandingMetadata({
  brand,
  landing,
  pathname,
}: {
  brand: Brand;
  landing: Landing;
  pathname?: string;
}): Metadata {
  const title =
    landing.seo?.metaTitle?.trim() || landing.fullTitle || landing.title;
  const description = getLandingSeoDescription(brand, landing);
  const favicon = brand.favicon?.trim() || "";
  const image = getLandingSeoImage(brand, landing);
  const siteOrigin = getPublicSiteOrigin();
  const canonical = pathname && siteOrigin ? new URL(pathname, siteOrigin).toString() : undefined;

  return {
    title,
    description,
    metadataBase: siteOrigin,
    keywords: landing.seo?.keywords?.length
      ? landing.seo.keywords
      : brand.keywords,
    robots: brand.robots || undefined,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    icons: favicon
      ? {
          icon: favicon,
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: brand.siteName?.trim() || brand.name,
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
