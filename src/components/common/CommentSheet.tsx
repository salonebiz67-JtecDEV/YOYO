import React, { useState, useEffect } from 'react';
import { X, Heart, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import { PostComment, VideoPost } from '../../types';

interface CommentSheetProps {
  post: VideoPost;
  isOpen: boolean;
  onClose: () => void;
  onCommentCountChange?: (count: number) => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({
  post,
  isOpen,
  onClose,
  onCommentCountChange,
}) => {
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      commentService
        .getComments(post.id)
        .then((items) => {
          setComments(items);
        })
        .catch(() => {
          setComments([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, post.id]);

  if (!isOpen) return null;

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!user) {
      openAuthModal('Please log in or create an account to comment');
      return;
    }

    try {
      const created = await commentService.createComment(post.id, inputText.trim());
      const updated = [created, ...comments];
      setComments(updated);
      setInputText('');
      onCommentCountChange?.(updated.length);
    } catch {
      // Failed to add comment
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(post.id, commentId);
      const updated = comments.filter((c) => c.id !== commentId);
      setComments(updated);
      onCommentCountChange?.(updated.length);
    } catch {
      // Failed to delete comment
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-[68vh] max-h-[600px] bg-white rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#0B1F3B]">Comments</h3>
            <span className="text-xs text-slate-400 tabular-nums">({comments.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center select-none">
              <p className="text-xs font-bold text-[#0B1F3B]">Be the first to comment.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Share your thoughts with the creator and community.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                  {comment.user.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.display_name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{comment.user.display_name.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0B1F3B]">{comment.user.display_name}</span>
                      <span className="text-[10px] text-slate-400">{comment.user.username}</span>
                    </div>

                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed break-words">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80">
          <form onSubmit={handleSendComment} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={user ? "Add a comment..." : "Log in to add a comment..."}
              className="flex-1 px-4 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2 rounded-full transition-all ${
                inputText.trim()
                  ? 'bg-[#00B050] text-white hover:bg-[#009142]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
