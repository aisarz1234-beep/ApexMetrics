/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kr: {
          bg: '#140E0A',
          parchment: '#FBE8BF',
          'parchment-card': '#271B11',
          'parchment-border': '#8D5B29',
          wood: '#3D2210',
          'wood-dark': '#241409',
          'wood-border': '#5C3317',
          stone: '#1C1F26',
          'stone-light': '#2D333F',
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          crimson: '#DC2626',
          'crimson-dark': '#991B1B',
          royal: '#2563EB',
          emerald: '#16A34A'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'kr-card': 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 0 #180D06, 0 15px 25px rgba(0,0,0,0.7)',
        'kr-button': 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 0 #78350F, 0 8px 15px rgba(0,0,0,0.6)',
        'kr-gold': '0 0 25px rgba(245, 158, 11, 0.45)',
        'kr-crimson': '0 0 25px rgba(220, 38, 38, 0.45)'
      }
    },
  },
  plugins: [],
}
