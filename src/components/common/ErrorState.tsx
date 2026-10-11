import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "YOYO couldn't connect right now.",
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center select-none bg-slate-950 text-white">
      <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
        <WifiOff size={24} />
      </div>

      <h3 className="text-base font-bold text-white">{message}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
        Please check your internet connection or try again in a moment.
      </p>

      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5 px-6 py-2.5 rounded-full bg-[#00B050] hover:bg-[#009142] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/30 active:scale-95 transition-all disabled:opacity-60"
      >
        <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
        <span>{isRetrying ? 'Connecting...' : 'Try Again'}</span>
      </button>
    </div>
  );
};
