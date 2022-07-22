const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      danger: colors.red,
      mono: colors.neutral,
      primary: colors.cyan,
    },
    extend: {},
  },
  plugins: [],
};
