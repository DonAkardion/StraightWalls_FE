/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        black: "var(--black)",
        yellow: "var(--yellow)",
        green: "var(--green)",
        red: "var(--red)",
        blue: "var(--blue)",
      },
      fontFamily: {
        jura: ["var(--font-jura)", "sans-serif"],
        koulen: ["var(--font-koulen)"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
