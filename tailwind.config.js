/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        ink: '#242522',
        accent: '#A68A5B',
        secondary: '#777873',
        line: '#E8E5DF',
        surface: '#FFFFFF',
        // supporting tones derived from the core palette
        'ink-soft': '#3A3B37',
        'canvas-deep': '#F1EFEA',
        'accent-soft': '#E7DDCB',
        'accent-deep': '#8C7348',
      },
      fontFamily: {
        // Latin glyphs come from Manrope, Arabic glyphs fall through to Tajawal —
        // the browser picks per character, so mixed-language lines stay coherent.
        sans: ['Manrope', 'Tajawal', 'Segoe UI', 'Tahoma', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(36,37,34,0.04), 0 14px 34px -18px rgba(36,37,34,0.22)',
        lift: '0 2px 4px rgba(36,37,34,0.05), 0 26px 50px -22px rgba(36,37,34,0.28)',
        panel: '0 1px 0 rgba(36,37,34,0.04), 0 20px 60px -30px rgba(36,37,34,0.3)',
      },
      letterSpacing: {
        editorial: '0.16em',
        wide2: '0.08em',
      },
      maxWidth: {
        shell: '1440px',
        reading: '68ch',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
