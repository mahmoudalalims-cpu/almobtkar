import { LogoPreset, RatioRulesMap, AspectRatioType } from '../types';

// Default built-in logo SVG data URIs
const createSvgDataUrl = (svgContent: string): string => {
  const encoded = encodeURIComponent(svgContent.trim());
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
};

export const BUILT_IN_LOGOS: LogoPreset[] = [
  {
    id: 'gold-luxury',
    name: 'Luxury Gold Emblem',
    nameAr: 'شعار ذهبي احترافي',
    type: 'preset',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120">
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047" />
            <stop offset="50%" stop-color="#CA8A04" />
            <stop offset="100%" stop-color="#EAB308" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>
        <g filter="url(#glow)">
          <path d="M45 20 L75 50 L45 80 L15 50 Z" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
          <polygon points="45,32 63,50 45,68 27,50" fill="url(#goldGrad)" opacity="0.9" />
          <circle cx="45" cy="50" r="6" fill="#FFFFFF" />
          
          <text x="95" y="52" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="url(#goldGrad)" letter-spacing="2">STUDIO</text>
          <text x="96" y="74" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" fill="#F8FAFC" letter-spacing="4">OFFICIAL BRAND</text>
        </g>
      </svg>
    `),
    previewColor: '#eab308'
  },
  {
    id: 'arabic-signature',
    name: 'Arabic Calligraphy Logo',
    nameAr: 'شعار توقيع عربي',
    type: 'preset',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" width="320" height="120">
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="100%" stop-color="#0284C7" />
          </linearGradient>
          <filter id="shadowArabic" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/>
          </filter>
        </defs>
        <g filter="url(#shadowArabic)">
          <circle cx="50" cy="50" r="32" fill="none" stroke="url(#cyanGrad)" stroke-width="3" stroke-dasharray="8 4" />
          <path d="M35 50 Q50 30 65 50 Q50 70 35 50" fill="url(#cyanGrad)" />
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          
          <text x="100" y="52" font-family="'Cairo', system-ui, sans-serif" font-weight="800" font-size="24" fill="#FFFFFF">العلامة الرسمية</text>
          <text x="102" y="72" font-family="'Cairo', system-ui, sans-serif" font-weight="600" font-size="12" fill="#38BDF8">حقوق النشر محفوظة ©</text>
        </g>
      </svg>
    `),
    previewColor: '#0284c7'
  },
  {
    id: 'minimal-white',
    name: 'Minimal Clean White',
    nameAr: 'شعار أبيض ناصع أنيق',
    type: 'preset',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
        <defs>
          <filter id="strongShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>
        <g filter="url(#strongShadow)">
          <rect x="15" y="20" width="45" height="45" rx="10" fill="none" stroke="#FFFFFF" stroke-width="3.5" />
          <circle cx="37.5" cy="42.5" r="9" fill="#FFFFFF" />
          <text x="75" y="47" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" letter-spacing="3">PHOTOGRAPHY</text>
          <text x="77" y="62" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="10" fill="#E2E8F0" letter-spacing="5">ALL RIGHTS RESERVED</text>
        </g>
      </svg>
    `),
    previewColor: '#ffffff'
  },
  {
    id: 'badge-emblem',
    name: 'Modern Circular Badge',
    nameAr: 'ختم دائري حديث',
    type: 'preset',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.75"/>
          </filter>
        </defs>
        <g filter="url(#badgeShadow)">
          <circle cx="80" cy="80" r="68" fill="#0F172A" stroke="#38BDF8" stroke-width="4" opacity="0.9" />
          <circle cx="80" cy="80" r="56" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4 4" />
          <polygon points="80,42 90,65 114,66 94,80 102,103 80,88 58,103 66,80 46,66 70,65" fill="#38BDF8" />
          <text x="80" y="125" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">ORIGINAL</text>
        </g>
      </svg>
    `),
    previewColor: '#38bdf8'
  },
  {
    id: 'media-creator',
    name: 'Creator & Reels Logo',
    nameAr: 'شعار صناع المحتوى وريلز',
    type: 'preset',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 90" width="280" height="90">
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E" />
            <stop offset="50%" stop-color="#A855F7" />
            <stop offset="100%" stop-color="#6366F1" />
          </linearGradient>
          <filter id="creatorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.7"/>
          </filter>
        </defs>
        <g filter="url(#creatorGlow)">
          <rect x="15" y="15" width="50" height="50" rx="14" fill="url(#purpleGrad)" />
          <polygon points="36,30 50,40 36,50" fill="#FFFFFF" />
          <text x="80" y="44" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#FFFFFF" letter-spacing="1">CREATOR</text>
          <text x="82" y="60" font-family="'Cairo', system-ui, sans-serif" font-weight="700" font-size="11" fill="#F43F5E">محتوى حصري</text>
        </g>
      </svg>
    `),
    previewColor: '#ec4899'
  }
];

export const DEFAULT_RATIO_RULES: RatioRulesMap = {
  '3:4': {
    position: 'bottom-right',
    sizePercent: 20, // 20% of image width
    marginPercent: 4, // 4% padding from corners
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  },
  '4:3': {
    position: 'bottom-right',
    sizePercent: 18,
    marginPercent: 4,
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  },
  '1:1': {
    position: 'bottom-right',
    sizePercent: 19,
    marginPercent: 4,
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  },
  '9:16': {
    position: 'bottom-center',
    sizePercent: 22,
    marginPercent: 7, // Kept higher so it avoids story bottom UI buttons
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  },
  '16:9': {
    position: 'bottom-right',
    sizePercent: 16,
    marginPercent: 4,
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  },
  'custom': {
    position: 'bottom-right',
    sizePercent: 18,
    marginPercent: 4,
    opacity: 0.95,
    rotation: 0,
    hasShadow: true,
  }
};

export const RATIO_INFO: Record<AspectRatioType, { labelAr: string; labelEn: string; descAr: string; icon: string; targetRatio: number }> = {
  '3:4': {
    labelAr: '3:4 (طولي / بورتريه)',
    labelEn: '3:4 Portrait',
    descAr: 'الصور العمودية، الكاميرا العادية وبورتريه إنستغرام',
    icon: 'Smartphone',
    targetRatio: 0.75
  },
  '4:3': {
    labelAr: '4:3 (عرضي / أفقي)',
    labelEn: '4:3 Landscape',
    descAr: 'الصور الأفقية العادية والكاميرات الرقمية',
    icon: 'Maximize2',
    targetRatio: 1.333
  },
  '1:1': {
    labelAr: '1:1 (مربع)',
    labelEn: '1:1 Square',
    descAr: 'منشورات إنستغرام وتويتر المربعة',
    icon: 'Square',
    targetRatio: 1.0
  },
  '9:16': {
    labelAr: '9:16 (ستوري / ريلز / تيك توك)',
    labelEn: '9:16 Story/Reels',
    descAr: 'فيديوهات وقصص الهاتف الرأسية الكاملة',
    icon: 'Film',
    targetRatio: 0.5625
  },
  '16:9': {
    labelAr: '16:9 (شاشة عريضة / يوتيوب)',
    labelEn: '16:9 Widescreen',
    descAr: 'شاشات العرض والفيديوهات الأفقية',
    icon: 'Tv',
    targetRatio: 1.777
  },
  'custom': {
    labelAr: 'أبعاد مخصصة',
    labelEn: 'Custom Ratio',
    descAr: 'أي أبعاد أخرى غير قياسية',
    icon: 'Crop',
    targetRatio: 1.0
  }
};

// 10 built-in sample test images in different aspect ratios (3:4, 4:3, 1:1, 16:9, 9:16)
export interface SampleImageData {
  id: string;
  name: string;
  nameAr: string;
  width: number;
  height: number;
  svg: string;
}

export const SAMPLE_TEST_IMAGES: SampleImageData[] = [
  // 3:4 Portrait images (Width: 600, Height: 800)
  {
    id: 'sample-34-1',
    name: 'nature-portrait-1.jpg',
    nameAr: 'صورة طبيعية طولية 3:4',
    width: 600,
    height: 800,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
        <defs>
          <linearGradient id="skyGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284C7" />
            <stop offset="60%" stop-color="#38BDF8" />
            <stop offset="100%" stop-color="#FDE047" />
          </linearGradient>
          <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#skyGrad1)" />
        <circle cx="450" cy="220" r="70" fill="#FEF08A" opacity="0.9" />
        <polygon points="0,520 220,320 420,560 600,380 600,800 0,800" fill="url(#mountainGrad1)" />
        <polygon points="120,800 320,460 520,800" fill="#047857" opacity="0.8" />
        <text x="50" y="70" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 3:4 - صورة طولية</text>
        <text x="50" y="105" font-family="sans-serif" font-size="18" fill="#E0F2FE">600 x 800 px (3:4 Portrait)</text>
      </svg>
    `
  },
  {
    id: 'sample-34-2',
    name: 'architecture-portrait-2.jpg',
    nameAr: 'صورة معمارية طولية 3:4',
    width: 600,
    height: 800,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
        <defs>
          <linearGradient id="archGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4F46E5" />
            <stop offset="50%" stop-color="#9333EA" />
            <stop offset="100%" stop-color="#E11D48" />
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#archGrad)" />
        <rect x="80" y="150" width="440" height="580" rx="20" fill="#0F172A" opacity="0.75" />
        <line x1="80" y1="280" x2="520" y2="280" stroke="#CBD5E1" stroke-width="2" opacity="0.5" />
        <line x1="80" y1="440" x2="520" y2="440" stroke="#CBD5E1" stroke-width="2" opacity="0.5" />
        <line x1="80" y1="600" x2="520" y2="600" stroke="#CBD5E1" stroke-width="2" opacity="0.5" />
        <text x="50" y="70" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 3:4 - معمار حديث</text>
        <text x="50" y="105" font-family="sans-serif" font-size="18" fill="#FCE7F3">600 x 800 px (3:4 Portrait)</text>
      </svg>
    `
  },

  // 4:3 Landscape images (Width: 800, Height: 600)
  {
    id: 'sample-43-1',
    name: 'landscape-lake-1.jpg',
    nameAr: 'صورة أفقية منظر طبيعي 4:3',
    width: 800,
    height: 600,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#EA580C" />
            <stop offset="40%" stop-color="#F59E0B" />
            <stop offset="70%" stop-color="#0284C7" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sunsetGrad)" />
        <circle cx="400" cy="220" r="60" fill="#FEF3C7" />
        <path d="M0 380 Q 200 320 400 370 T 800 360 L 800 600 L 0 600 Z" fill="#064E3B" />
        <path d="M0 450 Q 300 420 600 460 T 800 440 L 800 600 L 0 600 Z" fill="#022C22" />
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 4:3 - منظر أفقي للغروب</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#FEF3C7">800 x 600 px (4:3 Landscape)</text>
      </svg>
    `
  },
  {
    id: 'sample-43-2',
    name: 'office-landscape-2.jpg',
    nameAr: 'صورة مكتبية عرضية 4:3',
    width: 800,
    height: 600,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="officeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#334155" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#officeGrad)" />
        <rect x="60" y="140" width="680" height="380" rx="16" fill="#0F172A" stroke="#64748B" stroke-width="3" />
        <circle cx="200" cy="330" r="70" fill="#3B82F6" opacity="0.6" />
        <rect x="360" y="260" width="300" height="40" rx="8" fill="#60A5FA" />
        <rect x="360" y="320" width="220" height="30" rx="8" fill="#94A3B8" />
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 4:3 - صورة عمل ومكتب</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#93C5FD">800 x 600 px (4:3 Landscape)</text>
      </svg>
    `
  },

  // 1:1 Square images (Width: 700, Height: 700)
  {
    id: 'sample-11-1',
    name: 'product-square-1.jpg',
    nameAr: 'صورة منتج مربعة 1:1',
    width: 700,
    height: 700,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700">
        <defs>
          <radialGradient id="productRad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F1F5F9" />
            <stop offset="100%" stop-color="#94A3B8" />
          </radialGradient>
        </defs>
        <rect width="700" height="700" fill="url(#productRad)" />
        <circle cx="350" cy="350" r="180" fill="#0F172A" />
        <circle cx="350" cy="350" r="140" fill="none" stroke="#E2E8F0" stroke-width="8" />
        <text x="350" y="365" font-family="sans-serif" font-weight="bold" font-size="44" fill="#FFFFFF" text-anchor="middle">PRODUCT</text>
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#0F172A">عينة 1:1 - صورة منتج مربعة</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#334155">700 x 700 px (1:1 Square)</text>
      </svg>
    `
  },
  {
    id: 'sample-11-2',
    name: 'fashion-square-2.jpg',
    nameAr: 'صورة أزياء مربعة 1:1',
    width: 700,
    height: 700,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700">
        <defs>
          <linearGradient id="fashionGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#EC4899" />
            <stop offset="100%" stop-color="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="700" height="700" fill="url(#fashionGrad)" />
        <polygon points="350,150 550,550 150,550" fill="#FFFFFF" opacity="0.2" />
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 1:1 - تصميم أزياء</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#FDF2F8">700 x 700 px (1:1 Square)</text>
      </svg>
    `
  },

  // 16:9 Widescreen images (Width: 960, Height: 540)
  {
    id: 'sample-169-1',
    name: 'video-thumb-16-9.jpg',
    nameAr: 'صورة شاشة عريضة 16:9 يوتيوب',
    width: 960,
    height: 540,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
        <defs>
          <linearGradient id="ytGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#1E1B4B" />
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#ytGrad)" />
        <circle cx="480" cy="270" r="100" fill="#DC2626" opacity="0.85" />
        <polygon points="450,220 540,270 450,320" fill="#FFFFFF" />
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 16:9 - غلاف فيديو عريض</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#FCA5A5">960 x 540 px (16:9 Widescreen)</text>
      </svg>
    `
  },
  {
    id: 'sample-169-2',
    name: 'banner-web-16-9.jpg',
    nameAr: 'صورة بانر ويب 16:9',
    width: 960,
    height: 540,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
        <defs>
          <linearGradient id="bannerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0D9488" />
            <stop offset="100%" stop-color="#065F46" />
          </linearGradient>
        </defs>
        <rect width="960" height="540" fill="url(#bannerGrad)" />
        <text x="50" y="65" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 16:9 - بانر تسويقي</text>
        <text x="50" y="100" font-family="sans-serif" font-size="18" fill="#CCFBF1">960 x 540 px (16:9 Banner)</text>
      </svg>
    `
  },

  // 9:16 Vertical Story/Reels (Width: 540, Height: 960)
  {
    id: 'sample-916-1',
    name: 'story-reels-9-16.jpg',
    nameAr: 'صورة ستوري وريلز 9:16',
    width: 540,
    height: 960,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="540" height="960">
        <defs>
          <linearGradient id="storyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#833AB4" />
            <stop offset="50%" stop-color="#FD1D1D" />
            <stop offset="100%" stop-color="#FCB045" />
          </linearGradient>
        </defs>
        <rect width="540" height="960" fill="url(#storyGrad)" />
        <circle cx="270" cy="480" r="120" fill="#FFFFFF" opacity="0.25" />
        <text x="40" y="80" font-family="'Cairo', sans-serif" font-weight="bold" font-size="26" fill="#FFFFFF">عينة 9:16 - ستوري / ريلز</text>
        <text x="40" y="115" font-family="sans-serif" font-size="16" fill="#FEF08A">540 x 960 px (9:16 Full Vertical)</text>
      </svg>
    `
  },
  {
    id: 'sample-34-3',
    name: 'portrait-travel-3.jpg',
    nameAr: 'صورة سفر طولية 3:4',
    width: 600,
    height: 800,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
        <defs>
          <linearGradient id="travelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="50%" stop-color="#0284C7" />
            <stop offset="100%" stop-color="#4F46E5" />
          </linearGradient>
        </defs>
        <rect width="600" height="800" fill="url(#travelGrad)" />
        <circle cx="300" cy="350" r="100" fill="#FDE68A" opacity="0.8" />
        <text x="50" y="70" font-family="'Cairo', sans-serif" font-weight="bold" font-size="28" fill="#FFFFFF">عينة 3:4 - تصوير رحلات</text>
        <text x="50" y="105" font-family="sans-serif" font-size="18" fill="#E0F2FE">600 x 800 px (3:4 Portrait)</text>
      </svg>
    `
  }
];
