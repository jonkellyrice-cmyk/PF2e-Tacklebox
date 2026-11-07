const SIZE = 128;

// Allow a little distortion; preserve the silhouette of strongly rectangular art.
export function fit(width, height) {
  if (!(width > 0 && height > 0)) throw new Error("Invalid image dimensions");
  if (Math.max(width, height) / Math.min(width, height) <= 1.2) {
    return [0, 0, SIZE, SIZE];
  }
  const scale = SIZE / Math.max(width, height);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  return [Math.floor((SIZE - w) / 2), Math.floor((SIZE - h) / 2), w, h];
}

export async function thumbnail(path) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = path;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, ...fit(image.naturalWidth, image.naturalHeight));
  return canvas.toDataURL("image/webp", 0.9);
}
