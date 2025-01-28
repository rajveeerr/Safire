/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,jsx,js,ts}",
    "./src/**/*.html",
    "./**/*.{tsx,jsx,js,ts}",
    "./**/*.html"
  ],
  darkMode: "media",
  prefix: "plasmo-",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'serif'],
        'serif': ['Neuton', 'serif'],
      },
    },
  },
  plugins: [],
}

