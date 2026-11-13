/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0E0D12',
          surface: '#15141B',
          card: '#1A1822',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          orange: '#FF7A00',
          amber: '#F59E0B',
          gold: '#FFB020',
          glow: 'rgba(255, 122, 0, 0.35)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bubble: ['"Fredoka"', 'Nunito', 'sans-serif']
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        }
      },
      animation: {
        'pop': 'pop 0.25s ease-out forwards',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
