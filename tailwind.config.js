/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jati': 'var(--color-primary, #8E44AD)',  // Color principal con fallback
        'shop': 'var(--color-secondary, #E67E22)',  // Color secundario con fallback
      }
    },
  },
  plugins: [],
}