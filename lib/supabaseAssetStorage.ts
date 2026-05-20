import path from "node:path";
import { createAdminClient } from "@/utils/supabase/admin";

export const AI_ASSETS_BUCKET = "edwin-ai-assets";

type UploadContext = {
  brandSlug?: string;
  category?: string;
  programId?: string;
  assetName?: string;
};

function slugifySegment(value?: string) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function getFileExtension(contentType: string, sourceUrl: string) {
  const normalizedType = contentType.split(";")[0].trim().toLowerCase();

  if (normalizedType === "image/png") return "png";
  if (normalizedType === "image/jpeg") return "jpg";
  if (normalizedType === "image/webp") return "webp";
  if (normalizedType === "image/gif") return "gif";
  if (normalizedType === "image/svg+xml") return "svg";
  if (normalizedType === "image/avif") return "avif";

  try {
    const pathname = new URL(sourceUrl).pathname;
    const extension = path.extname(pathname).replace(".", "").toLowerCase();

    if (extension) {
      return extension;
    }
  } catch {
    return "png";
  }

  return "png";
}

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/i);

  if (!match) {
    return null;
  }

  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function buildStoragePath(sourceUrl: string, context: UploadContext, contentType: string) {
  const brandSlug = slugifySegment(context.brandSlug) || "shared";
  const category = slugifySegment(context.category) || "generated";
  const programId = slugifySegment(context.programId) || "brand";
  const assetName = slugifySegment(context.assetName) || "asset";
  const extension = getFileExtension(contentType, sourceUrl);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `${brandSlug}/${category}/${programId}/${assetName}-${timestamp}.${extension}`;
}

async function ensureBucketExists() {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("No se pudo inicializar el cliente admin de Supabase.");
  }

  const { data: bucket } = await supabase.storage.getBucket(AI_ASSETS_BUCKET);

  if (bucket) {
    return supabase;
  }

  const { error } = await supabase.storage.createBucket(AI_ASSETS_BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ],
  });

  if (error && !`${error.message}`.toLowerCase().includes("already exists")) {
    throw error;
  }

  return supabase;
}

export async function uploadRemoteImageToSupabase(
  sourceUrl: string,
  context: UploadContext,
) {
  const supabase = await ensureBucketExists();
  let contentType = "";
  let buffer = Buffer.alloc(0);

  if (sourceUrl.startsWith("data:image/")) {
    const decoded = decodeDataUrl(sourceUrl);

    if (!decoded) {
      throw new Error("No se pudo decodificar el data URL de la imagen.");
    }

    contentType = decoded.contentType;
    buffer = decoded.buffer;
  } else {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`No se pudo descargar la imagen remota: ${response.status}`);
    }

    contentType = response.headers.get("content-type") || "";

    if (!contentType.toLowerCase().startsWith("image/")) {
      throw new Error("La URL remota no devolvio una imagen valida.");
    }

    buffer = Buffer.from(await response.arrayBuffer());
  }

  const storagePath = buildStoragePath(sourceUrl, context, contentType);
  const { error: uploadError } = await supabase.storage
    .from(AI_ASSETS_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AI_ASSETS_BUCKET).getPublicUrl(storagePath);

  return {
    bucket: AI_ASSETS_BUCKET,
    path: storagePath,
    publicUrl,
  };
}

export async function persistVisualAssetResponseImages<T>(
  payload: T,
  context: UploadContext,
) {
  const cache = new Map<string, string>();

  async function visit(value: unknown): Promise<unknown> {
    if (Array.isArray(value)) {
      return Promise.all(value.map((item) => visit(item)));
    }

    if (!value || typeof value !== "object") {
      return value;
    }

    const record = value as Record<string, unknown>;
    const nextRecord: Record<string, unknown> = {};

    for (const [key, currentValue] of Object.entries(record)) {
      if (
        (key === "url" || key === "imageUrl") &&
        typeof currentValue === "string" &&
        currentValue.startsWith("http")
      ) {
        if (cache.has(currentValue)) {
          nextRecord[key] = cache.get(currentValue);
          continue;
        }

        try {
          const upload = await uploadRemoteImageToSupabase(currentValue, context);
          cache.set(currentValue, upload.publicUrl);
          nextRecord[key] = upload.publicUrl;
        } catch {
          nextRecord[key] = currentValue;
        }

        continue;
      }

      nextRecord[key] = await visit(currentValue);
    }

    return nextRecord;
  }

  return (await visit(payload)) as T;
}
