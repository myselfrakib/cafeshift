/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IFP Design System Tokens
        ifp: {
          bg: '#0A011C', // Deep Violet background
          surface: '#13052E',
          card: '#160838',
          cardHover: '#1E0D48',
          border: '#2A1354',
          borderLight: '#3D1C7A',
          primary: '#FF0046', // Vivid Pink
          primaryHover: '#E6003F',
          secondary: '#00DADC', // Vivid Cyan
          tertiary: '#FE9900', // Vivid Orange
          dark: '#000000',
          textMuted: '#A399BA',
          textSubtle: '#786C94'
        }
      },
      borderRadius: {
        'sm': '3px',
        DEFAULT: '3px',
        'md': '10px',
      },
      boxShadow: {
        'ifp-tertiary': 'rgb(255, 81, 0) 0px 4px 0px 0px',
        'ifp-primary': 'rgb(255, 0, 70) 0px 4px 0px 0px',
        'ifp-cyan': 'rgb(0, 218, 220) 0px 4px 0px 0px',
      },
      fontFamily: {
        sans: ['"Titillium Web"', 'Gotham', 'Noir Pro', 'sans-serif'],
        headline: ['"Titillium Web"', 'Gotham', 'sans-serif'],
        display: ['"Titillium Web"', 'sans-serif'],
        body: ['"Titillium Web"', 'Noir Pro', 'sans-serif']
      },
      transitionDuration: {
        'default': '300ms',
      }
    },
  },
  plugins: [],
}
