/**
 * Client-side image compression for admin uploads.
 *
 * Product photos straight off a phone are routinely 5–10MB at 4000px+,
 * far beyond what a product page needs. Rather than rejecting them, we
 * downscale to web resolution and re-encode as JPEG in the browser, so
 * what travels to the server (and lives in the database as base64) is a
 * few hundred KB.
 */

export interface CompressOptions {
  /** Longest edge after resizing, px. 2000px is ample for a zoomable PDP. */
  maxEdge?: number;
  /** Stop lowering quality once the encoded size is under this. */
  targetBytes?: number;
}

/** Approximate decoded byte size of a data URL. */
export function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(",");
  return Math.floor(((dataUrl.length - i - 1) * 3) / 4);
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap honours EXIF rotation, so phone portraits stay upright.
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* Safari < 15 lacks options support — fall through. */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image"));
    };
    img.src = url;
  });
}

/**
 * Resize + re-encode an image file, returning a JPEG data URL.
 * Throws if the file cannot be decoded as an image.
 */
export async function compressImage(
  file: File,
  { maxEdge = 2000, targetBytes = 1_200_000 }: CompressOptions = {}
): Promise<string> {
  const source = await loadBitmap(file);
  const w = source.width;
  const h = source.height;
  const scale = Math.min(1, maxEdge / Math.max(w, h));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  // JPEG has no alpha — flatten transparent PNGs onto white, not black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  // Step quality down until the encoded size is acceptable.
  let result = "";
  for (const quality of [0.85, 0.75, 0.65, 0.55]) {
    result = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(result) <= targetBytes) break;
  }
  return result;
}
