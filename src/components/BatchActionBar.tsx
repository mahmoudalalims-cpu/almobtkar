import React, { useState } from 'react';
import { 
  Download, 
  Archive, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  Loader2, 
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { ImageItem, ProcessingOptions } from '../types';

interface BatchActionBarProps {
  images: ImageItem[];
  isProcessing: boolean;
  processingProgress: number;
  onProcessAll: () => void;
  onDownloadAllZip: () => void;
  options: ProcessingOptions;
  onChangeOptions: (opts: Partial<ProcessingOptions>) => void;
  lang: 'ar' | 'en';
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  images,
  isProcessing,
  processingProgress,
  onProcessAll,
  onDownloadAllZip,
  options,
  onChangeOptions,
  lang
}) => {
  const isAr = lang === 'ar';
  const [showSettings, setShowSettings] = useState(false);

  if (images.length === 0) {
    return null;
  }

  const processedCount = images.filter(img => img.processedBlob !== null).length;
  const allProcessed = processedCount === images.length;

  return (
    <div className="sticky bottom-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/10 p-3.5 sm:p-4 shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Info / Counts */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              {processedCount}/{images.length}
            </div>
            <div>
              <span className="text-xs font-bold text-white block tracking-tight">
                {isAr 
                  ? `${images.length} صور جاهزة بدقة كاملة` 
                  : `${images.length} Photos Ready`}
              </span>
              <span className="text-[10px] text-white/40">
                {isAr ? 'تم ضبط مكان الشعار حسب أبعاد كل صورة' : 'Watermark applied per ratio'}
              </span>
            </div>
          </div>

          {/* Quick Settings Toggle */}
          <button
            id="btn-toggle-export-settings"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSettings 
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title={isAr ? 'إعدادات جودة التصدير' : 'Export settings'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-medium">{isAr ? 'جودة التصدير' : 'Quality'}</span>
          </button>
        </div>

        {/* Center: Processing Progress Bar if active */}
        {isProcessing && (
          <div className="w-full sm:w-64 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-white/50">
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                {isAr ? 'جاري المعالجة...' : 'Processing batch...'}
              </span>
              <span className="font-mono text-blue-400 font-bold">{processingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_10px_rgba(37,99,235,0.6)] transition-all duration-200"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Re-render button */}
          <button
            id="btn-reapply-all"
            onClick={onProcessAll}
            disabled={isProcessing}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title={isAr ? 'تحديث الشعار على كافة الصور بالقواعد الجديدة' : 'Re-apply rules to all'}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isProcessing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث الكل' : 'Re-apply'}</span>
          </button>

          {/* Download ALL ZIP button */}
          <button
            id="btn-download-all-zip"
            onClick={onDownloadAllZip}
            disabled={isProcessing || images.length === 0}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Archive className="w-4 h-4" />
            <span>
              {isAr ? `تنزيل الكل في ملف مضغوط ZIP (${images.length})` : `Download All as ZIP (${images.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Settings Drawer */}
      {showSettings && (
        <div className="max-w-7xl mx-auto mt-3.5 pt-3.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl">
          <div>
            <label className="text-[11px] font-semibold text-white/80 block mb-1">
              {isAr ? 'صيغة الصور الناتجة' : 'Output Format'}
            </label>
            <select
              value={options.outputFormat}
              onChange={(e) => onChangeOptions({ outputFormat: e.target.value as any })}
              className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="image/jpeg">JPEG (أعلى توافق وحجم صغير)</option>
              <option value="image/png">PNG (أعلى دقة بدون ضغط)</option>
              <option value="image/webp">WebP (حديث وسريع جداً)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/80 block mb-1">
              {isAr ? 'جودة الصورة (Compression Quality)' : 'Quality'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.05"
                value={options.quality}
                onChange={(e) => onChangeOptions({ quality: Number(e.target.value) })}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs font-mono text-blue-400 font-bold w-10 text-center">
                {Math.round(options.quality * 100)}%
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/80 block mb-1">
              {isAr ? 'بادئة اسم الملف (Prefix)' : 'Filename Prefix'}
            </label>
            <input
              type="text"
              value={options.prefix}
              onChange={(e) => onChangeOptions({ prefix: e.target.value })}
              placeholder="watermarked_"
              className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
};
