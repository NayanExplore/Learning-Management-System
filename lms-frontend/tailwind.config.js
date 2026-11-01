/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        slate: {
          850: '#151f32',
        },
        brand: {
          navy: '#172B4D',
          'navy-dark': '#0E1E38',
          'navy-light': '#243B61',
          teal: '#287C78',
          'teal-dark': '#1E615E',
          'teal-light': '#E6F3F2',
          bg: '#FAFAF8',
          surface: '#FFFFFF',
          charcoal: '#20252B',
          muted: '#697386',
          border: '#E5E7EB',
        },
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'xs': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'sm': '0 1px 3px 0 rgba(16, 24, 40, 0.1), 0 1px 2px -1px rgba(16, 24, 40, 0.1)',
        'md': '0 4px 6px -1px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
