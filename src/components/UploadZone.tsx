import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle,
  FileCheck,
  Plus
} from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  onLoadSamples: () => void;
  totalImages: number;
  isProcessing: boolean;
  lang: 'ar' | 'en';
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  onLoadSamples,
  totalImages,
  isProcessing,
  lang
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        id="batch-image-file-input"
      />

      {/* Main Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer group bg-black/40 backdrop-blur-md shadow-xl ${
          isDragOver
            ? 'border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/40 scale-[1.01]'
            : 'border-white/15 hover:border-blue-500/50 hover:bg-white/5'
        }`}
      >
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 text-white flex items-center justify-center mb-3 group-hover:scale-110 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-1 tracking-tight">
            {isAr ? 'اضغط لاختيار 10 صور أو أكثر أو اسحبها هنا' : 'Click to select 10+ photos or drag and drop'}
          </h3>

          <p className="text-xs text-white/50 mb-4 leading-relaxed">
            {isAr 
              ? 'يدعم صيغ JPG و PNG و WebP - يتعرف النظام تلقائياً على أبعاد كل صورة (3:4 أو 4:3) ويضع الشعار في المكان المحدد'
              : 'Supports JPG, PNG, WebP - Automatically detects 3:4 portrait or 4:3 landscape and adds watermark'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              id="btn-choose-files"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'اختيار الصور من الجهاز' : 'Select Photos'}</span>
            </button>

            <button
              type="button"
              id="btn-load-sample-batch"
              onClick={(e) => {
                e.stopPropagation();
                onLoadSamples();
              }}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/5 hover:bg-white/10 text-blue-300 border border-blue-500/30 hover:border-blue-500/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.15)]"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'تجربة 10 صور جاهزة بنسب 3:4 و 4:3' : 'Test 10 Sample Images'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
