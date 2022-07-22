const theme = require("./tailwind.theme");

module.exports = {
  content: [
    "./examples/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  plugins: [],
  theme,
};
