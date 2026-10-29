import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Package,
  Sparkles,
  Share2,
  FolderDown,
  Globe
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface ApkInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallGuideModal: React.FC<ApkInstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'adb'>('pwa');
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {language === 'hindi' 
                  ? 'Phone Mein App Kaise Download & Install Karein' 
                  : 'How to Download & Install App on Phone'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hindi' 
                  ? 'Mr Khan Video Sharing App ko apne Android phone mein chalane ka aasan tareeqa' 
                  : 'Complete guide for installing on Android device & Chrome'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'hindi' ? 'English' : 'हिंदी / Hinglish'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mt-4 pb-3 border-b border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'pwa' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hindi' ? 'Tareeqa 1: 1-Click Phone Install (Sabse Aasan)' : 'Method 1: Instant Phone Install (PWA)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'apk' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === 'hindi' ? 'Tareeqa 2: Android APK File Install' : 'Method 2: Android APK File'}</span>
          </button>
          <button
            onClick={() => setActiveTab('adb')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'adb' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{language === 'hindi' ? 'Tareeqa 3: PC / ADB Command' : 'Method 3: ADB Terminal'}</span>
          </button>
        </div>

        {/* Tab 1: Instant Chrome/PWA Install on Phone */}
        {activeTab === 'pwa' && (
          <div className="py-4 space-y-4 text-xs text-slate-300">
            {language === 'hindi' ? (
              <>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-1">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Bina kisi computer ke direct phone mein app install karein!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Aap is web application ko apne Android phone ke Google Chrome browser se 10 second mein install kar sakte hain. Yeh aapke phone ki home screen par ek regular Android app ki tarah icon banayega!
                  </p>
                  
                  {isInstallable && (
                    <button
                      onClick={install}
                      className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Phone Mein Abhi Install Karein</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="font-semibold text-white">Phone ke Google Chrome mein link kholein</div>
                      <p className="text-slate-400 mt-0.5">
                        Apne phone ke Chrome browser mein is URL ko open karein.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-white">Chrome Menu (3 Dots ⋮) par click karein</div>
                      <p className="text-slate-400 mt-0.5">
                        Screen ke top-right corner par 3 vertical dots <strong>(⋮)</strong> par tap karein.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="font-semibold text-white">"Install app" ya "Add to Home screen" par tap karein</div>
                      <p className="text-slate-400 mt-0.5">
                        Menu mein <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par dabayein. Phone screen par <strong>"Mr Khan"</strong> app icon aa jayega aur yeh standalone native app ki tarah chalega!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-1">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Install directly on your phone without Android Studio or PC!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    You can install this app in 10 seconds via Google Chrome on Android. It installs as a native WebAPK with full offline support and home screen icon.
                  </p>
                  {isInstallable && (
                    <button
                      onClick={install}
                      className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install on Device Now</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="font-semibold text-white">Open in Android Chrome</div>
                      <p className="text-slate-400">Open the app URL in Google Chrome on your phone.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-white">Tap Menu (⋮) &gt; Install App</div>
                      <p className="text-slate-400">Select "Install app" or "Add to Home screen" to install instantly.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Android Studio APK File Install */}
        {activeTab === 'apk' && (
          <div className="py-4 space-y-4 text-xs text-slate-300">
            {language === 'hindi' ? (
              <>
                <p className="text-slate-300">
                  Agar aap pure <strong>Android Studio APK (.apk file)</strong> apne phone mein dalna chahte hain:
                </p>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-white">Project ZIP Download karein</div>
                    <p className="text-slate-400">
                      Code Studio tab mein <strong>"Download Project (.zip)"</strong> par click karein.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-white">Android Studio mein APK compile karein</div>
                    <p className="text-slate-400">
                      Folder ko Android Studio mein open karein aur yeh command chalayein:
                    </p>
                    <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800">
                      <span>./gradlew assembleDebug</span>
                      <button onClick={() => copyToClipboard('./gradlew assembleDebug', 'cmd-build-apk')} className="p-1 hover:text-white">
                        {copiedCmd === 'cmd-build-apk' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-white">Phone ke Downloads folder mein copy karein</div>
                    <p className="text-slate-400">
                      Generated APK yahan milegi:
                    </p>
                    <div className="p-2 bg-slate-900 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800">
                      app/build/outputs/apk/debug/app-debug.apk
                    </div>
                    <p className="text-slate-400 mt-1">
                      Ise phone ke <code className="text-white">/storage/emulated/0/Download/</code> folder mein copy karein.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="space-y-1 w-full">
                    <div className="font-semibold text-white">Phone mein "Install" dabayein</div>
                    <p className="text-slate-400">
                      Phone ke Files / Downloads app mein jakar <strong className="text-white">app-debug.apk</strong> par tap karein. Agar phone puche: <em>"Allow from this source"</em> (Unknown Sources) ko ON karein aur <strong>Install</strong> dabayein!
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-300">Steps to compile and install native APK file:</p>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-semibold text-white mb-1">1. Build Debug APK</div>
                    <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-400">./gradlew assembleDebug</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-semibold text-white mb-1">2. Locate Output APK</div>
                    <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-300">app/build/outputs/apk/debug/app-debug.apk</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="font-semibold text-white mb-1">3. Install on Phone</div>
                    <p className="text-slate-400">Transfer to <code className="text-white">/storage/emulated/0/Download/</code>, open in File Manager, enable "Allow from this source", and tap Install.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 3: ADB Terminal */}
        {activeTab === 'adb' && (
          <div className="py-4 space-y-4 text-xs text-slate-300">
            <p className="text-slate-400">
              {language === 'hindi'
                ? 'Agar phone computer se USB cable se juda hai:'
                : 'Direct command line installation for connected USB device:'}
            </p>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-white">1. Direct USB install:</div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800">
                <span>adb install -r app/build/outputs/apk/debug/app-debug.apk</span>
                <button onClick={() => copyToClipboard('adb install -r app/build/outputs/apk/debug/app-debug.apk', 'cmd-adb-1')} className="p-1 hover:text-white">
                  {copiedCmd === 'cmd-adb-1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-white">2. Build & Launch in One Go:</div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800">
                <span>./gradlew installDebug</span>
                <button onClick={() => copyToClipboard('./gradlew installDebug', 'cmd-adb-2')} className="p-1 hover:text-white">
                  {copiedCmd === 'cmd-adb-2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Play Store verified package</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            {language === 'hindi' ? 'Samajh Aa Gaya / Close' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
