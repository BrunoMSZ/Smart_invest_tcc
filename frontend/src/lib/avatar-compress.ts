
const MAX_SIDE = 192;
const MAX_CHARS = 100_000;

type CompressOptions = { maxSide?: number; maxChars?: number };

function canvasCompress(img: HTMLImageElement, options?: CompressOptions): string {
  const maxSide = options?.maxSide ?? MAX_SIDE;
  const maxChars = options?.maxChars ?? MAX_CHARS;
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  let quality = 0.72;
  let compressed = canvas.toDataURL("image/jpeg", quality);
  while (compressed.length > maxChars && quality > 0.28) {
    quality -= 0.08;
    compressed = canvas.toDataURL("image/jpeg", quality);
  }
  if (compressed.length > maxChars) {
    canvas.width = Math.max(1, Math.round(canvas.width * 0.7));
    canvas.height = Math.max(1, Math.round(canvas.height * 0.7));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    compressed = canvas.toDataURL("image/jpeg", 0.55);
  }
  return compressed;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

export async function compressImageFile(file: File, options?: CompressOptions): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Falha ao ler imagem"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
  try {
    const img = await loadImage(dataUrl);
    return canvasCompress(img, options) || dataUrl;
  } catch {
    return dataUrl;
  }
}

export async function recompressDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith("data:image")) return dataUrl;
  if (dataUrl.length <= MAX_CHARS) return dataUrl;
  try {
    const img = await loadImage(dataUrl);
    const out = canvasCompress(img);
    return out || dataUrl;
  } catch {
    return dataUrl;
  }
}

export const AVATAR_SOFT_LIMIT = MAX_CHARS;
