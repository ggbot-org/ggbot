const tailwindConfig = require("./tailwind.config");

module.exports = {
  ...tailwindConfig,
  content: ["./src/**/*.{ts,tsx}"],
};
