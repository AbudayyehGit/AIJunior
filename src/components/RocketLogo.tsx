import React from 'react';

interface RocketLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'tekhelet' | 'celestial';
}

export const RocketLogo: React.FC<RocketLogoProps> = ({
  size = 26,
  className = '',
  showText = true,
  variant = 'light',
}) => {
  const isDarkFrame = variant === 'tekhelet' || variant === 'celestial' || variant === 'dark';

  return (
    <div id="brand-logo-container" className={`flex items-center gap-3 select-none ${className}`}>
      {/* 45-degree left-angling rocket container */}
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-transform hover:scale-105 shadow-xs ${
        isDarkFrame 
          ? 'bg-[#245170] border border-[#64A7CC]/50 shadow-celestial-glow'
          : 'bg-[#FAF0D4]/80 border border-[#C59B27]/40 shadow-xs'
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
            {/* Covenant Crimson Plumes / Flare (#C0392B) shooting downward */}
            <path
              d="M13 24C13 27 16 31 16 31C16 31 19 27 19 24H13Z"
              fill="#C0392B"
            />
            <path
              d="M14.5 24C14.5 26.5 16 29 16 29C16 29 17.5 26.5 17.5 24H14.5Z"
              fill="#E46E62"
            />
            {/* Sparkle of Sanctuary Gold in core exhaust (#C59B27) */}
            <circle cx="16" cy="25" r="1.1" fill="#C59B27" />

            {/* Left Delta Fin (Deep Celestial Horizon #1C3E56) */}
            <path
              d="M11 18L6 23C6 23 8 24 12 23L12.5 19.5"
              fill="#1C3E56"
            />
            {/* Right Delta Fin (Deep Celestial Horizon #1C3E56) */}
            <path
              d="M21 18L26 23C26 23 24 24 20 23L19.5 19.5"
              fill="#1C3E56"
            />

            {/* Rocket Hull & Fuselage (Celestial Horizon Blue #3A7CA5) */}
            <path
              d="M16 2C13 6 11 12 11 22C11 23.5 12.5 24 16 24C19.5 24 21 23.5 21 22C21 12 19 6 16 2Z"
              fill="#3A7CA5"
            />

            {/* Fuselage Highlight & Aerodynamic Crease */}
            <path
              d="M16 2C14 6 12.5 12 12.5 22C12.5 23 13.5 23.5 16 23.8V2Z"
              fill="#64A7CC"
              fillOpacity="0.5"
            />

            {/* Sanctuary Gold Window / Porthole (#C59B27) */}
            <circle cx="16" cy="11" r="3.2" fill="#C59B27" stroke="#FAF0D4" strokeWidth="0.9" />
            <circle cx="15.2" cy="10.2" r="1.1" fill="#FFFFFF" fillOpacity="0.85" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black tracking-tight ${isDarkFrame ? 'text-white' : 'text-[#2C3E50]'}`}>
            Junior<span className={isDarkFrame ? 'text-[#F4E0A9]' : 'text-[#C59B27]'}>AI</span>
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isDarkFrame
              ? 'bg-[#1C3E56] text-[#F4E0A9] border border-[#64A7CC]/40'
              : 'bg-[#FDF9EE] text-[#8A6714] border border-[#F4E0A9]'
          }`}>
            ≤2 Yrs Only
          </span>
        </div>
      )}
    </div>
  );
};

