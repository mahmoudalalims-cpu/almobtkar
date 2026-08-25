import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  Globe,
  Copy,
  QrCode,
  FileCode2,
  Share2,
  Check
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.href);

      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      // Show hint for Chrome / mobile browser
      alert(
        isAr 
          ? 'لتثبيت التطبيق على هاتفك: اضغط على زر القائمة (⋮) في متصفح كروم ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"'
          : 'To install on Android: Tap Chrome menu (⋮) and select "Install app" or "Add to Home screen"'
      );
    }
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const openPwaBuilder = () => {
    const pwaUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(window.location.origin)}`;
    window.open(pwaUrl, '_blank');
  };

  const downloadAndroidProjectZip = async () => {
    try {
      setIsGeneratingZip(true);
      const zip = new JSZip();

      // AndroidManifest.xml
      const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.watermarkpro.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:theme="@style/Theme.AppCompat.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

      // MainActivity.java
      const mainActivityJava = `package com.watermarkpro.app;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("${appUrl}");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;

      // build.gradle (app level)
      const buildGradle = `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.watermarkpro.app'
    compileSdk 34

    defaultConfig {
        applicationId "com.watermarkpro.app"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
}`;

      // strings.xml
      const stringsXml = `<resources>
    <string name="app_name">Watermark Pro</string>
</resources>`;

      // README
      const readmeText = `=== Watermark Pro Android APK Project Package ===

طرق بناء ملف الـ APK:
1. الطريقة المباشرة (أونلاين بضغطة زر):
   - استخدم موقع PWABuilder (https://www.pwabuilder.com) وضع رابط تطبيقك: ${appUrl}
   - اضغط "Package for Android" لتحميل ملف APK جاهز للتثبيت فوراً.

2. عبر Android Studio (محلياً):
   - افتح هذا المجلد في Android Studio.
   - اضغط على Build > Build Bundle(s) / APK(s) > Build APK(s).
   - ستجد ملف الـ APK جاهزاً في مجلد app/build/outputs/apk/debug/app-debug.apk`;

      zip.file("app/src/main/AndroidManifest.xml", manifestXml);
      zip.file("app/src/main/java/com/watermarkpro/app/MainActivity.java", mainActivityJava);
      zip.file("app/build.gradle", buildGradle);
      zip.file("app/src/main/res/values/strings.xml", stringsXml);
      zip.file("README-BUILD-APK.txt", readmeText);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "WatermarkPro-Android-Project.zip");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Generate QR Code URL via public SVG QR API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&bgcolor=000000&color=2563eb&margin=1`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-black/95 border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.25)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {isAr ? 'مركز تحويل وتنزيل تطبيق الأندرويد (APK / WebAPK)' : 'Android APK & Mobile Download Hub'}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Android Ready
                </span>
              </h3>
              <p className="text-xs text-white/50">
                {isAr 
                  ? 'ثبّت التطبيق مباشرة على هاتفك أو حمّل حزمة ملف APK جاهزة' 
                  : 'Install standalone directly on your Android or export native APK package'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          
          {/* Main 3 Action Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Option 1: 1-Click Install WebAPK */}
            <div className="bg-white/5 border border-blue-500/40 rounded-2xl p-4.5 flex flex-col justify-between shadow-[0_0_20px_rgba(37,99,235,0.15)] relative overflow-hidden group">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'تثبيت فوري على الهاتف (WebAPK)' : 'Direct Android Install (WebAPK)'}
                </h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  {isAr 
                    ? 'يعمل كتطبيق أصلي مثبت على الشاشة الرئيسية بدون إطار المتصفح وبأقصى سرعة معالجة للصور.' 
                    : 'Installs as a native standalone app with full GPU acceleration on Android.'}
                </p>
              </div>

              <button
                onClick={handleNativeInstall}
                className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isAr ? 'تثبيت الآن على الهاتف' : 'Install on Android'}</span>
              </button>
            </div>

            {/* Option 2: Microsoft PWABuilder Standalone .APK Generator */}
            <div className="bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-4.5 flex flex-col justify-between transition-all group">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'توليد ملف APK أونلاين (PWABuilder)' : '1-Click Online APK Generator'}
                </h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  {isAr 
                    ? 'يقوم موقع Microsoft PWABuilder بتحويل الرابط إلى ملف .apk موقّع وجاهز للتنزيل المباشر والتثبيت.' 
                    : 'Use Microsoft PWABuilder to instantly package this app URL into a downloadable .apk file.'}
                </p>
              </div>

              <button
                onClick={openPwaBuilder}
                className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-blue-300 border border-blue-500/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>{isAr ? 'فتح مولّد APK المباشر' : 'Open APK Builder'}</span>
              </button>
            </div>

            {/* Option 3: Download Android Studio Source Project ZIP */}
            <div className="bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-4.5 flex flex-col justify-between transition-all group">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'تنزيل حزمة مشروع أندرويد (ZIP)' : 'Download Android Source (ZIP)'}
                </h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  {isAr 
                    ? 'تحميل حزمة الكود مع AndroidManifest و gradle لبناء ملف الـ APK في Android Studio.' 
                    : 'Download complete Android project skeleton to compile APK in Android Studio.'}
                </p>
              </div>

              <button
                onClick={downloadAndroidProjectZip}
                disabled={isGeneratingZip}
                className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>{isGeneratingZip ? (isAr ? 'جاري تجهيز ZIP...' : 'Packing...') : (isAr ? 'تنزيل حزمة المشروع ZIP' : 'Download Project ZIP')}</span>
              </button>
            </div>

          </div>

          {/* QR Code & Share link section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-32 h-32 bg-black rounded-xl p-2 border border-white/15 shrink-0 flex items-center justify-center shadow-lg">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-full h-full object-contain rounded-lg invert brightness-150"
              />
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-white text-sm">
                  {isAr ? 'امسح رمز الاستجابة السريعة (QR) بكاميرا هاتفك' : 'Scan QR with Android Camera'}
                </h4>
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                {isAr 
                  ? 'وجه كاميرا هاتفك الأندرويد نحو الرمز لفتح التطبيق وتثبيته فوراً كـ APK.' 
                  : 'Point your mobile camera at this QR code to launch and install on your phone.'}
              </p>

              {/* URL bar & Copy button */}
              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="text" 
                  readOnly 
                  value={appUrl} 
                  className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white/70 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={copyShareLink}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick steps for Chrome Android */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? 'خطوات التثبيت المباشر على جميع هواتف أندرويد (Samsung, Xiaomi, Pixel, Huawei)' : 'Universal Android Installation Steps'}</span>
            </h5>
            <ol className="list-decimal list-inside text-xs text-white/70 space-y-1 leading-relaxed">
              <li>{isAr ? 'افتح رابط التطبيق في متصفح Google Chrome على الهاتف.' : 'Open the app link in Google Chrome on your device.'}</li>
              <li>{isAr ? 'اضغط على زر القائمة (⋮) أعلى زاوية المتصفح.' : 'Tap the Chrome menu (⋮) at the top corner.'}</li>
              <li>{isAr ? 'اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).' : 'Select "Install app" or "Add to Home screen".'}</li>
              <li>{isAr ? 'سيعمل التطبيق كبرنامج أصلي مستقل يدعم معالجة الصور بدون إنترنت وبسرعة فائقة.' : 'The app will launch full-screen as a standalone native app.'}</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] text-white/40 hidden sm:block">
            {isAr ? 'يدعم أندرويد 8.0 فما فوق مع المعالجة الرسومية الكاملة' : 'Supports Android 8.0+ with full GPU acceleration'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer active:scale-95 ml-auto"
          >
            {isAr ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
