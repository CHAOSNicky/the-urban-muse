/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        luxury: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        manrope: ['"Manrope"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        primary: '#0040e0',
        primary_container: '#2e5bff',
        primary_dim: '#003cd3',
        surface: '#f8f9fa',
        surface_container: '#edeeef',
        surface_container_low: '#f3f4f5',
        surface_container_lowest: '#ffffff',
        surface_container_high: '#e3e1ef',
        surface_container_highest: '#e1e3e4',
        on_surface: '#191c1d',
        on_surface_variant: '#5b5a64',
        outline_variant: '#c4c5d9',
        secondary: '#4959a3',
        secondary_container: '#9fafff',
      },
      boxShadow: {
        ambient: '0px 24px 48px rgba(46, 46, 54, 0.06)',
        'ambient-lg': '0px 32px 64px rgba(46, 46, 54, 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out both',
        float: 'float 20s ease-in-out infinite',
        'float-delayed': 'float 25s ease-in-out 5s infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out both',
        'slide-up-1': 'slideUp 0.5s ease-out 0.1s both',
        'slide-up-2': 'slideUp 0.5s ease-out 0.2s both',
        'slide-up-3': 'slideUp 0.5s ease-out 0.3s both',
      },
    },
  },
  plugins: [],
}
