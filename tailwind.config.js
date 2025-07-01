/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF3F0',
          100: '#FFE4DE',
          200: '#FFCDC3',
          300: '#FFAA99',
          400: '#FF7D5E',
          500: '#FF6B35',
          600: '#E85A2B',
          700: '#CC4722',
          800: '#B33A1D',
          900: '#992E19',
        },
        secondary: {
          50: '#E8F1F8',
          100: '#D1E3F1',
          200: '#A3C7E3',
          300: '#75ABD5',
          400: '#478FC7',
          500: '#1E3A5F',
          600: '#1B3556',
          700: '#182F4D',
          800: '#152A44',
          900: '#12243B',
        },
        accent: {
          50: '#E6FFF4',
          100: '#CCFFE9',
          200: '#99FFD3',
          300: '#66FFBD',
          400: '#33FFA7',
          500: '#00D37F',
          600: '#00B36C',
          700: '#009359',
          800: '#007346',
          900: '#005333',
        },
        surface: '#F5F5F5',
        success: '#00D37F',
        warning: '#FFB800',
        error: '#DC2626',
        info: '#3B82F6',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.75rem',   // 28px
        '4xl': '2rem',      // 32px
        '5xl': '2.5rem',    // 40px
        '6xl': '3rem',      // 48px
      },
      gridTemplateColumns: {
        'mobile': 'repeat(2, minmax(0, 1fr))',
        'tablet': 'repeat(3, minmax(0, 1fr))',
        'desktop': 'repeat(4, minmax(0, 1fr))',
      },
      animation: {
        'pulse-border': 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-tap': 'scale-tap 0.15s ease-out',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { 
            'border-color': 'rgb(239 68 68)',
            'box-shadow': '0 0 0 0 rgba(239, 68, 68, 0.7)'
          },
          '50%': { 
            'border-color': 'rgb(220 38 38)',
            'box-shadow': '0 0 0 8px rgba(239, 68, 68, 0)'
          }
        },
        'scale-tap': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}