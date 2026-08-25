export type AspectRatioType = '3:4' | '4:3' | '1:1' | '9:16' | '16:9' | 'custom';

export type WatermarkPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'center-left' 
  | 'center' 
  | 'center-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'
  | 'custom';

export interface PositionRule {
  position: WatermarkPosition;
  sizePercent: number; // 5% to 50% of image dimension
  marginPercent: number; // 1% to 15% from edges
  opacity: number; // 0.1 to 1.0
  rotation: number; // -180 to 180 degrees
  hasShadow: boolean; // Subtle shadow/outline for visibility
  customXPercent?: number; // 0 to 100 (when position is 'custom')
  customYPercent?: number; // 0 to 100 (when position is 'custom')
}

export type RatioRulesMap = Record<AspectRatioType, PositionRule>;

export interface LogoPreset {
  id: string;
  name: string;
  nameAr: string;
  type: 'svg' | 'preset' | 'custom';
  url: string;
  previewColor?: string;
}

export interface ImageItem {
  id: string;
  file?: File;
  name: string;
  originalUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  detectedRatioType: AspectRatioType;
  ratioLabelAr: string;
  ratioLabelEn: string;
  watermarkedUrl: string | null;
  processedBlob: Blob | null;
  isProcessing: boolean;
  error?: string;
  customRule?: PositionRule; // Individual override
}

export interface ProcessingOptions {
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number; // 0.1 to 1.0
  prefix: string;
  suffix: string;
}
