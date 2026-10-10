/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#FF6900',
          bright: '#FF8A33',
          dim: '#D95800',
          glow: 'rgba(255, 105, 0, 0.08)',
        },
        primary: {
          DEFAULT: '#DEDBC8',
          text: '#E1E0CC',
        },
        surface: {
          DEFAULT: '#000000',
          card: '#101010',
          feature: '#212121',
          dark: '#0b0b0d',
          border: 'rgba(255,255,255,0.04)',
        },
      },
      fontFamily: {
        sans: ['Almarai', 'Inter', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        page: '1700px',
      },
    },
  },
  plugins: [],
};
