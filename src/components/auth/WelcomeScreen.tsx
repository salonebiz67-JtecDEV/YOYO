import React from 'react';
import { ArrowRight } from 'lucide-react';
import { YoyoLogo } from '../common/YoyoLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogIn: () => void;
  onSkipToFeed: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogIn,
  onSkipToFeed,
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col justify-between select-none overflow-hidden">
      {/* Top Section with Brand Logo */}
      <div className="pt-8 px-6 text-center z-10">
        <div className="inline-block p-4 bg-emerald-50/60 rounded-3xl mb-3 shadow-xs">
          <YoyoLogo size="xl" variant="brand" showTagline={true} />
        </div>
      </div>

      {/* Middle Scenic Coastline Visual (Freetown Peninsula Inspiration) */}
      <div className="relative flex-1 flex flex-col justify-end px-6 pb-6 overflow-hidden">
        {/* Scenic illustration / gradient styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-blue-50/30 to-white" />

        {/* Content Box */}
        <div className="relative z-20 text-center max-w-sm mx-auto space-y-2">
          <h2 className="text-xl font-black text-[#0B1F3B] tracking-tight">
            Sierra Leone’s Business Social App
          </h2>
          <div className="space-y-1 text-xs text-slate-600 font-medium">
            <p>Discover Local Creators</p>
            <p>Short-Form Vertical Videos</p>
            <p className="font-bold text-[#00B050]">Proudly Sierra Leone 🇸🇱</p>
          </div>
        </div>
      </div>

      {/* Bottom Action Section */}
      <div className="p-6 bg-white z-20 space-y-3 max-w-sm mx-auto w-full">
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-[#00B050] hover:bg-[#009142] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/25 active:scale-98 transition-all group"
        >
          <span>Get Started</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-slate-500">Already have an account?</span>
          <button
            onClick={onLogIn}
            className="font-extrabold text-[#0066FF] hover:underline"
          >
            Log In
          </button>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onSkipToFeed}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
