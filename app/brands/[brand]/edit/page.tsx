import { notFound } from "next/navigation";
import BrandEditor from "../../../../components/editor/BrandEditor";
import { getBrandBySlug } from "../../../../lib/data";
import { getSupabaseBrandBySlug } from "../../../../lib/supabaseBrands";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function EditBrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug) ?? (await getSupabaseBrandBySlug(brandSlug));

  if (!brand) {
    notFound();
  }

  return (
    <main className="admin-page">
      <div className="admin-page-inner">
        <div className="mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">{brand.name} | <strong className="text-sm text-black dark:text-white">Editar marca</strong></p>
          </div>
        </div>

        <BrandEditor
          mode="edit"
          initialBrand={brand}
          stickyActions
          backHref={`/admin/brands/${brandSlug}`}
          backLabel="Volver a marca"
        />
      </div>
    </main>
  );
}
