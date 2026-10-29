import React, { useState } from 'react';
import { Upload, X, Check, Video as VideoIcon, Sparkles } from 'lucide-react';
import { Video } from '../../types/video';
import { MR_KHAN_CHANNEL } from '../../data/mockData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoCreated: (newVideo: Video) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onVideoCreated
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Android Compose');
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const newVideo: Video = {
        id: `vid-upload-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || 'Uploaded via Mr Khan Creator Studio.',
        videoUrl: selectedSampleUrl,
        thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 180,
        views: 1,
        likes: 0,
        dislikes: 0,
        uploadedAt: 'Just now',
        category,
        channel: MR_KHAN_CHANNEL,
        qualityResolutions: ['1080p60', '720p', '480p', 'Auto'],
        comments: [],
        ambientColor: '#ef4444'
      };

      onVideoCreated(newVideo);
      setIsUploading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-white text-lg">Upload Video to Mr Khan</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Video Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Jetpack Compose Material 3 Dynamic Theming Guide"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a description, timestamps, and documentation links..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Android Compose">Android Compose</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Architecture">Architecture</option>
                <option value="Media3 ExoPlayer">Media3 ExoPlayer</option>
                <option value="4K HDR">4K HDR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Video Source</label>
              <select
                value={selectedSampleUrl}
                onChange={(e) => setSelectedSampleUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4">
                  Android Tech Demo (Sample 1)
                </option>
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4">
                  Mobile Experience (Sample 2)
                </option>
                <option value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4">
                  Material Motion (Sample 3)
                </option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <span>Publishing to CDN...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
