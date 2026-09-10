/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          gold: '#f59e0b',
          purple: '#8b5cf6',
          dark: '#0f172a',
          card: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
