import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Landing } from "../../../../../../lib/data";

type Params = Promise<{
  brand: string;
  landing: string;
}>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAvailableSlug(folder: string, baseSlug: string) {
  let index = 1;
  let nextSlug = `${baseSlug}-copia`;

  while (fs.existsSync(path.join(folder, `${nextSlug}.json`))) {
    index += 1;
    nextSlug = `${baseSlug}-copia-${index}`;
  }

  return nextSlug;
}

export async function POST(_: Request, { params }: { params: Params }) {
  try {
    const { brand, landing } = await params;

    const brandFolder = path.join(process.cwd(), "data", "landings", brand);
    const sourcePath = path.join(brandFolder, `${landing}.json`);

    if (!fs.existsSync(sourcePath)) {
      return NextResponse.json(
        { ok: false, error: "Landing no encontrada" },
        { status: 404 }
      );
    }

    const source = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as Landing;
    const title = `${source.title} copia`;
    const fullTitle = `${source.fullTitle} copia`;
    const baseSlug = slugify(title || `${source.slug}-copia`);
    const nextSlug = getAvailableSlug(brandFolder, baseSlug);
    const nextLanding: Landing = {
      ...source,
      slug: nextSlug,
      title,
      fullTitle,
      status: "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const targetPath = path.join(brandFolder, `${nextSlug}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(nextLanding, null, 2), "utf8");

    return NextResponse.json({
      ok: true,
      slug: nextSlug,
      redirectTo: `/admin/brands/${brand}/${nextSlug}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo duplicar la landing" },
      { status: 500 }
    );
  }
}
