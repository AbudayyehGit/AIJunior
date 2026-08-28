import React from 'react';

interface RocketLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'tekhelet';
}

export const RocketLogo: React.FC<RocketLogoProps> = ({
  size = 26,
  className = '',
  showText = true,
  variant = 'light',
}) => {
  return (
    <div id="brand-logo-container" className={`flex items-center gap-3 select-none ${className}`}>
      {/* 45-degree left-angling rocket container */}
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-transform hover:scale-105 shadow-sm ${
        variant === 'tekhelet' 
          ? 'bg-blue-900/60 border border-blue-400/40 shadow-tabernacle-tekhelet'
          : 'bg-tekhelet-50/90 border border-tekhelet-200 shadow-2xs'
      }`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Tabernacle Rocket Logo"
          className="shrink-0"
        >
          <g transform="rotate(-45 16 16)">
            {/* Argaman Purple Exhaust Plumes / Flare (Shooting downward) */}
            <path
              d="M13 24C13 27 16 31 16 31C16 31 19 27 19 24H13Z"
              fill="#7C3AED"
            />
            <path
              d="M14.5 24C14.5 26.5 16 29 16 29C16 29 17.5 26.5 17.5 24H14.5Z"
              fill="#A78BFA"
            />
            {/* Sparkle of sacred gold in core exhaust */}
            <circle cx="16" cy="25" r="1" fill="#F59E0B" />

            {/* Left Delta Fin (Tekhelet Deep) */}
            <path
              d="M11 18L6 23C6 23 8 24 12 23L12.5 19.5"
              fill="#1E40AF"
            />
            {/* Right Delta Fin (Tekhelet Deep) */}
            <path
              d="M21 18L26 23C26 23 24 24 20 23L19.5 19.5"
              fill="#1E40AF"
            />

            {/* Rocket Hull & Fuselage (Structural Tekhelet Blue #1D4ED8) */}
            <path
              d="M16 2C13 6 11 12 11 22C11 23.5 12.5 24 16 24C19.5 24 21 23.5 21 22C21 12 19 6 16 2Z"
              fill="#1D4ED8"
            />

            {/* Fuselage Highlight & Aerodynamic Crease */}
            <path
              d="M16 2C14 6 12.5 12 12.5 22C12.5 23 13.5 23.5 16 23.8V2Z"
              fill="#3B82F6"
              fillOpacity="0.4"
            />

            {/* Sacred Gold Window / Porthole (#F59E0B) */}
            <circle cx="16" cy="11" r="3" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="0.8" />
            <circle cx="15.2" cy="10.2" r="1" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight ${variant === 'tekhelet' ? 'text-white' : 'text-slate-900'}`}>
            Junior<span className={variant === 'tekhelet' ? 'text-amber-300' : 'text-tekhelet-600'}>AI</span>
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
            variant === 'tekhelet'
              ? 'bg-blue-800/80 text-amber-300 border border-blue-500/50'
              : 'bg-tekhelet-50 text-tekhelet-700 border border-tekhelet-200'
          }`}>
            ≤2 Yrs Only
          </span>
        </div>
      )}
    </div>
  );
};
