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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36aef8',
          500: '#0c92eb',
          600: '#0074ca',
          700: '#015da4',
          800: '#064f87',
          900: '#0b4270',
          950: '#072a4a',
        }
      }
    },
  },
  plugins: [],
}
