/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f4',
          100: '#fde6e9',
          200: '#fbd0d8',
          300: '#f7a8b9',
          400: '#f27594',
          500: '#e84971',
          600: '#d42959',
          700: '#b21e48',
          800: '#951c42',
          900: '#7f1c3e',
        },
      },
    },
  },
  plugins: [],
}
