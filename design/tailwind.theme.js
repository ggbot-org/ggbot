const colors = require("tailwindcss/colors");

module.exports = {
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: "#070900",
    white: "#faffff",
    brand: "#09eae5",
    dark: {
      background: "#4e4d4a",
    },
    light: {
      background: "#faffff",
    },
    ...colors,
  },
  extend: {
    fontSize: {
      "2xs": "0.625rem",
    },
  },
};
