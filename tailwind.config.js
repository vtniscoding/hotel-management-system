/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          navy: '#11171d',
          'navy-light': '#1a252f',
          'navy-dark': '#0b0f13',
          gold: '#c0a038',
          'gold-dark': '#8d762c',
          'gold-light': '#fcf6ba',
          'gold-metallic': '#bf953f',
          bg: '#f8f9fa',
          surface: '#ffffff',
          muted: '#6c757d',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
        public: ['"Public Sans"', 'sans-serif'],
        open: ['"Open Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient-1': 'linear-gradient(90deg, #29210b 5%, #c0a038 50%, #29210b 95%)',
        'gold-gradient-2': 'linear-gradient(90deg, #9e8841 0%, #ffdb57 49%, #a68b32 100%)',
        'logo-gradient': 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771d)',
        'gray-gradient': 'linear-gradient(90deg, #858585 5%, #ffffff 50%, #858585 95%)',
        'overlay-hero': 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 50%, rgba(17,23,29,0.95) 100%)',
        'sub-header-overlay': 'linear-gradient(to right, rgba(16,20,26,0.97) 5%, rgba(26,37,47,0.8) 40%, rgba(23,30,37,0.5) 95%)',
      },
      boxShadow: {
        'luxury': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'luxury-hover': '0 20px 40px rgba(0, 0, 0, 0.2)',
        'gold-glow': '0 0 20px rgba(192, 160, 56, 0.35)',
      }
    },
  },
  plugins: [],
}
