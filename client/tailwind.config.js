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
        background: '#0B0F19',
        card: '#111827',
        'card-border': '#1F2937',
        primary: {
          50: '#ECFEFF',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490'
        },
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED'
        },
        apex: {
          gold: '#F59E0B',
          cyan: '#06B6D4',
          crimson: '#EF4444',
          emerald: '#10B981',
          purple: '#A855F7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
