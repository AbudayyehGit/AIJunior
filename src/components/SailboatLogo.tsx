import React from 'react';

interface SailboatLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const SailboatLogo: React.FC<SailboatLogoProps> = ({
  size = 26,
  className = '',
  showText = true,
}) => {
  return (
    <div id="brand-logo-container" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sailboat Icon Container with Purple & Blue accents */}
      <div className="w-10 h-10 flex items-center justify-center bg-purple-50/80 border-2 border-purple-600 rounded-xl shadow-xs transition-transform hover:scale-105">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Sailboat Logo"
        >
          {/* Main Sail (Purple to Violet gradient effect) */}
          <path
            d="M12 3V15L19 15C19 15 17 8 12 3Z"
            fill="#7C3AED"
          />
          {/* Jib / Front Sail (Vibrant Indigo-Purple) */}
          <path
            d="M10.5 5.5L4.5 15H10.5V5.5Z"
            fill="#9333EA"
            fillOpacity="0.85"
          />
          {/* Mast */}
          <path
            d="M11.25 2.5H12.75V16H11.25V2.5Z"
            fill="#4C1D95"
          />
          {/* Boat Hull (Ocean Slate #2563EB) */}
          <path
            d="M3 16.5C4.5 19 7 20.5 12 20.5C17 20.5 19.5 19 21 16.5H3Z"
            fill="#2563EB"
          />
          {/* Water wave / Wake line (Mint Green #10B981 & Soft Purple) */}
          <path
            d="M2 21.5C4 22.5 6.5 21 8.5 21.5C10.5 22 13.5 22.5 15.5 21.5C17.5 20.5 20 22 22 21.5"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Small Mast Pennant / Flag (Soft Amber #F59E0B) */}
          <path
            d="M12.75 3L15.5 4.25L12.75 5.5V3Z"
            fill="#F59E0B"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-slate-900">
            Junior<span className="text-purple-600">AI</span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            ≤2 Yrs Only
          </span>
        </div>
      )}
    </div>
  );
};
