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
        cyber: {
          bg: '#070b14',
          card: 'rgba(15, 23, 42, 0.75)',
          surface: '#0f172a',
          border: 'rgba(59, 130, 246, 0.2)',
          accent: '#3b82f6',
          cyan: '#06b6d4',
          neon: '#00f0ff',
          safe: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          purple: '#8b5cf6'
        }
      },
      boxShadow: {
        'neon-blue': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'neon-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.5)',
        'neon-red': '0 0 20px -5px rgba(239, 68, 68, 0.5)',
        'neon-green': '0 0 20px -5px rgba(16, 185, 129, 0.5)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
