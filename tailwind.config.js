/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#421f19",
        secondary: "#b77f6e",
      },
      spacing: {
        large: "14rem",
        primary: "9.8rem",
        secondary: "4.8rem",
      },
    },
    fontFamily: {
      name1: [""],
      name2: [""],
    },

    screens: {
      xs: "320px",
      ss: "420px",
      sm: "578px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      xxl: "1440px",
      xll: "1550px",
      xxll: "1750px",
    },
  },
  plugins: [],
};
