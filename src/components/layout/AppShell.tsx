import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { BottomNavigation, NavTab } from '../navigation/BottomNavigation';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadMessagesCount?: number;
  hideBottomNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  unreadMessagesCount = 0,
  hideBottomNav = false,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative font-sans overflow-hidden">
      {/* Desktop Mode Switcher */}
      <div className="hidden lg:flex fixed top-3 left-4 z-50 items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs text-white shadow-xl">
        <span className="text-[11px] font-bold text-[#00B050]">YOYO 🇸🇱</span>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => setDeviceFrameMode(true)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
            deviceFrameMode ? 'bg-[#00B050] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone size={13} />
          <span>Mobile Device</span>
        </button>
        <button
          onClick={() => setDeviceFrameMode(false)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
            !deviceFrameMode ? 'bg-[#0066FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor size={13} />
          <span>Full Width</span>
        </button>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full h-screen transition-all duration-300 relative bg-black flex flex-col ${
          deviceFrameMode
            ? 'max-w-[440px] max-h-[920px] md:h-[92vh] md:rounded-[44px] md:shadow-[0_0_50px_rgba(0,176,80,0.15)] md:border-[10px] md:border-slate-800/90 overflow-hidden ring-1 ring-white/10'
            : 'max-w-4xl max-h-screen overflow-hidden'
        }`}
      >
        {/* Simulated Mobile Status Notch for realistic mobile preview */}
        {deviceFrameMode && (
          <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>
        )}

        {/* Dynamic Viewport Content */}
        <main className="flex-1 w-full h-full relative overflow-hidden bg-black">
          {children}
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        {!hideBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={onTabChange}
            unreadMessagesCount={unreadMessagesCount}
          />
        )}
      </div>
    </div>
  );
};
