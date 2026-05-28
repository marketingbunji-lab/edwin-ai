import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type {
  Brand,
  BrandDocumentCategory,
  BrandDocumentCategoryId,
  BrandDocuments,
} from "@/lib/data";

type Params = Promise<{
  brand: string;
}>;

type DocumentsPayload = Partial<
  Record<
    BrandDocumentCategoryId,
    {
      mode?: "file" | "link";
      fileName?: string;
      fileUrl?: string;
      link?: string;
    }
  >
>;

const brandDocumentCategoryIds: BrandDocumentCategoryId[] = [
  "legal",
  "catalogs",
  "brandBook",
  "curriculum",
];

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDocuments(documents: Brand["documents"] | undefined) {
  const normalized: BrandDocuments = {};

  for (const categoryId of brandDocumentCategoryIds) {
    const document = documents?.[categoryId];

    if (!document) {
      continue;
    }

    const mode = document.mode === "link" ? "link" : "file";
    const fileName = (document.fileName || "").trim();
    const fileUrl = (document.fileUrl || "").trim();
    const link = (document.link || "").trim();

    if (!fileName && !fileUrl && !link) {
      continue;
    }

    normalized[categoryId] = {
      mode,
      fileName,
      fileUrl,
      link,
      updatedAt: document.updatedAt || "",
    };
  }

  return normalized;
}

function parseDocumentsPayload(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as DocumentsPayload;
  } catch {
    return null;
  }
}

function isPdfFile(file: File) {
  const mimeType = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return mimeType === "application/pdf" || name.endsWith(".pdf");
}

async function persistDocumentFile(
  brandSlug: string,
  categoryId: BrandDocumentCategoryId,
  file: File,
) {
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "brands",
    brandSlug,
    "documents",
    categoryId,
  );

  fs.mkdirSync(uploadDir, { recursive: true });

  const originalExtension = path.extname(file.name) || ".pdf";
  const baseName = path.basename(file.name, originalExtension);
  const safeBaseName = slugifySegment(baseName) || categoryId;
  const fileName = `${Date.now()}-${safeBaseName}${originalExtension.toLowerCase()}`;
  const absoluteFilePath = path.join(uploadDir, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(absoluteFilePath, fileBuffer);

  return {
    fileName: file.name,
    fileUrl: `/uploads/brands/${brandSlug}/documents/${categoryId}/${fileName}`,
  };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { brand: brandSlug } = await params;
    const brandFilePath = path.join(
      process.cwd(),
      "data",
      "brands",
      `${brandSlug}.json`,
    );

    if (!fs.existsSync(brandFilePath)) {
      return NextResponse.json(
        { ok: false, error: "Brand not found" },
        { status: 404 },
      );
    }

    const currentBrand = JSON.parse(
      fs.readFileSync(brandFilePath, "utf8"),
    ) as Brand;
    const currentDocuments = normalizeDocuments(currentBrand.documents);
    const formData = await request.formData();
    const payload = parseDocumentsPayload(formData.get("documents"));

    if (!payload) {
      return NextResponse.json(
        { ok: false, error: "Invalid documents payload" },
        { status: 400 },
      );
    }

    const nextDocuments: BrandDocuments = {};

    for (const categoryId of brandDocumentCategoryIds) {
      const nextInput = payload[categoryId];
      const currentDocument = currentDocuments[categoryId];

      if (!nextInput && !currentDocument) {
        continue;
      }

      const mode = nextInput?.mode === "link" ? "link" : "file";
      const nextDocument: BrandDocumentCategory = {
        mode,
        updatedAt: new Date().toISOString(),
      };

      if (mode === "link") {
        nextDocument.link = (nextInput?.link || "").trim();
        nextDocument.fileName = "";
        nextDocument.fileUrl = "";
      } else {
        const uploadedFile = formData.get(`${categoryId}File`);

        if (uploadedFile instanceof File && uploadedFile.size > 0) {
          if (!isPdfFile(uploadedFile)) {
            return NextResponse.json(
              { ok: false, error: "Only PDF files are allowed" },
              { status: 400 },
            );
          }

          const persistedFile = await persistDocumentFile(
            brandSlug,
            categoryId,
            uploadedFile,
          );

          nextDocument.fileName = persistedFile.fileName;
          nextDocument.fileUrl = persistedFile.fileUrl;
        } else {
          nextDocument.fileName = (nextInput?.fileName || "").trim();
          nextDocument.fileUrl = (nextInput?.fileUrl || "").trim();
        }

        nextDocument.link = "";
      }

      const hasContent = Boolean(
        nextDocument.link || nextDocument.fileName || nextDocument.fileUrl,
      );

      if (hasContent) {
        nextDocuments[categoryId] = nextDocument;
      }
    }

    const brandBookDocument = nextDocuments.brandBook;
    const nextIdentityManual =
      brandBookDocument?.mode === "link"
        ? (brandBookDocument.link || "").trim()
        : (brandBookDocument?.fileUrl || "").trim();

    const nextBrand: Brand = {
      ...currentBrand,
      documents: nextDocuments,
      identityManual: nextIdentityManual,
    };

    fs.writeFileSync(brandFilePath, JSON.stringify(nextBrand, null, 2), "utf8");

    revalidatePath(`/brands/${brandSlug}/documents`);
    revalidatePath(`/admin/brands/${brandSlug}/documents`);
    revalidatePath(`/brands/${brandSlug}/edit`);
    revalidatePath(`/admin/brands/${brandSlug}/edit`);

    return NextResponse.json({
      ok: true,
      documents: nextDocuments,
      identityManual: nextIdentityManual,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "The documents could not be saved" },
      { status: 500 },
    );
  }
}
