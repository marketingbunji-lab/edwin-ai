import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  createBrandAgentRecord,
  isSafeBrandAgentSlug,
  isVisualAssetCategory,
} from "@/lib/brandAgentRecords";
import { requireAuthenticatedUser } from "@/lib/serverAuth";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const unauthorized = await requireAuthenticatedUser();

    if (unauthorized) return unauthorized;

    const formData = await request.formData();
    const file = formData.get("file");
    const brandSlug = String(formData.get("brandSlug") || "");
    const category = String(formData.get("category") || "");
    const programId = String(formData.get("programId") || "");
    const programName = String(formData.get("programName") || "");
    const assetCategory = String(formData.get("assetCategory") || "");

    if (!isSafeBrandAgentSlug(brandSlug) || !isVisualAssetCategory(category)) {
      return NextResponse.json(
        { ok: false, error: "La universidad o la categoria no son validas" },
        { status: 400 },
      );
    }

    if (category === "programs-assets" && !isSafeBrandAgentSlug(programId)) {
      return NextResponse.json(
        { ok: false, error: "Selecciona un programa valido" },
        { status: 400 },
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "Selecciona una imagen" },
        { status: 400 },
      );
    }

    const extension = imageExtensions[file.type];

    if (!extension) {
      return NextResponse.json(
        { ok: false, error: "Formato no permitido. Usa PNG, JPG, WEBP, GIF o AVIF" },
        { status: 415 },
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "La imagen no puede superar los 10 MB" },
        { status: 413 },
      );
    }

    const originalName = path.parse(file.name).name;
    const assetName = originalName.trim() || "Asset cargado";
    const safeName = slugify(originalName) || "asset";
    const destinationProgram =
      category === "programs-assets" ? programId : "brand";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const relativePath = path.posix.join(
      "generated-assets",
      brandSlug,
      category,
      destinationProgram,
      `${safeName}-${timestamp}.${extension}`,
    );
    const absolutePath = path.join(
      process.cwd(),
      "public",
      ...relativePath.split("/"),
    );

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()), {
      flag: "wx",
    });

    const record = createBrandAgentRecord(brandSlug, "visual-assets", {
      category,
      assetCategory,
      programId,
      programName,
      name: assetName,
      assetType: "Image",
      url: `/${relativePath}`,
      notes: "Asset cargado desde el computador.",
    });

    if (!record) {
      await unlink(absolutePath);
      return NextResponse.json(
        { ok: false, error: "No se pudo registrar el visual asset" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar el visual asset",
      },
      { status: 500 },
    );
  }
}
