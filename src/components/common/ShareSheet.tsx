import React, { useState } from 'react';
import { X, Check, Copy, MessageCircle, Share2, Facebook, Send } from 'lucide-react';
import { VideoPost } from '../../types';

interface ShareSheetProps {
  post: VideoPost;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({ post, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Watch @${post.user.username} on YOYO Sierra Leone: ${post.caption}`);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#00B050]" />
            <h3 className="text-base font-bold text-[#0B1F3B]">Share Video</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Channels */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <MessageCircle size={20} />
            </div>
            <span className="text-[11px] font-medium">WhatsApp</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xs">
              {copied ? <Check size={20} className="text-[#00B050]" /> : <Copy size={20} />}
            </div>
            <span className="text-[11px] font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
              <Facebook size={20} />
            </div>
            <span className="text-[11px] font-medium">Facebook</span>
          </a>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `YOYO Video by ${post.user.display_name}`,
                  text: post.caption,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                handleCopyLink();
              }
            }}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#00B050] text-white flex items-center justify-center shadow-xs">
              <Send size={20} />
            </div>
            <span className="text-[11px] font-medium">Direct</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-center text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
