/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        'attention': '#F59E0B',
        'danger': '#EF4444',
        'warning': '#EAB308',
        'success': '#22C55E',
      }
    },
  },
  plugins: [],
};