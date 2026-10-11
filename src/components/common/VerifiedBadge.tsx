import React from 'react';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'sm', className = '' }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 text-[9px]',
    md: 'w-4 h-4 text-[10px]',
    lg: 'w-5 h-5 text-xs',
  };

  const iconSizeMap = {
    sm: 9,
    md: 11,
    lg: 13,
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#0066FF] text-white shrink-0 shadow-sm ${sizeMap[size]} ${className}`}
      title="Verified Sierra Leone Business"
    >
      <Check strokeWidth={3.5} size={iconSizeMap[size]} />
    </span>
  );
};
