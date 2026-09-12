import React from 'react';
import { Zap } from 'lucide-react';

const Logo = ({ size = 'md', variant = 'default', showSublabel = true, className = '' }) => {
  const isLight = variant === 'light'; // Light text on dark bg

  const sizeMap = {
    sm: { iconBox: 'w-7 h-7 rounded-lg', iconSize: 16, title: 'text-base', sub: 'text-[0.6rem]' },
    md: { iconBox: 'w-9 h-9 rounded-xl', iconSize: 20, title: 'text-xl', sub: 'text-[0.65rem]' },
    lg: { iconBox: 'w-11 h-11 rounded-2xl', iconSize: 24, title: 'text-2xl', sub: 'text-[0.7rem]' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`${currentSize.iconBox} bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0`}>
        <Zap size={currentSize.iconSize} fill="currentColor" />
      </div>

      <div className="flex flex-col min-w-0">
        <span className={`font-heading font-extrabold tracking-tight leading-none ${currentSize.title} ${isLight ? 'text-white' : 'text-slate-900'}`}>
          TaskFlow
        </span>
        {showSublabel && (
          <span className={`font-bold uppercase tracking-wider mt-0.5 leading-none ${currentSize.sub} ${isLight ? 'text-blue-300' : 'text-blue-600'}`}>
            Kinetic Workspace
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
