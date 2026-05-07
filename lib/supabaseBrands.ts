import type { Brand, BrandCertification, LegalLink } from "./data";
import { createAdminClient } from "@/utils/supabase/admin";

type SupabaseBrandRow = {
  slug: string | null;
  name: string | null;
  shortName: string | null;
  logo: string | null;
  logos: Record<string, string> | null;
  typography: Record<string, string> | null;
  primary_color: string | null;
  secondary_color: string | null;
  description: string | null;
  legal_links: LegalLink[] | null;
  certifications: BrandCertification[] | null;
};

function toBrand(brand: SupabaseBrandRow): Brand {
  return {
    slug: brand.slug ?? "",
    name: brand.name ?? "",
    shortName: brand.shortName ?? brand.name ?? "",
    logo: brand.logo ?? "",
    logos: {
      light: brand.logos?.light ?? "",
      dark: brand.logos?.dark ?? "",
    },
    typography: {
      fontFamily: brand.typography?.fontFamily ?? "",
      googleFontHref: brand.typography?.googleFontHref ?? "",
    },
    primaryColor: brand.primary_color ?? "#111827",
    secondaryColor: brand.secondary_color ?? "#F8D74A",
    description: brand.description ?? "",
    legalLinks: brand.legal_links ?? [],
    certifications: (brand.certifications ?? []).map((certification) => ({
      name: certification.name || "",
      url: certification.url || "",
      logos: {
        light: certification.logos?.light || "",
        dark: certification.logos?.dark || "",
      },
    })),
  };
}

export async function getSupabaseBrands(): Promise<Brand[]> {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("brands")
    .select(
      "slug,name,shortName,logo,logos,typography,primary_color,secondary_color,description,legal_links,certifications"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as SupabaseBrandRow[])
    .filter((brand) => brand.slug && brand.name)
    .map(toBrand);
}

export async function getSupabaseBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("brands")
    .select(
      "slug,name,shortName,logo,logos,typography,primary_color,secondary_color,description,legal_links,certifications"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || !data.slug || !data.name) {
    return null;
  }

  return toBrand(data as SupabaseBrandRow);
}
