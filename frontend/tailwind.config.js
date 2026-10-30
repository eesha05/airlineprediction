/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aviation: {
          navy: "#0a192f",
          darkNavy: "#071224",
          blue: "#1e3a8a",
          accent: "#0ea5e9",
          slate: "#f8fafc",
          card: "#ffffff"
        }
      }
    },
  },
  plugins: [],
}
