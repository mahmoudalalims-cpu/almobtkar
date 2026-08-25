import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  RotateCcw, 
  Move, 
  Sliders, 
  Eye, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ImageItem, PositionRule, WatermarkPosition, RatioRulesMap } from '../types';
import { DEFAULT_RATIO_RULES } from '../data/presets';
import { applyWatermarkToImage } from '../utils/watermarkEngine';

interface ImageEditorModalProps {
  image: ImageItem | null;
  currentLogoUrl: string;
  rules: RatioRulesMap;
  onSave: (imageId: string, customRule: PositionRule) => void;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  image,
  currentLogoUrl,
  rules,
  onSave,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  
  if (!image) return null;

  const defaultForRatio = rules[image.detectedRatioType] || DEFAULT_RATIO_RULES[image.detectedRatioType];
  const [rule, setRule] = useState<PositionRule>(image.customRule || defaultForRatio);
  const [previewUrl, setPreviewUrl] = useState<string>(image.watermarkedUrl || image.originalUrl);
  const [isGenerating, setIsGenerating] = useState(false);

  const positions: { id: WatermarkPosition; labelAr: string; labelEn: string }[] = [
    { id: 'top-left', labelAr: 'أعلى اليسار', labelEn: 'Top Left' },
    { id: 'top-center', labelAr: 'أعلى الوسط', labelEn: 'Top Center' },
    { id: 'top-right', labelAr: 'أعلى اليمين', labelEn: 'Top Right' },
    { id: 'center-left', labelAr: 'وسط اليسار', labelEn: 'Center Left' },
    { id: 'center', labelAr: 'المنتصف', labelEn: 'Center' },
    { id: 'center-right', labelAr: 'وسط اليمين', labelEn: 'Center Right' },
    { id: 'bottom-left', labelAr: 'أسفل اليسار', labelEn: 'Bottom Left' },
    { id: 'bottom-center', labelAr: 'أسفل الوسط', labelEn: 'Bottom Center' },
    { id: 'bottom-right', labelAr: 'أسفل اليمين', labelEn: 'Bottom Right' }
  ];

  // Re-generate single preview on rule tweak
  useEffect(() => {
    let active = true;
    const updatePreview = async () => {
      try {
        setIsGenerating(true);
        const res = await applyWatermarkToImage(image.originalUrl, currentLogoUrl, rule);
        if (active) {
          setPreviewUrl(res.url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setIsGenerating(false);
      }
    };

    const timer = setTimeout(updatePreview, 60);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [rule, image.originalUrl, currentLogoUrl]);

  const updateField = <K extends keyof PositionRule>(field: K, value: PositionRule[K]) => {
    setRule(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(image.id, rule);
    onClose();
  };

  const handleResetToDefault = () => {
    setRule(defaultForRatio);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-black/95 border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {isAr ? `تخصيص مكان الشعار: ${image.name}` : `Fine-Tune Watermark: ${image.name}`}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              {image.detectedRatioType} ({image.width}x{image.height})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
          {/* Left / Center: Preview Image */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white/5 rounded-xl p-4 border border-white/10 min-h-[300px]">
            <div className="relative max-h-[50vh] max-w-full flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[48vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white bg-black/90 px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                    {isAr ? 'جاري التحديث...' : 'Updating...'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-white/40 mt-2.5">
              {isAr ? 'معاينة فورية بدقة كاملة' : 'Real-time High Resolution Preview'}
            </span>
          </div>

          {/* Right: Controls Panel */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Position Compass */}
              <div>
                <span className="text-xs font-bold text-white/90 block mb-2">
                  {isAr ? 'موضع الشعار' : 'Position Anchor'}
                </span>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-white/5 rounded-xl border border-white/10">
                  {positions.map((pos) => {
                    const isSelected = rule.position === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => updateField('position', pos.id)}
                        className={`h-9 rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {isAr ? pos.labelAr : pos.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3.5 bg-white/5 p-4 rounded-xl border border-white/10">
                {/* Size */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
                    <span>{isAr ? 'الحجم' : 'Size'}</span>
                    <span className="font-bold text-blue-400 font-mono">{rule.sizePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={rule.sizePercent}
                    onChange={(e) => updateField('sizePercent', Number(e.target.value))}
                    className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Margin */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
                    <span>{isAr ? 'الهامش من الحافة' : 'Margin'}</span>
                    <span className="font-bold text-blue-400 font-mono">{rule.marginPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={rule.marginPercent}
                    onChange={(e) => updateField('marginPercent', Number(e.target.value))}
                    className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
                    <span>{isAr ? 'الشفافية' : 'Opacity'}</span>
                    <span className="font-bold text-blue-400 font-mono">{Math.round(rule.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={rule.opacity}
                    onChange={(e) => updateField('opacity', Number(e.target.value))}
                    className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Shadow */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-white/80">
                    {isAr ? 'ظل خلف الشعار' : 'Drop Shadow'}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateField('hasShadow', !rule.hasShadow)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      rule.hasShadow ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        rule.hasShadow ? (isAr ? 'left-0.5' : 'right-0.5') : (isAr ? 'right-0.5' : 'left-0.5')
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'استعادة إعدادات النسبة' : 'Reset to Rule'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'حفظ التعديل' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
