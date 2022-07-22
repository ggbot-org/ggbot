const colors = require("tailwindcss/colors");

module.exports = {
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: "#070900",
    white: "#faffff",
    danger: colors.red,
    mono: colors.neutral,
    primary: {
      ...colors.cyan,
      brand: "#09eae5",
    },
  },
  extend: {},
};
