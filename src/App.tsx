import React, { useState, useEffect, useCallback } from 'react';
import { 
  RatioRulesMap, 
  PositionRule, 
  AspectRatioType, 
  ImageItem, 
  ProcessingOptions 
} from './types';
import { 
  BUILT_IN_LOGOS, 
  DEFAULT_RATIO_RULES, 
  SAMPLE_TEST_IMAGES 
} from './data/presets';
import { 
  detectAspectRatio, 
  applyWatermarkToImage, 
  downloadAllImagesAsZip,
  loadImage 
} from './utils/watermarkEngine';
import { Navbar } from './components/Navbar';
import { LogoSelector } from './components/LogoSelector';
import { AspectRatioRules } from './components/AspectRatioRules';
import { UploadZone } from './components/UploadZone';
import { BatchGallery } from './components/BatchGallery';
import { BatchActionBar } from './components/BatchActionBar';
import { ImageEditorModal } from './components/ImageEditorModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { VideoWatermarkTool } from './components/VideoWatermarkTool';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Film, 
  Image as ImageIcon,
  Smartphone,
  Zap,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function App() {
  // Language State
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Active Main Tab: 'photos' | 'video'
  const [mainTab, setMainTab] = useState<'photos' | 'video'>('photos');

  // Active Watermark Logo State
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(() => {
    return localStorage.getItem('app_watermark_logo') || BUILT_IN_LOGOS[0].url;
  });

  // Aspect Ratio Rules State
  const [rules, setRules] = useState<RatioRulesMap>(() => {
    const saved = localStorage.getItem('app_watermark_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* use default */ }
    }
    return DEFAULT_RATIO_RULES;
  });

  // Batch Image Items
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  // Export Settings
  const [options, setOptions] = useState<ProcessingOptions>({
    outputFormat: 'image/jpeg',
    quality: 0.95,
    prefix: 'watermarked_',
    suffix: ''
  });

  // Modals
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync RTL / LTR with language
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  // Save rules & logo to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_watermark_logo', currentLogoUrl);
      localStorage.setItem('app_watermark_rules', JSON.stringify(rules));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [currentLogoUrl, rules]);

  // Trigger brief toast message
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  /**
   * Processes a batch of raw ImageItems through the watermark canvas engine
   */
  const processImagesBatch = useCallback(async (itemsToProcess: ImageItem[]) => {
    if (itemsToProcess.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    const updatedList = [...itemsToProcess];
    const total = updatedList.length;

    for (let i = 0; i < total; i++) {
      const item = updatedList[i];
      try {
        const activeRule = item.customRule || rules[item.detectedRatioType] || DEFAULT_RATIO_RULES[item.detectedRatioType];
        const res = await applyWatermarkToImage(item.originalUrl, currentLogoUrl, activeRule, options);
        
        updatedList[i] = {
          ...item,
          watermarkedUrl: res.url,
          processedBlob: res.blob,
          isProcessing: false
        };
      } catch (err: any) {
        console.error(`Error processing image ${item.name}:`, err);
        updatedList[i] = {
          ...item,
          isProcessing: false,
          error: err.message
        };
      }

      setProcessingProgress(Math.round(((i + 1) / total) * 100));
      // Update state incrementally
      setImages([...updatedList]);
    }

    setIsProcessing(false);
  }, [rules, currentLogoUrl, options]);

  /**
   * Handle user uploading images via file picker or drag & drop
   */
  const handleFilesSelected = async (files: FileList | File[]) => {
    const newItems: ImageItem[] = [];
    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) continue;

      const objectUrl = URL.createObjectURL(file);
      try {
        const img = await loadImage(objectUrl);
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const detected = detectAspectRatio(w, h);

        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          file,
          name: file.name,
          originalUrl: objectUrl,
          width: w,
          height: h,
          aspectRatio: detected.ratio,
          detectedRatioType: detected.ratioType,
          ratioLabelAr: detected.labelAr,
          ratioLabelEn: detected.labelEn,
          watermarkedUrl: null,
          processedBlob: null,
          isProcessing: true
        });
      } catch (err) {
        console.error('Failed to inspect image file:', err);
      }
    }

    if (newItems.length > 0) {
      const combined = [...images, ...newItems];
      setImages(combined);
      showToast(
        isAr 
          ? `تم رفع ${newItems.length} صورة بنجاح، جاري وضع الشعار عليها تلقائياً...` 
          : `Uploaded ${newItems.length} photos. Applying watermarks...`, 
        'info'
      );
      // Process all images
      processImagesBatch(combined);
    }
  };

  /**
   * Load 10 pre-configured sample images of different aspect ratios (3:4, 4:3, 1:1, 16:9, 9:16)
   */
  const handleLoadSamples = async () => {
    setIsProcessing(true);
    const sampleItems: ImageItem[] = [];

    for (const sample of SAMPLE_TEST_IMAGES) {
      const svgBlob = new Blob([sample.svg], { type: 'image/svg+xml;charset=utf-8' });
      const objectUrl = URL.createObjectURL(svgBlob);
      const detected = detectAspectRatio(sample.width, sample.height);

      sampleItems.push({
        id: `sample-${sample.id}-${Date.now()}`,
        name: sample.name,
        originalUrl: objectUrl,
        width: sample.width,
        height: sample.height,
        aspectRatio: detected.ratio,
        detectedRatioType: detected.ratioType,
        ratioLabelAr: detected.labelAr,
        ratioLabelEn: detected.labelEn,
        watermarkedUrl: null,
        processedBlob: null,
        isProcessing: true
      });
    }

    setImages(sampleItems);
    showToast(
      isAr 
        ? 'تم تحميل 10 صور تجريبية بتنسيقات 3:4 و 4:3 و 1:1 و 16:9 بنجاح' 
        : 'Loaded 10 sample photos with 3:4, 4:3, 1:1 and 16:9 ratios', 
      'success'
    );

    // Run batch rendering
    await processImagesBatch(sampleItems);
  };

  /**
   * Change rule for a specific aspect ratio and re-render images with that ratio
   */
  const handleChangeRule = (ratio: AspectRatioType, newRule: PositionRule) => {
    const updatedRules = { ...rules, [ratio]: newRule };
    setRules(updatedRules);

    // Re-process currently loaded images that match this ratio
    if (images.length > 0) {
      setTimeout(() => {
        processImagesBatch(images);
      }, 50);
    }
  };

  /**
   * Reset all aspect ratio rules to defaults
   */
  const handleResetRules = () => {
    setRules(DEFAULT_RATIO_RULES);
    showToast(isAr ? 'تم استعادة القواعد الافتراضية بنجاح' : 'Reset to default rules', 'info');
    if (images.length > 0) {
      processImagesBatch(images);
    }
  };

  /**
   * Select a new logo (preset or custom) and re-render all images
   */
  const handleSelectLogo = (logoUrl: string, name?: string) => {
    setCurrentLogoUrl(logoUrl);
    showToast(
      isAr 
        ? `تم اعتماد الشعار: ${name || 'الشعار المخصص'}` 
        : `Watermark logo updated`, 
      'success'
    );
    if (images.length > 0) {
      setTimeout(() => {
        processImagesBatch(images);
      }, 50);
    }
  };

  /**
   * Save individual image custom adjustment
   */
  const handleSaveIndividualCustomRule = async (imageId: string, customRule: PositionRule) => {
    const target = images.find(img => img.id === imageId);
    if (!target) return;

    try {
      const res = await applyWatermarkToImage(target.originalUrl, currentLogoUrl, customRule, options);
      const updated = images.map(img => {
        if (img.id === imageId) {
          return {
            ...img,
            customRule,
            watermarkedUrl: res.url,
            processedBlob: res.blob
          };
        }
        return img;
      });
      setImages(updated);
      showToast(isAr ? 'تم حفظ التعديل المخصص لهذه الصورة' : 'Custom placement saved', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Remove single image
   */
  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  /**
   * Clear all images
   */
  const handleClearAll = () => {
    setImages([]);
    showToast(isAr ? 'تم مسح جميع الصور' : 'All images cleared', 'info');
  };

  /**
   * Download All as ZIP archive
   */
  const handleDownloadAllZip = async () => {
    if (images.length === 0) return;
    try {
      setIsProcessing(true);
      showToast(isAr ? 'جاري تجميع وضغط الصور في ملف ZIP...' : 'Compressing ZIP archive...', 'info');
      await downloadAllImagesAsZip(images, `watermarked_images_${Date.now()}.zip`, (p) => {
        setProcessingProgress(p);
      });
      showToast(isAr ? 'تم تنزيل ملف الـ ZIP بنجاح!' : 'ZIP downloaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error downloading ZIP', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2.5 border ${
            toastMessage.type === 'success'
              ? 'bg-black/90 text-emerald-300 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : toastMessage.type === 'error'
              ? 'bg-black/90 text-rose-300 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'bg-black/90 text-blue-300 border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.25)]'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onLoadSamples={handleLoadSamples}
        onClearAll={handleClearAll}
        totalImages={images.length}
        isProcessing={isProcessing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Main Tab Navigation (Photos vs Video) */}
        <div className="flex items-center justify-between gap-3 bg-black/30 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              id="tab-main-photos"
              onClick={() => setMainTab('photos')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainTab === 'photos'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isAr ? 'معالجة الصور المجمعة (10+ صور)' : 'Batch Photos Watermark'}</span>
            </button>

            <button
              id="tab-main-video"
              onClick={() => setMainTab('video')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainTab === 'video'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>{isAr ? 'أداة شعار الفيديو واللقطات' : 'Video Watermark Tool'}</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-white/50 px-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'معالجة محلية بالكامل' : 'GPU Client Render'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'حماية خصوصية 100%' : '100% Private Engine'}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Logo Selector */}
        <LogoSelector
          currentLogoUrl={currentLogoUrl}
          onSelectLogo={handleSelectLogo}
          lang={lang}
        />

        {/* Section 2: Position Rules Configuration per Aspect Ratio */}
        <AspectRatioRules
          rules={rules}
          onChangeRule={handleChangeRule}
          onResetRules={handleResetRules}
          currentLogoUrl={currentLogoUrl}
          lang={lang}
        />

        {/* Tab 1 Content: Batch Photos */}
        {mainTab === 'photos' && (
          <div className="space-y-6">
            {/* Section 3: Upload Zone */}
            <UploadZone
              onFilesSelected={handleFilesSelected}
              onLoadSamples={handleLoadSamples}
              totalImages={images.length}
              isProcessing={isProcessing}
              lang={lang}
            />

            {/* Section 4: Batch Gallery of Processed Photos */}
            <BatchGallery
              images={images}
              onRemoveImage={handleRemoveImage}
              onEditImage={(img) => setEditingImage(img)}
              onDownloadAllZip={handleDownloadAllZip}
              isProcessing={isProcessing}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 2 Content: Video Tool */}
        {mainTab === 'video' && (
          <VideoWatermarkTool
            currentLogoUrl={currentLogoUrl}
            rules={rules}
            lang={lang}
          />
        )}
      </main>

      {/* Floating Batch Action Bar (Appears when images exist) */}
      {mainTab === 'photos' && images.length > 0 && (
        <BatchActionBar
          images={images}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
          onProcessAll={() => processImagesBatch(images)}
          onDownloadAllZip={handleDownloadAllZip}
          options={options}
          onChangeOptions={(opts) => setOptions(prev => ({ ...prev, ...opts }))}
          lang={lang}
        />
      )}

      {/* Single Image Fine-Tune Modal */}
      {editingImage && (
        <ImageEditorModal
          image={editingImage}
          currentLogoUrl={currentLogoUrl}
          rules={rules}
          onSave={handleSaveIndividualCustomRule}
          onClose={() => setEditingImage(null)}
          lang={lang}
        />
      )}

      {/* APK & Mobile Installation Guide Modal */}
      <ApkGuideModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        lang={lang}
      />

      {/* Immersive UI Footer */}
      <footer className="px-6 sm:px-8 py-3.5 border-t border-white/10 bg-black flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-2">
        <div className="flex items-center gap-2">
          <span>{isAr ? 'الحالة:' : 'Status:'}</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {isAr ? 'جاهز للمعالجة' : 'Ready'}
          </span>
          <span className="text-white/20">|</span>
          <span>{isAr ? 'محرك المعالجة:' : 'Engine:'}</span>
          <span className="text-white/70 font-mono">v2.4.1</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-white/60">
            {isAr ? 'جميع الصور ومقاطع الفيديو يتم معالجتها محلياً على جهازك' : 'All processing is performed locally on your device'}
          </span>
        </div>
      </footer>
    </div>
  );
}
