/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './scripts/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0B0E13',
        'brand-gold': '#D4AF37',
        // softer/darker hover/secondary gold for a luxury look
        'brand-goldSoft': '#B68D2C'
      },
      boxShadow: {
        glow: '0 6px 20px rgba(0,0,0,.35), 0 0 25px rgba(212,175,55,.15)'
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding'
      }
    }
  },
  darkMode: 'class',
  plugins: []
}