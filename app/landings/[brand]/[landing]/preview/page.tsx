import { redirect } from "next/navigation";


type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function BrandLandingPreviewPage({ params }: Props) {
  const { brand: brandSlug, landing: landingSlug } = await params;
  redirect(`/landings/${brandSlug}/${landingSlug}`);
}

