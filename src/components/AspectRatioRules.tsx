import React, { useState } from 'react';
import { 
  Sliders, 
  Smartphone, 
  Maximize2, 
  Square, 
  Film, 
  Tv, 
  RotateCcw,
  Sparkles,
  Move,
  Eye,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { AspectRatioType, PositionRule, RatioRulesMap, WatermarkPosition } from '../types';
import { RATIO_INFO, DEFAULT_RATIO_RULES } from '../data/presets';

interface AspectRatioRulesProps {
  rules: RatioRulesMap;
  onChangeRule: (ratio: AspectRatioType, newRule: PositionRule) => void;
  onResetRules: () => void;
  currentLogoUrl: string;
  lang: 'ar' | 'en';
}

export const AspectRatioRules: React.FC<AspectRatioRulesProps> = ({
  rules,
  onChangeRule,
  onResetRules,
  currentLogoUrl,
  lang
}) => {
  const isAr = lang === 'ar';
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>('3:4');

  const currentRule = rules[selectedRatio] || DEFAULT_RATIO_RULES[selectedRatio];

  const updateField = <K extends keyof PositionRule>(field: K, value: PositionRule[K]) => {
    onChangeRule(selectedRatio, {
      ...currentRule,
      [field]: value
    });
  };

  const ratioKeys: AspectRatioType[] = ['3:4', '4:3', '1:1', '9:16', '16:9'];

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

  // Helper for live preview dimensions
  const getPreviewDimensions = (ratio: AspectRatioType) => {
    switch (ratio) {
      case '3:4':
        return { w: 120, h: 160 };
      case '4:3':
        return { w: 160, h: 120 };
      case '1:1':
        return { w: 140, h: 140 };
      case '9:16':
        return { w: 90, h: 160 };
      case '16:9':
        return { w: 160, h: 90 };
      default:
        return { w: 140, h: 140 };
    }
  };

  const previewDim = getPreviewDimensions(selectedRatio);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {isAr ? '2. قواعد تحديد مكان الشعار حسب أبعاد الصورة' : '2. Watermark Position Rules by Aspect Ratio'}
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {isAr 
              ? 'حدد مكان وحجم الشعار تلقائياً لصور 3:4 وصور 4:3 ولكل نوع أبعاد' 
              : 'Configure default logo location and scale specifically for 3:4 portrait, 4:3 landscape, and more'}
          </p>
        </div>

        <button
          id="btn-reset-rules"
          onClick={onResetRules}
          className="text-xs text-white/60 hover:text-blue-400 flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
        </button>
      </div>

      {/* Aspect Ratio Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-5">
        {ratioKeys.map((ratio) => {
          const info = RATIO_INFO[ratio];
          const isSelected = selectedRatio === ratio;
          const rule = rules[ratio];

          return (
            <button
              key={ratio}
              id={`tab-ratio-${ratio.replace(':', '-')}`}
              onClick={() => setSelectedRatio(ratio)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected 
                  ? 'border-blue-500 bg-blue-600/10 ring-1 ring-blue-500/50 text-white shadow-[0_0_20px_rgba(37,99,235,0.25)]' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 text-white/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold text-xs sm:text-sm text-white">
                {ratio === '3:4' && <Smartphone className="w-3.5 h-3.5 text-blue-400" />}
                {ratio === '4:3' && <Maximize2 className="w-3.5 h-3.5 text-blue-400" />}
                {ratio === '1:1' && <Square className="w-3.5 h-3.5 text-blue-400" />}
                {ratio === '9:16' && <Film className="w-3.5 h-3.5 text-blue-400" />}
                {ratio === '16:9' && <Tv className="w-3.5 h-3.5 text-blue-400" />}
                <span>{ratio}</span>
              </div>
              <span className="text-[11px] font-medium line-clamp-1">
                {isAr ? info.labelAr.split('(')[1]?.replace(')', '') || info.labelAr : info.labelEn}
              </span>
              <span className="text-[10px] text-blue-400/80 mt-0.5 font-medium">
                {positions.find(p => p.id === rule.position)?.[isAr ? 'labelAr' : 'labelEn']}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Ratio Configurator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
        {/* Left / Center Column: 9-Point Grid Position Selector */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-white/80 mb-2.5 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-blue-400" />
            {isAr ? `تمركز الشعار لـ (${selectedRatio})` : `Logo Position for (${selectedRatio})`}
          </span>

          <div className="grid grid-cols-3 gap-1.5 p-2 bg-black/50 border border-white/10 rounded-xl w-full max-w-[240px]">
            {positions.map((pos) => {
              const isCurrent = currentRule.position === pos.id;
              return (
                <button
                  key={pos.id}
                  id={`btn-pos-${pos.id}`}
                  onClick={() => updateField('position', pos.id)}
                  title={isAr ? pos.labelAr : pos.labelEn}
                  className={`h-11 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105 ring-1 ring-blue-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <span className="text-[10px] line-clamp-1 leading-tight px-1">
                    {isAr ? pos.labelAr : pos.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-white/50 text-center mt-3">
            {isAr ? (
              <>
                الموقع المعتمد: <strong className="text-blue-400">{positions.find(p => p.id === currentRule.position)?.labelAr}</strong>
              </>
            ) : (
              <>
                Selected: <strong className="text-blue-400">{positions.find(p => p.id === currentRule.position)?.labelEn}</strong>
              </>
            )}
          </p>
        </div>

        {/* Center: Sliders (Size, Margin, Opacity, Shadow) */}
        <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-r lg:border-l border-white/10 pt-4 lg:pt-0 lg:px-5 flex flex-col justify-center">
          {/* Size Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
              <span>{isAr ? 'حجم الشعار (نسبة من عرض الصورة)' : 'Logo Size (% of width)'}</span>
              <span className="font-bold text-blue-400 font-mono">{currentRule.sizePercent}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="45"
              step="1"
              value={currentRule.sizePercent}
              onChange={(e) => updateField('sizePercent', Number(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Margin Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
              <span>{isAr ? 'المسافة عن الحواف (الهامش)' : 'Edge Margin'}</span>
              <span className="font-bold text-blue-400 font-mono">{currentRule.marginPercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={currentRule.marginPercent}
              onChange={(e) => updateField('marginPercent', Number(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
              <span>{isAr ? 'شفافية الشعار' : 'Logo Opacity'}</span>
              <span className="font-bold text-blue-400 font-mono">{Math.round(currentRule.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={currentRule.opacity}
              onChange={(e) => updateField('opacity', Number(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Shadow & Contrast Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white/90">
                {isAr ? 'ظل خلف الشعار (وضوح عالٍ)' : 'Contrast Drop Shadow'}
              </span>
              <span className="text-[10px] text-white/40">
                {isAr ? 'يضمن ظهور الشعار بوضوح على كافة درجات الألوان' : 'Ensures logo stands out on all backgrounds'}
              </span>
            </div>
            <button
              type="button"
              id="toggle-shadow"
              onClick={() => updateField('hasShadow', !currentRule.hasShadow)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentRule.hasShadow ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-black/60 border border-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentRule.hasShadow ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Live Mini Canvas Preview */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
          <span className="text-xs font-bold text-white/80 mb-2.5 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            {isAr ? 'معاينة فورية' : 'Live Preview'}
          </span>

          <div className="relative bg-black/60 border border-white/10 rounded-xl p-3 flex items-center justify-center overflow-hidden shadow-inner">
            {/* The scaled container representing the aspect ratio */}
            <div 
              className="relative bg-gradient-to-br from-zinc-900 via-blue-950/40 to-black border border-white/15 rounded-lg shadow-md overflow-hidden flex items-center justify-center"
              style={{
                width: `${previewDim.w}px`,
                height: `${previewDim.h}px`
              }}
            >
              {/* Aspect ratio watermark overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                <span className="text-xs font-extrabold text-white">{selectedRatio}</span>
              </div>

              {/* Watermark placement representation */}
              <div 
                className="absolute transition-all duration-200 pointer-events-none"
                style={{
                  ...getPreviewPositionStyles(currentRule.position, currentRule.marginPercent),
                  width: `${Math.max(24, (previewDim.w * currentRule.sizePercent) / 100)}px`,
                  opacity: currentRule.opacity,
                  filter: currentRule.hasShadow ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' : 'none',
                  transform: currentRule.rotation ? `rotate(${currentRule.rotation}deg)` : 'none'
                }}
              >
                <img 
                  src={currentLogoUrl} 
                  alt="Logo preview" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          <span className="text-[10px] text-white/40 mt-2 text-center">
            {RATIO_INFO[selectedRatio].descAr}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper for positioning preview box inside mini display
function getPreviewPositionStyles(pos: WatermarkPosition, margin: number): React.CSSProperties {
  const m = `${margin}%`;
  switch (pos) {
    case 'top-left':
      return { top: m, left: m };
    case 'top-center':
      return { top: m, left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':
      return { top: m, right: m };
    case 'center-left':
      return { top: '50%', left: m, transform: 'translateY(-50%)' };
    case 'center':
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    case 'center-right':
      return { top: '50%', right: m, transform: 'translateY(-50%)' };
    case 'bottom-left':
      return { bottom: m, left: m };
    case 'bottom-center':
      return { bottom: m, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
      return { bottom: m, right: m };
    default:
      return { bottom: m, right: m };
  }
}
