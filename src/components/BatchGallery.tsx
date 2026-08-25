import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  Filter,
  Maximize2,
  Smartphone,
  Square,
  Film,
  Tv,
  Loader2
} from 'lucide-react';
import { ImageItem, AspectRatioType } from '../types';
import { downloadSingleImage } from '../utils/watermarkEngine';

interface BatchGalleryProps {
  images: ImageItem[];
  onRemoveImage: (id: string) => void;
  onEditImage: (image: ImageItem) => void;
  onDownloadAllZip: () => void;
  isProcessing: boolean;
  lang: 'ar' | 'en';
}

export const BatchGallery: React.FC<BatchGalleryProps> = ({
  images,
  onRemoveImage,
  onEditImage,
  onDownloadAllZip,
  isProcessing,
  lang
}) => {
  const isAr = lang === 'ar';
  const [filterRatio, setFilterRatio] = useState<string>('all');
  const [previewModalImg, setPreviewModalImg] = useState<ImageItem | null>(null);

  if (images.length === 0) {
    return null;
  }

  const filteredImages = filterRatio === 'all' 
    ? images 
    : images.filter(img => img.detectedRatioType === filterRatio);

  const getRatioBadge = (type: AspectRatioType) => {
    switch (type) {
      case '3:4':
        return {
          bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          icon: <Smartphone className="w-3 h-3" />,
          label: isAr ? '3:4 (طولي)' : '3:4 Portrait'
        };
      case '4:3':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Maximize2 className="w-3 h-3" />,
          label: isAr ? '4:3 (عرضي)' : '4:3 Landscape'
        };
      case '1:1':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <Square className="w-3 h-3" />,
          label: isAr ? '1:1 (مربع)' : '1:1 Square'
        };
      case '9:16':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <Film className="w-3 h-3" />,
          label: isAr ? '9:16 (ستوري)' : '9:16 Story'
        };
      case '16:9':
        return {
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: <Tv className="w-3 h-3" />,
          label: isAr ? '16:9 (عريض)' : '16:9 Widescreen'
        };
      default:
        return {
          bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
          icon: <Layers className="w-3 h-3" />,
          label: isAr ? 'أبعاد مخصصة' : 'Custom Ratio'
        };
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {isAr ? '4. معرض الصور المجهزة بالشعار' : '4. Processed Photos Gallery'}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                {images.length} {isAr ? 'صورة' : 'photos'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {isAr 
              ? 'تم تطبيق الشعار على كل صورة حسب أبعادها تلقائياً. يمكنك تنزيل صورة واحدة أو تنزيل الكل بملف ZIP واحد'
              : 'Watermarks automatically aligned based on aspect ratio. Download individually or as ZIP bundle'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setFilterRatio('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterRatio === 'all'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({images.length})
          </button>
          <button
            onClick={() => setFilterRatio('3:4')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              filterRatio === '3:4'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>3:4</span>
          </button>
          <button
            onClick={() => setFilterRatio('4:3')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              filterRatio === '4:3'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span>4:3</span>
          </button>
          <button
            onClick={() => setFilterRatio('1:1')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              filterRatio === '1:1'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Square className="w-3 h-3" />
            <span>1:1</span>
          </button>
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((img, index) => {
          const badge = getRatioBadge(img.detectedRatioType);
          const displayUrl = img.watermarkedUrl || img.originalUrl;

          return (
            <div
              key={img.id}
              className="group bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all flex flex-col overflow-hidden shadow-lg"
            >
              {/* Image Preview Container */}
              <div 
                onClick={() => setPreviewModalImg(img)}
                className="relative aspect-4/3 w-full bg-black/60 flex items-center justify-center overflow-hidden cursor-pointer group-hover:opacity-95"
              >
                {img.isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-blue-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs">{isAr ? 'جاري وضع الشعار...' : 'Processing...'}</span>
                  </div>
                ) : (
                  <img
                    src={displayUrl}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Aspect ratio badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md shadow-sm ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Index tag */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/80 text-white/80 border border-white/10 text-[10px] font-mono backdrop-blur-sm">
                    #{index + 1}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-black/90 text-white text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.8)] border border-white/20">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'تكبير وعرض' : 'Click to Zoom'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Info & Action Bar */}
              <div className="p-3.5 bg-black/40 flex flex-col gap-2.5 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90 truncate max-w-[170px]" title={img.name}>
                    {img.name}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">
                    {img.width}x{img.height}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                  {/* Fine-tune position button */}
                  <button
                    onClick={() => onEditImage(img)}
                    className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 hover:border-blue-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title={isAr ? 'تعديل مكان الشعار لهذه الصورة فقط' : 'Fine-tune position'}
                  >
                    <Edit3 className="w-3 h-3 text-blue-400" />
                    <span className="text-[11px]">{isAr ? 'تخصيص' : 'Edit'}</span>
                  </button>

                  {/* Single Download button */}
                  {img.processedBlob && (
                    <button
                      onClick={() => downloadSingleImage(img.processedBlob!, img.name)}
                      className="py-1.5 px-3 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(37,99,235,0.3)] cursor-pointer"
                      title={isAr ? 'تنزيل هذه الصورة بالشعار بدقة عالية' : 'Download with watermark'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                    title={isAr ? 'حذف الصورة' : 'Remove image'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewModalImg && (
        <div 
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-black/95 border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
          >
            <div className="p-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{previewModalImg.name}</span>
                <span className="text-[11px] text-white/50">({previewModalImg.width}x{previewModalImg.height} px)</span>
              </div>
              <div className="flex items-center gap-2">
                {previewModalImg.processedBlob && (
                  <button
                    onClick={() => downloadSingleImage(previewModalImg.processedBlob!, previewModalImg.name)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تنزيل الدقة الأصلية' : 'Download High-Res'}</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewModalImg(null)}
                  className="px-2.5 py-1 rounded-lg text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 flex items-center justify-center bg-black max-h-[75vh] overflow-auto">
              <img
                src={previewModalImg.watermarkedUrl || previewModalImg.originalUrl}
                alt={previewModalImg.name}
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
