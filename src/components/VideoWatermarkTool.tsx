import React, { useRef, useState } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Camera, 
  Download, 
  Smartphone, 
  Maximize2, 
  Sparkles,
  Layers,
  Film
} from 'lucide-react';
import { RatioRulesMap, AspectRatioType } from '../types';
import { detectAspectRatio, calculateWatermarkBounds, loadImage } from '../utils/watermarkEngine';
import { DEFAULT_RATIO_RULES } from '../data/presets';
import { saveAs } from 'file-saver';

interface VideoWatermarkToolProps {
  currentLogoUrl: string;
  rules: RatioRulesMap;
  lang: 'ar' | 'en';
}

export const VideoWatermarkTool: React.FC<VideoWatermarkToolProps> = ({
  currentLogoUrl,
  rules,
  lang
}) => {
  const isAr = lang === 'ar';
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRatioType, setVideoRatioType] = useState<AspectRatioType>('4:3');
  const [videoDims, setVideoDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [capturedFrames, setCapturedFrames] = useState<{ url: string; time: number }[]>([]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoName(file.name);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsPlaying(false);
    setCapturedFrames([]);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      setVideoDims({ width: w, height: h });
      const detected = detectAspectRatio(w, h);
      setVideoRatioType(detected.ratioType);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const captureWatermarkedFrame = async () => {
    if (!videoRef.current || !videoSrc) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply watermark according to ratio rule
    const rule = rules[videoRatioType] || DEFAULT_RATIO_RULES[videoRatioType];
    const logoImg = await loadImage(currentLogoUrl);

    const bounds = calculateWatermarkBounds(
      canvas.width,
      canvas.height,
      logoImg.naturalWidth || logoImg.width,
      logoImg.naturalHeight || logoImg.height,
      rule
    );

    ctx.save();
    ctx.globalAlpha = rule.opacity;
    if (rule.hasShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
    }
    ctx.drawImage(logoImg, bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      const frameUrl = URL.createObjectURL(blob);
      setCapturedFrames(prev => [{ url: frameUrl, time: Math.round(video.currentTime * 10) / 10 }, ...prev]);
    }, 'image/jpeg', 0.95);
  };

  const activeRule = rules[videoRatioType] || DEFAULT_RATIO_RULES[videoRatioType];

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isAr ? 'أداة الشعار للفيديو واستخراج اللقطات' : 'Video Watermark & Frame Capture Tool'}
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-1">
            {isAr 
              ? 'تطبيق الشعار فوق مقاطع الفيديو بنسب 3:4 و 4:3 و 9:16 مع إمكانية التقاط صور كاملة الدقة بالشعار' 
              : 'Apply watermark to video clips (3:4, 4:3, 9:16) and capture high-resolution watermarked frames'}
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isAr ? 'رفع مقطع فيديو' : 'Upload Video'}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleVideoUpload}
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
        />
      </div>

      {/* Main Video Stage */}
      {videoSrc ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Video Player Column */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="relative bg-black rounded-2xl overflow-hidden border border-white/15 shadow-2xl max-w-full flex items-center justify-center group">
              <video
                ref={videoRef}
                src={videoSrc}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="max-h-[55vh] max-w-full object-contain"
                playsInline
              />

              {/* Watermark Overlay in Real-Time */}
              <div 
                className="absolute pointer-events-none transition-all"
                style={{
                  ...getVideoPositionStyles(activeRule.position, activeRule.marginPercent),
                  width: `${activeRule.sizePercent}%`,
                  opacity: activeRule.opacity,
                  filter: activeRule.hasShadow ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' : 'none'
                }}
              >
                <img src={currentLogoUrl} alt="Logo overlay" className="w-full h-auto object-contain" />
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="w-full mt-3.5 flex items-center justify-between gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                </button>
                <div className="text-xs text-white/90">
                  <span className="font-semibold">{videoName}</span>
                  <span className="text-[10px] text-white/40 block font-mono">
                    {videoDims.width}x{videoDims.height} ({videoRatioType})
                  </span>
                </div>
              </div>

              {/* Snapshot Button */}
              <button
                onClick={captureWatermarkedFrame}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{isAr ? 'التقاط لقطة بالشعار' : 'Capture Frame with Logo'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Captured Frames List */}
          <div className="lg:col-span-4 bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col">
            <h3 className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'اللقطات الملتقطة بالشعار' : 'Captured Frames'}</span>
              <span className="text-[10px] text-white/40">({capturedFrames.length})</span>
            </h3>

            {capturedFrames.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white/40 text-xs">
                <Camera className="w-8 h-8 text-white/20 mb-2" />
                <span>{isAr ? 'شغل الفيديو واضغط «التقاط لقطة» لحفظ أي إطار بدقة عالية مع الشعار' : 'Play video and click capture frame'}</span>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
                {capturedFrames.map((frame, idx) => (
                  <div key={idx} className="bg-black/50 rounded-lg p-2 border border-white/10 flex items-center justify-between gap-2">
                    <img src={frame.url} alt={`Frame ${idx}`} className="w-20 h-14 object-cover rounded bg-black" />
                    <div className="flex-1 text-[11px] text-white/80">
                      <span>{isAr ? `ثانية ${frame.time}s` : `At ${frame.time}s`}</span>
                    </div>
                    <button
                      onClick={() => saveAs(frame.url, `video_frame_${frame.time}s_watermarked.jpg`)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                      title={isAr ? 'تنزيل اللقطة' : 'Download frame'}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-all bg-white/5 flex flex-col items-center justify-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Film className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {isAr ? 'اضغط لرفع فيديو (MP4, WebM)' : 'Click to Upload Video (MP4, WebM)'}
          </h4>
          <p className="text-xs text-white/50">
            {isAr ? 'يدعم مقاطع 3:4 و 4:3 و 9:16 ستوري لمشاهدة الشعار والتقاط الصور' : 'Preview watermark on 3:4, 4:3, 9:16 video clips'}
          </p>
        </div>
      )}
    </div>
  );
};

function getVideoPositionStyles(pos: string, margin: number): React.CSSProperties {
  const m = `${margin}%`;
  switch (pos) {
    case 'top-left': return { top: m, left: m };
    case 'top-center': return { top: m, left: '50%', transform: 'translateX(-50%)' };
    case 'top-right': return { top: m, right: m };
    case 'center-left': return { top: '50%', left: m, transform: 'translateY(-50%)' };
    case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    case 'center-right': return { top: '50%', right: m, transform: 'translateY(-50%)' };
    case 'bottom-left': return { bottom: m, left: m };
    case 'bottom-center': return { bottom: m, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right': return { bottom: m, right: m };
    default: return { bottom: m, right: m };
  }
}
