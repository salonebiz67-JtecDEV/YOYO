import React, { useState, useRef } from 'react';
import { X, Upload, Video, MapPin, Sparkles, Check, Globe, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import { VideoPost } from '../../types';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoPublished: (post: VideoPost) => void;
}

export const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  isOpen,
  onClose,
  onVideoPublished,
}) => {
  const { user, openAuthModal } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['#YOYOSalone', '#Freetown']);
  const [tagInput, setTagInput] = useState('');
  const [location, setLocation] = useState('Freetown, Sierra Leone');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file (.mp4, .webm, .mov)');
        return;
      }
      setError(null);
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const tag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('Please create an account or log in to post videos on YOYO');
      return;
    }
    if (!videoFile && !videoPreviewUrl) {
      setError('Please choose a video to upload');
      return;
    }
    if (!caption.trim()) {
      setError('Please write a caption for your video');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newPost = await postService.uploadVideo({
        videoFile: videoFile || undefined,
        videoUrl: videoPreviewUrl || undefined,
        caption: caption.trim(),
        hashtags,
        location,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onVideoPublished(newPost);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to publish video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white z-10 shrink-0">
          <h2 className="text-sm font-extrabold text-[#0B1F3B]">Upload Short-Form Video</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {isSuccess ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00B050] mx-auto flex items-center justify-center mb-3">
                <Check size={32} />
              </div>
              <h3 className="text-base font-bold text-[#0B1F3B]">Video Published!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your video is now live on YOYO For You feed.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePublish} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold text-center border border-rose-100">
                  {error}
                </div>
              )}

              {/* Video Selector / Preview Container */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center">
                {videoPreviewUrl ? (
                  <div className="relative aspect-9/14 max-h-72 mx-auto rounded-xl overflow-hidden bg-black shadow-md">
                    <video
                      src={videoPreviewUrl}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                      title="Remove video"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#00B050] rounded-xl p-8 cursor-pointer transition-colors flex flex-col items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B050] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <p className="text-xs font-bold text-[#0B1F3B]">
                      Select video file from device
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports MP4, WebM, MOV · Max 60 seconds
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Caption Input */}
              <div>
                <label className="text-xs font-bold text-[#0B1F3B] block mb-1">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe your video, tag creators, or ask Sierra Leone a question..."
                  rows={3}
                  required
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="text-xs font-bold text-[#0B1F3B] block mb-1">
                  Hashtags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a hashtag (e.g. #SaloneComedy)"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B050] bg-emerald-50 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Visibility */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Location in Sierra Leone
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B050]"
                  >
                    <option value="Freetown, Sierra Leone">Freetown, Sierra Leone</option>
                    <option value="Bo Town, Southern Province">Bo Town, Southern Province</option>
                    <option value="Kenema, Eastern Province">Kenema, Eastern Province</option>
                    <option value="Makeni, Northern Province">Makeni, Northern Province</option>
                    <option value="Lumley Beach, Freetown">Lumley Beach, Freetown</option>
                    <option value="Aberdeen, Freetown">Aberdeen, Freetown</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B050]"
                  >
                    <option value="public">Public (Everyone)</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00B050] hover:bg-[#009142] text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles size={16} />
                <span>{isUploading ? 'Publishing video to YOYO...' : 'Publish Video'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
