const defaultTheme = require("tailwindcss/defaultTheme");



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Consolas", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}