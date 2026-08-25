import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AspectRatioType, PositionRule, RatioRulesMap, ImageItem, ProcessingOptions } from '../types';
import { RATIO_INFO } from '../data/presets';

/**
 * Accurately detects aspect ratio type based on image dimensions
 */
export function detectAspectRatio(width: number, height: number): {
  ratioType: AspectRatioType;
  ratio: number;
  labelAr: string;
  labelEn: string;
} {
  if (!width || !height) {
    return { ratioType: 'custom', ratio: 1, labelAr: 'مخصص', labelEn: 'Custom' };
  }

  const ratio = width / height;

  // Tolerance check
  if (Math.abs(ratio - 0.75) <= 0.08) {
    return { ratioType: '3:4', ratio, labelAr: RATIO_INFO['3:4'].labelAr, labelEn: RATIO_INFO['3:4'].labelEn };
  }
  if (Math.abs(ratio - 1.333) <= 0.10) {
    return { ratioType: '4:3', ratio, labelAr: RATIO_INFO['4:3'].labelAr, labelEn: RATIO_INFO['4:3'].labelEn };
  }
  if (Math.abs(ratio - 1.0) <= 0.08) {
    return { ratioType: '1:1', ratio, labelAr: RATIO_INFO['1:1'].labelAr, labelEn: RATIO_INFO['1:1'].labelEn };
  }
  if (Math.abs(ratio - 0.5625) <= 0.07) {
    return { ratioType: '9:16', ratio, labelAr: RATIO_INFO['9:16'].labelAr, labelEn: RATIO_INFO['9:16'].labelEn };
  }
  if (Math.abs(ratio - 1.777) <= 0.12) {
    return { ratioType: '16:9', ratio, labelAr: RATIO_INFO['16:9'].labelAr, labelEn: RATIO_INFO['16:9'].labelEn };
  }

  // Fallbacks for general orientations
  if (ratio < 0.85) {
    return { ratioType: '3:4', ratio, labelAr: 'طولي (عمودي قسيم لـ 3:4)', labelEn: 'Portrait (~3:4)' };
  }
  if (ratio > 1.2) {
    return { ratioType: '4:3', ratio, labelAr: 'عرضي (أفقي قسيم لـ 4:3)', labelEn: 'Landscape (~4:3)' };
  }

  return { ratioType: 'custom', ratio, labelAr: RATIO_INFO['custom'].labelAr, labelEn: RATIO_INFO['custom'].labelEn };
}

/**
 * Loads an HTMLImageElement from a URL or DataURI safely
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${err}`));
    img.src = src;
  });
}

/**
 * Calculates (x, y, width, height) for the watermark placement
 */
export function calculateWatermarkBounds(
  imageWidth: number,
  imageHeight: number,
  logoNaturalWidth: number,
  logoNaturalHeight: number,
  rule: PositionRule
): { x: number; y: number; width: number; height: number } {
  const logoAspect = logoNaturalWidth / (logoNaturalHeight || 1);
  
  // Base watermark width on image width, scaled by sizePercent
  const targetWmWidth = Math.max(20, imageWidth * (rule.sizePercent / 100));
  const targetWmHeight = targetWmWidth / logoAspect;

  const marginX = imageWidth * (rule.marginPercent / 100);
  const marginY = imageHeight * (rule.marginPercent / 100);

  let x = 0;
  let y = 0;

  switch (rule.position) {
    case 'top-left':
      x = marginX;
      y = marginY;
      break;
    case 'top-center':
      x = (imageWidth - targetWmWidth) / 2;
      y = marginY;
      break;
    case 'top-right':
      x = imageWidth - targetWmWidth - marginX;
      y = marginY;
      break;
    case 'center-left':
      x = marginX;
      y = (imageHeight - targetWmHeight) / 2;
      break;
    case 'center':
      x = (imageWidth - targetWmWidth) / 2;
      y = (imageHeight - targetWmHeight) / 2;
      break;
    case 'center-right':
      x = imageWidth - targetWmWidth - marginX;
      y = (imageHeight - targetWmHeight) / 2;
      break;
    case 'bottom-left':
      x = marginX;
      y = imageHeight - targetWmHeight - marginY;
      break;
    case 'bottom-center':
      x = (imageWidth - targetWmWidth) / 2;
      y = imageHeight - targetWmHeight - marginY;
      break;
    case 'bottom-right':
      x = imageWidth - targetWmWidth - marginX;
      y = imageHeight - targetWmHeight - marginY;
      break;
    case 'custom':
      x = (imageWidth - targetWmWidth) * ((rule.customXPercent ?? 50) / 100);
      y = (imageHeight - targetWmHeight) * ((rule.customYPercent ?? 50) / 100);
      break;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(targetWmWidth),
    height: Math.round(targetWmHeight)
  };
}

/**
 * Applies watermark to an image and returns a high-resolution Blob and Object URL
 */
export async function applyWatermarkToImage(
  imageSrc: string,
  logoSrc: string,
  rule: PositionRule,
  options: Partial<ProcessingOptions> = {}
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  const [sourceImg, logoImg] = await Promise.all([
    loadImage(imageSrc),
    loadImage(logoSrc)
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = sourceImg.naturalWidth || sourceImg.width;
  canvas.height = sourceImg.naturalHeight || sourceImg.height;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Could not get canvas 2D context');
  }

  // Draw source image cleanly
  ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);

  // Calculate watermark positioning
  const bounds = calculateWatermarkBounds(
    canvas.width,
    canvas.height,
    logoImg.naturalWidth || logoImg.width,
    logoImg.naturalHeight || logoImg.height,
    rule
  );

  ctx.save();

  // Opacity
  ctx.globalAlpha = Math.max(0.05, Math.min(1.0, rule.opacity));

  // Shadow / Glow for high contrast on light or dark background
  if (rule.hasShadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.max(3, bounds.width * 0.035);
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
  }

  // Rotation
  if (rule.rotation && rule.rotation !== 0) {
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rule.rotation * Math.PI) / 180);
    ctx.drawImage(logoImg, -bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
  } else {
    ctx.drawImage(logoImg, bounds.x, bounds.y, bounds.width, bounds.height);
  }

  ctx.restore();

  const format = options.outputFormat || 'image/jpeg';
  const quality = options.quality ?? 0.95;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width: canvas.width, height: canvas.height });
      },
      format,
      quality
    );
  });
}

/**
 * Downloads a single image blob with a clear filename
 */
export function downloadSingleImage(blob: Blob, originalName: string, prefix = 'watermarked_') {
  const extension = blob.type === 'image/png' ? '.png' : blob.type === 'image/webp' ? '.webp' : '.jpg';
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const fileName = `${prefix}${baseName}${extension}`;
  saveAs(blob, fileName);
}

/**
 * Bundles all watermarked images into a single ZIP file and initiates download
 */
export async function downloadAllImagesAsZip(
  items: ImageItem[],
  zipFilename = 'watermarked-images.zip',
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('watermarked_images') || zip;

  let addedCount = 0;
  const total = items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.processedBlob) {
      const ext = item.processedBlob.type === 'image/png' ? 'png' : 'jpg';
      const cleanName = item.name.replace(/\.[^/.]+$/, "");
      const fileName = `${String(i + 1).padStart(2, '0')}_${cleanName}.${ext}`;
      folder.file(fileName, item.processedBlob);
      addedCount++;
    }
    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 50));
    }
  }

  if (addedCount === 0) {
    throw new Error('No processed images found to download');
  }

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) {
        onProgress(50 + Math.round(metadata.percent * 0.5));
      }
    }
  );

  saveAs(content, zipFilename);
}
