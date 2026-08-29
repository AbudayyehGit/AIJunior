/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tabernacle Reimagined Design System Color Tokens (juniorpatio.ai.studio)
        // 1. Canvas / Background: Luminous Alabaster (#FBFBFA)
        alabaster: {
          DEFAULT: '#FBFBFA',
          50: '#FFFFFF',
          100: '#FBFBFA',
          200: '#F4F4F0',
          300: '#ECECE5',
          400: '#E0E0D5',
          500: '#CFCFC2',
          600: '#B0B0A0',
          700: '#8A8A78',
          800: '#5C5C4F',
          900: '#33332B',
        },
        // 2. Primary Accent: Sanctuary Gold (#C59B27)
        sanctuary: {
          DEFAULT: '#C59B27',
          50: '#FDF9EE',
          100: '#FAF0D4',
          200: '#F4E0A9',
          300: '#ECCC78',
          400: '#DDB647',
          500: '#C59B27', // Primary Sanctuary Gold
          600: '#AA821C',
          700: '#8A6714',
          800: '#694E0F',
          900: '#4D380A',
          950: '#2E2105',
        },
        // 3. Secondary / Structural Tone: Celestial Horizon Blue (#3A7CA5)
        celestial: {
          DEFAULT: '#3A7CA5',
          50: '#F0F7FA',
          100: '#E0EEF5',
          200: '#C0DDEB',
          300: '#94C4DC',
          400: '#64A7CC',
          500: '#3A7CA5', // Primary Celestial Horizon Blue
          600: '#2E668B',
          700: '#245170',
          800: '#1C3E56',
          900: '#152E40',
          950: '#0C1B27',
        },
        // 4. Micro-Accent: Covenant Crimson (#C0392B)
        crimson: {
          DEFAULT: '#C0392B',
          50: '#FDF2F1',
          100: '#FBE4E2',
          200: '#F6CAC5',
          300: '#EFA49C',
          400: '#E46E62',
          500: '#C0392B', // Primary Covenant Crimson
          600: '#A92E22',
          700: '#8C241A',
          800: '#6F1C14',
          900: '#54140E',
          950: '#360B07',
        },
        // 5. Typography / Text: Charcoal Slate (#2C3E50)
        charcoal: {
          DEFAULT: '#2C3E50',
          50: '#F4F6F7',
          100: '#E5E8EB',
          200: '#CCD2D8',
          300: '#A3AFB9',
          400: '#6E8193',
          500: '#4A5D70',
          600: '#34495E',
          700: '#2C3E50', // Primary Charcoal Slate
          800: '#212F3D',
          900: '#17202A',
          950: '#0E141B',
        },
        // Backward-compatible alias tokens
        tekhelet: {
          DEFAULT: '#3A7CA5',
          50: '#F0F7FA',
          100: '#E0EEF5',
          200: '#C0DDEB',
          500: '#3A7CA5',
          700: '#245170',
          800: '#1C3E56',
          900: '#152E40',
        },
        gold: {
          DEFAULT: '#C59B27',
          50: '#FDF9EE',
          100: '#FAF0D4',
          200: '#F4E0A9',
          300: '#ECCC78',
          400: '#DDB647',
          500: '#C59B27',
          600: '#AA821C',
          700: '#8A6714',
        },
        scarlet: {
          DEFAULT: '#C0392B',
          50: '#FDF2F1',
          100: '#FBE4E2',
          200: '#F6CAC5',
          500: '#C0392B',
          600: '#A92E22',
        },
        linen: {
          DEFAULT: '#FBFBFA',
          50: '#FFFFFF',
          100: '#FBFBFA',
          200: '#F4F4F0',
          300: '#ECECE5',
          800: '#2C3E50',
          900: '#17202A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'sanctuary-glow': '0 0 16px rgba(197, 155, 39, 0.35)',
        'celestial-glow': '0 4px 20px rgba(58, 124, 165, 0.22)',
        'crimson-subtle': '0 2px 10px rgba(192, 57, 43, 0.25)',
        'tabernacle-gold': '0 0 16px rgba(197, 155, 39, 0.35)',
        'tabernacle-argaman': '0 0 16px rgba(197, 155, 39, 0.35)',
        'tabernacle-tekhelet': '0 4px 20px rgba(58, 124, 165, 0.22)',
      },
    },
  },
  plugins: [],
};
