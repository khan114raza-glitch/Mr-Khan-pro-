import React, { useState } from 'react';
import { 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Play, 
  FolderTree, 
  Terminal, 
  Send, 
  Sparkles,
  Archive,
  AlertTriangle,
  WifiOff,
  Clock,
  ShieldAlert,
  ServerCrash,
  RefreshCw,
  Package
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, ProjectFile } from '../../data/androidProjectFiles';
import { ApkInstallGuideModal } from '../apk/ApkInstallGuideModal';

export const AndroidCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [showApkGuide, setShowApkGuide] = useState<boolean>(false);

  // API Tester & Error Simulator State
  const [requestMode, setRequestMode] = useState<'success' | 'error_simulation'>('error_simulation');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('getHomeFeed');
  const [simulatedErrorType, setSimulatedErrorType] = useState<string>('NO_CONNECTIVITY');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Add all project files into the zip with their folder structure
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add Gradle wrapper and root files
      zip.file('settings.gradle.kts', `rootProject.name = "MrKhanVideo"\ninclude(":app")`);
      zip.file('build.gradle.kts', `plugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n    alias(libs.plugins.hilt.android) apply false\n}`);
      zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nkotlin.code.style=official`);
      zip.file('README.md', `# Mr Khan Video Sharing Platform - Android (Kotlin + Jetpack Compose)

Production-ready video sharing application built for Google Play Store.

## Architecture
- Clean Architecture + MVVM
- Jetpack Compose with Material 3 dynamic theming
- Media3 ExoPlayer with adaptive bitrate streaming & ambient lighting
- Comprehensive Error Handling (NetworkConnectivityInterceptor, ApiExceptionMapper, safeApiCall)
- Hilt Dependency Injection
- Room Database for offline video caching
- Retrofit 2 REST Client (MrKhanApiService.kt)

