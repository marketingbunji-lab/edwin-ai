import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function LegacyNewLandingPage({ params }: Props) {
  const { brand } = await params;

  redirect(`/admin/brands/${brand}/landings/new`);
}
