/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryPurple : "#4E436C",
        background: "#F4F7FA",
        accentGreen: "#3BA58A",
        primarySky: "#94C4C6",
        primaryGreen: "#3AA78C"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}