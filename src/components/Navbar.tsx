import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Trash2, 
  Languages, 
  Layers, 
  HelpCircle,
  FileArchive,
  Image as ImageIcon
} from 'lucide-react';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenApkModal: () => void;
  onLoadSamples: () => void;
  onClearAll: () => void;
  totalImages: number;
  isProcessing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onOpenApkModal,
  onLoadSamples,
  onClearAll,
  totalImages,
  isProcessing
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                {isAr ? 'شعار-برو' : 'Watermark-Pro'}
              </h1>
              <span className="text-xs font-normal text-blue-400 bg-blue-400/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                {isAr ? 'نسخة المعالجة التلقائية' : 'Auto Engine v2.4'}
              </span>
            </div>
            <p className="text-xs text-white/50 hidden sm:block">
              {isAr 
                ? 'محرك ذكي لمعالجة الصور والمقاطع وتوزيع الشعار حسب أبعاد 3:4 و 4:3' 
                : 'Smart watermark positioning for 3:4 portrait, 4:3 landscape & batch images'}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {/* Load 10 Samples Button */}
          <button
            id="btn-load-samples"
            onClick={onLoadSamples}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-600/15 text-blue-300 border border-blue-500/30 hover:bg-blue-600/25 transition-all shadow-[0_0_15px_rgba(37,99,235,0.15)] active:scale-95 cursor-pointer"
            title={isAr ? 'تجربة 10 صور تلقائية بنسب 3:4 و 4:3' : 'Load 10 Sample Images'}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{isAr ? '10 صور تجريبية' : '10 Samples'}</span>
          </button>

          {/* APK Guide Modal button */}
          <button
            id="btn-apk-guide"
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">{isAr ? 'تنزيل APK للأندرويد' : 'Download APK'}</span>
            <span className="md:hidden">APK 📱</span>
          </button>

          {/* Language Toggle */}
          <button
            id="btn-lang-toggle"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors cursor-pointer"
            title={isAr ? 'تبديل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Languages className="w-3.5 h-3.5 text-white/50" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Clear All if items exist */}
          {totalImages > 0 && (
            <button
              id="btn-clear-all"
              onClick={onClearAll}
              disabled={isProcessing}
              className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              title={isAr ? 'حذف جميع الصور' : 'Clear all images'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
