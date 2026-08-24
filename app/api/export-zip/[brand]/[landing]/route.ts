import { NextResponse } from "next/server";
import {
  getBrandBySlug,
  getLandingBySlug,
  type Landing,
} from "../../../../../lib/data";
import { exportLandingZip } from "../../../../../lib/exportLandingZip";

type Params = Promise<{
  brand: string;
  landing: string;
}>;

async function resolveLanding(
  request: Request,
  brandSlug: string,
  landingSlug: string,
) {
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    return { brand: null, landing: null };
  }

  if (request.method === "POST") {
    const landing = (await request.json()) as Landing;
    return { brand, landing };
  }

  const landing = getLandingBySlug(brandSlug, landingSlug);
  return { brand, landing };
}

async function handleExport(request: Request, params: Params) {
  try {
    const { brand: brandSlug, landing: landingSlug } = await params;
    const { brand, landing } = await resolveLanding(
      request,
      brandSlug,
      landingSlug,
    );

    if (!brand || !landing) {
      return new NextResponse("Landing no encontrada", { status: 404 });
    }

    const zip = await exportLandingZip(brand, landing);
    const filename = `${brandSlug}-${landingSlug}.zip`;

    return new NextResponse(zip, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("EXPORT ZIP ERROR:", error);
    const message =
      error instanceof Error ? error.stack || error.message : String(error);

    return new NextResponse(
      process.env.NODE_ENV === "production"
        ? "Error al exportar ZIP"
        : `Error al exportar ZIP\n${message}`,
      { status: 500 },
    );
  }
}

export async function GET(request: Request, { params }: { params: Params }) {
  return handleExport(request, params);
}

export async function POST(request: Request, { params }: { params: Params }) {
  return handleExport(request, params);
}
