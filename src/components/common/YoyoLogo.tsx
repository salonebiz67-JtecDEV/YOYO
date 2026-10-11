import React from 'react';

interface YoyoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'brand';
  showTagline?: boolean;
}

export const YoyoLogo: React.FC<YoyoLogoProps> = ({
  size = 'md',
  variant = 'brand',
  showTagline = false,
}) => {
  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-[#0B1F3B]'
      : 'text-[#00B050]';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const handleSizeClasses = {
    sm: 'w-3 h-2 -top-1.5',
    md: 'w-4 h-2.5 -top-2',
    lg: 'w-5 h-3 -top-2.5',
    xl: 'w-8 h-4.5 -top-4',
  };

  const playSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-5 h-5',
  };

  return (
    <div className="flex flex-col items-center select-none font-sans">
      <div className={`flex items-baseline font-black tracking-tighter leading-none ${sizeClasses[size]} ${textColor}`}>
        {/* 'Y' */}
        <span>Y</span>

        {/* First 'O' with shopping bag handle */}
        <span className="relative inline-flex items-center justify-center">
          <span
            className={`absolute left-1/2 -translate-x-1/2 border-2 ${
              variant === 'light' ? 'border-white' : 'border-[#00B050]'
            } border-b-0 rounded-t-full ${handleSizeClasses[size]}`}
          />
          <span>O</span>
        </span>

        <span className="w-1.5" />

        {/* 'Y' */}
        <span>Y</span>

        {/* Second 'O' with blue play button */}
        <span className="relative inline-flex items-center justify-center">
          <span>O</span>
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${playSizeClasses[size]}`}
          >
            <svg viewBox="0 0 24 24" fill="#0066FF" className="w-full h-full ml-0.5">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </span>
        </span>
      </div>

      {showTagline && (
        <div className="text-center mt-2 space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold tracking-wide text-[#0B1F3B]">
            <span>Shop</span>
            <span className="w-1 h-1 rounded-full bg-[#00B050]" />
            <span>Connect</span>
            <span className="w-1 h-1 rounded-full bg-[#0066FF]" />
            <span>Grow</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Sierra Leone’s Social App 🇸🇱
          </p>
        </div>
      )}
    </div>
  );
};
