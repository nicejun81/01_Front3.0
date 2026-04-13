/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ── Color System ── */
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#e55a2b',
          light: '#ff8f6a',
          50: '#fff5f0',
          100: '#ffe8db',
        },
        accent: {
          purple: '#7F56D9',
          green: '#00FF63',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f5f5',
          subtle: '#fafafa',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          secondary: '#525252',
          tertiary: '#737373',
          placeholder: '#a3a3a3',
          disabled: '#d4d4d4',
        },
        border: {
          DEFAULT: '#e5e5e5',
          light: '#f5f5f5',
        },
        category: {
          bareton: { bg: '#fce7f3', text: '#db2777' },
          hit35: { bg: '#dbeafe', text: '#2563eb' },
          gymground: { bg: '#dcfce7', text: '#16a34a' },
        },
        semantic: {
          star: '#FFD700',
          online: '#22c55e',
          like: '#ff3040',
          kakao: '#FEE500',
        },
      },

      /* ── Typography Scale ── */
      fontSize: {
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        'label':   ['14px', { lineHeight: '20px' }],
        'body':    ['16px', { lineHeight: '24px' }],
        'title':   ['18px', { lineHeight: '26px', fontWeight: '700' }],
        'heading': ['21px', { lineHeight: '30px', fontWeight: '700' }],
        'display': ['26px', { lineHeight: '34px', fontWeight: '800' }],
      },

      /* ── Font Family ── */
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },

      /* ── Spacing Tokens ── */
      spacing: {
        'page': '20px',       // page horizontal padding (px-page)
        'section': '24px',    // gap between sections (mb-section)
        'card': '12px',       // card internal padding (p-card)
        'card-lg': '16px',    // larger card padding
      },

      /* ── Border Radius ── */
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'pill': '100px',
      },

      /* ── Shadows ── */
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },

      /* ── Animations ── */
      keyframes: {
        'scan-line': {
          '0%': { top: '8px', opacity: '1' },
          '50%': { opacity: '0.6' },
          '100%': { top: 'calc(100% - 10px)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'scan-line': 'scan-line 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },

      /* ── Transitions ── */
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
