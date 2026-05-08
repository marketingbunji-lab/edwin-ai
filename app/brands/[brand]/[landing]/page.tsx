import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function LegacyLandingDetailPage({ params }: Props) {
  const { brand, landing } = await params;

  redirect(`/brands/${brand}/landings/${landing}`);
}
