import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Check, 
  Type, 
  Image as ImageIcon, 
  Sparkles, 
  RotateCcw,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { LogoPreset } from '../types';
import { BUILT_IN_LOGOS } from '../data/presets';

interface LogoSelectorProps {
  currentLogoUrl: string;
  onSelectLogo: (logoUrl: string, name?: string) => void;
  lang: 'ar' | 'en';
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({
  currentLogoUrl,
  onSelectLogo,
  lang
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'text'>('presets');
  const [customLogoPreview, setCustomLogoPreview] = useState<string | null>(null);
  
  // Text logo generator state
  const [textValue, setTextValue] = useState('شعار المتجر ©');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSubtitle, setTextSubtitle] = useState('STUDIO BRAND');
  const [textHasBadge, setTextHasBadge] = useState(true);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomLogoPreview(dataUrl);
      onSelectLogo(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const generateTextLogo = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (textHasBadge) {
      // Rounded pill or border badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2.5;
      
      const r = 18;
      const x = 10, y = 10, w = 380, h = 120;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Shadow for text
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Main Title
    ctx.fillStyle = textColor;
    ctx.font = `bold 28px 'Cairo', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(textValue || 'شعار', 200, textSubtitle ? 65 : 80);

    // Subtitle
    if (textSubtitle) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = `600 13px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillText(textSubtitle, 200, 95);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setCustomLogoPreview(dataUrl);
    onSelectLogo(dataUrl, 'Text Logo');
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isAr ? '1. الشعار المدرج في التطبيق' : '1. App Watermark Logo'}
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {isAr 
              ? 'اختر الشعار المدمج مسبقاً أو ارفع شعارك الخاص ليتم دمجه على كافة الصور' 
              : 'Choose a preloaded logo or upload your transparent PNG/SVG logo'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            id="tab-presets"
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'presets' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{isAr ? 'شعارات مدمجة' : 'Presets'}</span>
          </button>
          <button
            id="tab-custom"
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'custom' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isAr ? 'رفع شعاري' : 'Custom'}</span>
          </button>
          <button
            id="tab-text"
            onClick={() => setActiveTab('text')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'text' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isAr ? 'كتابة اسم' : 'Text'}</span>
          </button>
        </div>
      </div>

      {/* Tab: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BUILT_IN_LOGOS.map((logo) => {
            const isSelected = currentLogoUrl === logo.url;
            return (
              <button
                key={logo.id}
                id={`logo-preset-${logo.id}`}
                onClick={() => onSelectLogo(logo.url, logo.name)}
                className={`relative flex flex-col items-center p-3.5 rounded-xl border transition-all text-center group cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-600/10 ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.25)]' 
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-full h-16 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center p-2 mb-2.5 overflow-hidden">
                  <img 
                    src={logo.url} 
                    alt={logo.name} 
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>
                <span className="text-xs font-semibold text-white/90 line-clamp-1">
                  {isAr ? logo.nameAr : logo.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab: Custom Upload */}
      {activeTab === 'custom' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomUpload}
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="hidden"
            id="input-custom-logo"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-52 h-28 rounded-xl border-2 border-dashed border-white/20 hover:border-blue-500/60 bg-black/30 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all hover:bg-blue-600/5 group"
          >
            <Upload className="w-6 h-6 text-white/50 group-hover:text-blue-400 mb-1 transition-colors" />
            <span className="text-xs font-bold text-white">
              {isAr ? 'اختر ملف الشعار' : 'Choose Logo File'}
            </span>
            <span className="text-[10px] text-white/40 mt-0.5">PNG, SVG, JPG (شفاف)</span>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center">
            {customLogoPreview ? (
              <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-xl border border-white/10">
                <div className="w-20 h-16 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center p-1.5">
                  <img src={customLogoPreview} alt="Custom Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'تم تفعيل شعارك المخصص بنجاح' : 'Custom Logo Active'}</span>
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    {isAr ? 'سيتم تطبيق هذا الشعار تلقائياً على كل الصور والمقاطع' : 'Will be applied to all your batch assets'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/60 leading-relaxed">
                {isAr ? (
                  <>
                    💡 <strong className="text-white">نصيحة:</strong> يفضل رفع صورة شعار بصيغة <strong className="text-blue-400">PNG بخلفية شفافة</strong> أو ملف <strong className="text-blue-400">SVG</strong> للحصول على أعلى جودة وتباين فوق كل الصور.
                  </>
                ) : (
                  <>
                    💡 <strong className="text-white">Tip:</strong> For sharpest results, upload a transparent <strong className="text-blue-400">PNG</strong> or <strong className="text-blue-400">SVG</strong> logo.
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Text Creator */}
      {activeTab === 'text' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {isAr ? 'النص الرئيسي / اسم البراند' : 'Main Text / Brand'}
              </label>
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={isAr ? 'مثال: @اسم_المتجر' : 'e.g. @MyBrand'}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {isAr ? 'النص الفرعي (اختياري)' : 'Subtitle (Optional)'}
              </label>
              <input
                type="text"
                value={textSubtitle}
                onChange={(e) => setTextSubtitle(e.target.value)}
                placeholder={isAr ? 'مثال: حقوق النشر محفوظة' : 'e.g. All Rights Reserved'}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {isAr ? 'لون النص والبرواز' : 'Color'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-black/50 cursor-pointer p-0.5"
                />
                <button
                  type="button"
                  onClick={() => setTextHasBadge(!textHasBadge)}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    textHasBadge 
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' 
                      : 'bg-black/50 border-white/15 text-white/60'
                  }`}
                >
                  {textHasBadge ? (isAr ? 'مع برواز حماية' : 'With Badge') : (isAr ? 'نص فقط' : 'Text Only')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="btn-apply-text-logo"
              type="button"
              onClick={generateTextLogo}
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isAr ? 'توليد واستخدام الشعار' : 'Generate & Use Text Logo'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