## Compilation & Installation Instructions
1. Open this folder in Android Studio Ladybug or newer.
2. Build Debug APK:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
3. Install directly to connected Android phone via ADB:
   \`\`\`bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   \`\`\`
4. Build signed Google Play Release bundle:
   \`\`\`bash
   ./gradlew bundleRelease
   \`\`\`

Created for khan114raza@gmail.com
`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MrKhan-Android-Studio-JetpackCompose-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleExecuteRequest = () => {
    setIsRequesting(true);
    setApiResponse(null);

    setTimeout(() => {
      let result: any = {};

      if (requestMode === 'success') {
        result = {
          networkResult: 'NetworkResult.Success',
          status: 'SUCCESS',
          httpCode: 200,
          data: {
            endpoint: selectedEndpoint,
            message: 'Endpoint executed successfully with 200 OK',
            timestamp: new Date().toISOString()
          }
        };
      } else {
        // Error simulation based on user choice
        switch (simulatedErrorType) {
          case 'NO_CONNECTIVITY':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'NO_CONNECTIVITY',
              httpCode: null,
              rawException: 'java.net.UnknownHostException: Unable to resolve host "api.mrkhanvideo.com"',
              interceptorTriggered: 'NetworkConnectivityInterceptor (pre-flight check failed)',
              userFriendlyMessage: 'No internet connection. Please connect to Wi-Fi or cellular data.',
              fallbackAction: 'Repository automatically switches to Room Database offline cache'
            };
            break;

          case 'TIMEOUT':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'TIMEOUT',
              httpCode: 408,
              rawException: 'java.net.SocketTimeoutException: Connection timeout after 30000ms',
              userFriendlyMessage: 'Connection timed out. Your network connection appears slow. Please try again.',
              canRetry: true
            };
            break;

          case 'NOT_FOUND_404':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'NOT_FOUND_404',
              httpCode: 404,
              rawException: 'retrofit2.HttpException: HTTP 404 Not Found',
              userFriendlyMessage: 'Video not found. This video or channel may have been removed or made private.',
              canRetry: false
            };
            break;

          case 'SERVER_ERROR_500':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'SERVER_ERROR_500',
              httpCode: 500,
              rawException: 'retrofit2.HttpException: HTTP 500 Internal Server Error',
              userFriendlyMessage: 'Mr Khan servers encountered an unexpected issue. Our engineers are investigating.',
              canRetry: true,
              fallbackAction: 'Serving cached Room entities with error banner'
            };
            break;

          case 'UNAUTHORIZED_401':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'UNAUTHORIZED_401',
              httpCode: 401,
              rawException: 'retrofit2.HttpException: HTTP 401 Unauthorized',
              userFriendlyMessage: 'Your session has expired. Please sign in to your Mr Khan account to continue.',
              canRetry: false,
              navigationTarget: 'AuthActivity / LoginDialog'
            };
            break;

          case 'FORBIDDEN_403':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'FORBIDDEN_403',
              httpCode: 403,
              rawException: 'retrofit2.HttpException: HTTP 403 Forbidden',
              userFriendlyMessage: 'Access restricted. You do not have permission to view this video or perform this action.',
              canRetry: false
            };
            break;

          case 'RATE_LIMITED_429':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'RATE_LIMITED_429',
              httpCode: 429,
              rawException: 'retrofit2.HttpException: HTTP 429 Too Many Requests',
              userFriendlyMessage: 'High traffic detected. Please slow down and try again in a few moments.',
              retryAfterSeconds: 30
            };
            break;

          case 'SERVICE_UNAVAILABLE_503':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'SERVICE_UNAVAILABLE_503',
              httpCode: 503,
              rawException: 'retrofit2.HttpException: HTTP 503 Service Unavailable',
              userFriendlyMessage: 'Mr Khan Video Platform is undergoing brief scheduled maintenance. Back online shortly!',
              canRetry: true
            };
            break;

          case 'DESERIALIZATION_ERROR':
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'DESERIALIZATION_ERROR',
              httpCode: 200,
              rawException: 'com.google.gson.JsonSyntaxException: Expected BEGIN_ARRAY but was STRING',
              userFriendlyMessage: 'Unable to load video data due to an unexpected format. Please update the Mr Khan app.',
              canRetry: false
            };
            break;

          default:
            result = {
              networkResult: 'NetworkResult.Error',
              errorType: 'GENERIC_EXCEPTION',
              httpCode: null,
              rawException: 'java.io.IOException: Unexpected network reset',
              userFriendlyMessage: 'An unexpected error occurred. Please check your connection and retry.',
              canRetry: true
            };
        }
      }

      setApiResponse(result);
      setIsRequesting(false);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Banner with Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500 font-bold tracking-wide text-xs">ANDROID ARCHITECTURE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs font-mono">Error Handling + APK Packaging</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Android Studio Code Studio & Error Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Production-ready Android code for <span className="text-slate-200 font-medium">Mr Khan Video Sharing Platform</span>. 
              Featuring comprehensive error handling (<span className="text-red-400 font-mono">ErrorHandler.kt</span>, <span className="text-red-400 font-mono">NetworkResult.kt</span>, <span className="text-red-400 font-mono">MrKhanApiService.kt</span>) 
              with specific checks for network connectivity, server error codes (404, 500), and user-friendly messages.
            </p>
          </div>

          {/* Action Buttons: APK Install Guide & Project Export */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowApkGuide(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Package className="w-4 h-4" />
              <span>Install APK Guide</span>
            </button>

            <button
              onClick={handleDownloadSingleFile}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700/80 shadow-sm"
              title="Download currently selected file"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Download {selectedFile.name}</span>
            </button>

            <button
              onClick={handleExportZip}
              disabled={isExportingZip}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Archive className="w-4 h-4" />
              <span>{isExportingZip ? 'Creating ZIP...' : 'Download Project (.zip)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: File Tree & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Project Files Directory Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pb-3 border-b border-slate-800 mb-3">
              <FolderTree className="w-4 h-4 text-red-500" />
              <span>Project Architecture & Error Handlers</span>
            </div>

            <div className="space-y-1.5">
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-red-500/10 border border-red-500/30 text-white'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-red-400' : 'text-slate-500'}`} />
                    <div className="min-w-0">
                      <div className={`text-xs font-medium truncate ${isSelected ? 'font-semibold text-red-300' : ''}`}>
                        {file.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {file.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick APK Installation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>APK Install Commands</span>
              </div>
              <button 
                onClick={() => setShowApkGuide(true)}
                className="text-[11px] text-red-400 hover:underline"
              >
                View Full Guide
              </button>
            </div>
            <div className="space-y-2.5 font-mono text-[11px]">
              <div>
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Build Debug APK</div>
                <div className="p-2 bg-slate-950 rounded-lg text-emerald-400 select-all border border-slate-800/80">
                  ./gradlew assembleDebug
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Install to Phone via USB</div>
                <div className="p-2 bg-slate-950 rounded-lg text-amber-300 select-all border border-slate-800/80 truncate">
                  adb install -r app/build/outputs/apk/debug/app-debug.apk
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer + Comprehensive Error Simulator */}
        <div className="lg:col-span-8 space-y-6">
          {/* Code Viewer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-red-400" />
                <span className="font-mono text-xs text-slate-200">{selectedFile.path}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto max-h-[460px] bg-[#0b0f19] text-slate-200 font-mono text-xs leading-relaxed">
              <pre className="select-text whitespace-pre">
                {selectedFile.content}
              </pre>
            </div>
          </div>

          {/* Interactive Error Handling & API Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Error Handling & Resilience Tester</h3>
              </div>
              
              {/* Mode switch: Success vs Error Simulation */}
              <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setRequestMode('success')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    requestMode === 'success' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  Success (200)
                </button>
                <button
                  onClick={() => setRequestMode('error_simulation')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    requestMode === 'error_simulation' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400'
                  }`}
                >
                  Simulate Error
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
              <div className="sm:col-span-5">
                <label className="block text-[11px] text-slate-400 font-medium mb-1">Target Retrofit Call</label>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="getHomeFeed">apiService.getHomeFeed()</option>
                  <option value="getVideoDetails">apiService.getVideoDetails("vid-404")</option>
                  <option value="getStreamingManifest">apiService.getStreamingManifest()</option>
                  <option value="uploadVideo">apiService.uploadVideo()</option>
                </select>
              </div>

              {requestMode === 'error_simulation' && (
                <div className="sm:col-span-4">
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Error Condition Check</label>
                  <select
                    value={simulatedErrorType}
                    onChange={(e) => setSimulatedErrorType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="NO_CONNECTIVITY">📶 Network: No Connectivity (Offline)</option>
                    <option value="TIMEOUT">⏳ Network: SocketTimeoutException (Slow)</option>
                    <option value="NOT_FOUND_404">🚫 Server: 404 Video Not Found</option>
                    <option value="SERVER_ERROR_500">💥 Server: 500 Internal Server Crash</option>
                    <option value="UNAUTHORIZED_401">🔒 Server: 401 Session Expired</option>
                    <option value="FORBIDDEN_403">⛔ Server: 403 Forbidden Access</option>
                    <option value="RATE_LIMITED_429">⚠️ Server: 429 Rate Limit Exceeded</option>
                    <option value="SERVICE_UNAVAILABLE_503">🔧 Server: 503 Maintenance Mode</option>
                    <option value="DESERIALIZATION_ERROR">📦 General: JsonSyntaxException</option>
                  </select>
                </div>
              )}

              <div className={requestMode === 'error_simulation' ? "sm:col-span-3 flex items-end" : "sm:col-span-7 flex items-end"}>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isRequesting}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isRequesting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isRequesting ? 'Running Call...' : 'Execute with Handler'}</span>
                </button>
              </div>
            </div>

            {/* Response Output Box */}
            {apiResponse && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] pb-2 mb-2 border-b border-slate-800/80">
                  <span className={`font-semibold flex items-center gap-1.5 ${
                    apiResponse.networkResult === 'NetworkResult.Success' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {apiResponse.networkResult === 'NetworkResult.Success' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>HTTP 200 OK — NetworkResult.Success</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{apiResponse.httpCode ? `HTTP ${apiResponse.httpCode}` : 'I/O Exception'} — {apiResponse.networkResult}</span>
                      </>
                    )}
                  </span>
                  <span className="text-slate-500">safeApiCall() handled</span>
                </div>

                {/* Highlight User-Friendly Error Message */}
                {apiResponse.userFriendlyMessage && (
                  <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200">
                    <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
                      User-Friendly UI Toast / Snackbar Message:
                    </div>
                    <div className="text-xs font-sans font-medium">
                      "{apiResponse.userFriendlyMessage}"
                    </div>
                  </div>
                )}

                <pre className="text-slate-300 max-h-48 overflow-y-auto whitespace-pre">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* APK Installation Guide Modal */}
      <ApkInstallGuideModal
        isOpen={showApkGuide}
        onClose={() => setShowApkGuide(false)}
      />
    </div>
  );
};
