import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

type BucketSummary = {
  count: number;
  redTotal: number;
  greenTotal: number;
  blueTotal: number;
};

function componentToHex(value: number) {
  return value.toString(16).padStart(2, "0");
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
}

function quantizeChannel(value: number) {
  return Math.min(7, Math.floor(value / 32));
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = (await request.json()) as { imageUrl?: string };

    if (!imageUrl) {
      return NextResponse.json(
        { error: "La URL de la imagen es obligatoria." },
        { status: 400 }
      );
    }

    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "bunji-landing-engine/1.0",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "No se pudo descargar la imagen." },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const { data, info } = await sharp(imageBuffer)
      .resize(80, 80, { fit: "inside", withoutEnlargement: true })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const buckets = new Map<string, BucketSummary>();

    for (let index = 0; index < data.length; index += info.channels) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const bucketKey = `${quantizeChannel(red)}-${quantizeChannel(green)}-${quantizeChannel(blue)}`;
      const bucket = buckets.get(bucketKey) ?? {
        count: 0,
        redTotal: 0,
        greenTotal: 0,
        blueTotal: 0,
      };

      bucket.count += 1;
      bucket.redTotal += red;
      bucket.greenTotal += green;
      bucket.blueTotal += blue;

      buckets.set(bucketKey, bucket);
    }

    const dominantBucket = [...buckets.values()].sort(
      (left, right) => right.count - left.count
    )[0];

    if (!dominantBucket) {
      return NextResponse.json(
        { error: "No se pudo calcular un color dominante." },
        { status: 500 }
      );
    }

    const red = Math.round(dominantBucket.redTotal / dominantBucket.count);
    const green = Math.round(dominantBucket.greenTotal / dominantBucket.count);
    const blue = Math.round(dominantBucket.blueTotal / dominantBucket.count);

    return NextResponse.json({
      imageUrl,
      rgb: { red, green, blue },
      hex: rgbToHex(red, green, blue),
      sampleSize: {
        width: info.width,
        height: info.height,
      },
    });
  } catch (error) {
    console.error("IMAGE COLOR ANALYSIS ERROR:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al analizar la imagen." },
      { status: 500 }
    );
  }
}
