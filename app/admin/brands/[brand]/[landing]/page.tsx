import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
    landing: string;
  }>;
};

export default async function LegacyAdminLandingPage({ params }: Props) {
  const { brand, landing } = await params;

  redirect(`/admin/brands/${brand}/landings/${landing}`);
}
