import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProgramsList from "@/components/programs/ProgramsList";
import { getBrandBySlug, getProgramsByBrand } from "@/lib/data";
import { getSupabaseBrandBySlug } from "@/lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function BrandProgramsPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand =
    getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  const programs = getProgramsByBrand(brand.slug);

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <Link
          href={`/admin/brands/${brand.slug}`}
          className="admin-button-secondary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a marca
        </Link>

        <ProgramsList brand={brand} programs={programs} />
      </div>
    </main>
  );
}
