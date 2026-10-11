import React, { useState } from 'react';
import { X, ArrowRight, Smartphone, User, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { YoyoLogo } from '../common/YoyoLogo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalReason, closeAuthModal, login, signup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!identifier.trim()) throw new Error('Please enter your phone number or username');
        await login(identifier, password);
      } else {
        if (!displayName.trim()) throw new Error('Please enter your full name or business name');
        if (!username.trim()) throw new Error('Please choose a username');
        await signup({
          display_name: displayName.trim(),
          username: username.trim(),
          phone: identifier.trim(),
          password,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-block mb-2">
            <YoyoLogo size="lg" variant="brand" />
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed mt-1">
            {authModalReason || 'Sierra Leone’s Social Media Platform'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#0B1F3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#0B1F3B] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
        </div>

        {error && (
          <div className="p-2.5 mb-3 rounded-xl bg-rose-50 text-rose-600 text-[11px] font-semibold text-center border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Aminata Sesay"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-400">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    required
                    className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              {mode === 'signup' ? 'Phone or Email (Sierra Leone)' : 'Phone or Username'}
            </label>
            <div className="relative flex items-center">
              <Smartphone size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === 'signup' ? '+232 76 000 000' : 'Username or +232...'}
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00B050] focus:ring-1 focus:ring-[#00B050] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#00B050] hover:bg-[#009142] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-98 transition-all disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Authenticating...' : mode === 'signup' ? 'Join YOYO 🇸🇱' : 'Log In to YOYO'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 mt-4">
          By continuing you agree to YOYO’s Community Guidelines for Sierra Leone.
        </p>
      </div>
    </div>
  );
};
