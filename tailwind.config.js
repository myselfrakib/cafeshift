/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fffbf5',
          100: '#f7f1e6',
          200: '#eddcc5',
          300: '#dec09d',
          400: '#ca9d70',
          500: '#b7804c',
          600: '#9d663b',
          700: '#7e4f30',
          800: '#67412b',
          900: '#543625',
        },
        paw: {
          pink: '#ffd6e0',
          peach: '#ffe5d9',
          cream: '#fff8f0',
          mint: '#d8f3dc',
          lemon: '#fff3b0',
          lavender: '#e8dff5',
          sky: '#d0f4de'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bubble: ['"Fredoka"', 'Nunito', 'sans-serif']
      },
      keyframes: {
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'bounce-small': 'bounceSmall 2s infinite ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop': 'pop 0.25s ease-out forwards'
      }
    },
  },
  plugins: [],
}

