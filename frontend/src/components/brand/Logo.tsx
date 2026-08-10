import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 44, text: 'text-3xl' },
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Emblem SVG: Represents manuscript pages, global orbit, and dynamic publishing spark */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="pub-grad-1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284C7" />
            <stop offset="0.5" stopColor="#2563EB" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="pub-grad-2" x1="44" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Global Outer Orbit Ring */}
        <circle cx="22" cy="22" r="20" stroke="url(#pub-grad-1)" strokeWidth="2.5" strokeDasharray="4 2" opacity="0.6" />

        {/* Left Book/Manuscript Leaf */}
        <path
          d="M11 14C11 12.8954 11.8954 12 13 12H21V30H13C11.8954 30 11 29.1046 11 28V14Z"
          fill="url(#pub-grad-1)"
          opacity="0.9"
        />

        {/* Right Book/Manuscript Leaf */}
        <path
          d="M23 12H31C32.1046 12 33 12.8954 33 14V28C33 29.1046 32.1046 30 31 30H23V12Z"
          fill="url(#pub-grad-2)"
        />

        {/* Center Quill / Spark Arrow */}
        <path
          d="M22 8L24.5 15L31.5 17.5L24.5 20L22 27L19.5 20L12.5 17.5L19.5 15L22 8Z"
          fill="#FFFFFF"
          className="drop-shadow-sm"
        />
        
        {/* Global Meridian Arc */}
        <path
          d="M10 22C10 15.3726 15.3726 10 22 10"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {variant === 'full' && (
        <span className={`font-serif tracking-wide ${text}`}>
          <span className="text-slate-900 dark:text-white font-extrabold">PUBLISH</span>
          <span className="text-sky-600 dark:text-sky-400 font-normal">ORA</span>
        </span>
      )}
    </div>
  );
};
