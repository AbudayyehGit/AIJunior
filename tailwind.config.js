/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tabernacle Design System Color Tokens
        tekhelet: {
          DEFAULT: '#1D4ED8', // Structural Tekhelet Blue (Authority, Layout Frames)
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8', // Primary Tekhelet
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        argaman: {
          DEFAULT: '#7C3AED', // Royal Argaman Purple (Majesty, Action Buttons, Focus)
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED', // Primary Argaman
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        scarlet: {
          DEFAULT: '#DC2626', // Vibrant Scarlet (Security Alerts, High-Priority Warnings)
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626', // Primary Scarlet
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        linen: {
          DEFAULT: '#F8FAFC', // Fine Linen & Purity Canvas
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
          950: '#0F172A',
        },
        gold: {
          DEFAULT: '#F59E0B', // Sacred Gold (Verified Skill Badges, Premium Accents)
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Primary Sacred Gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'tabernacle-gold': '0 0 15px rgba(245, 158, 11, 0.35)',
        'tabernacle-argaman': '0 0 15px rgba(124, 58, 237, 0.35)',
        'tabernacle-tekhelet': '0 4px 20px rgba(29, 78, 216, 0.25)',
      },
    },
  },
  plugins: [],
};
