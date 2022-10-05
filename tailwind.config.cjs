// This file is not used by workspaces but it is here to activate
// editor plugins or other tools that expect a tailwind config file in the
// project root folder.
const theme = require("./ui-components/tailwind.theme");

module.exports = {
  // List here every folder in any workspace that uses tailwind.
  content: [
    "./admin-webapp/components/**/*.{ts,tsx}",
    "./admin-webapp/pages/**/*.{ts,tsx}",
    "./ui-components/examples/**/*.{ts,tsx}",
    "./ui-components/pages/**/*.{ts,tsx}",
    "./ui-components/src/**/*.{ts,tsx}",
    "./user-webapp/components/**/*.{ts,tsx}",
    "./user-webapp/pages/**/*.{ts,tsx}",
    "./website/components/**/*.{ts,tsx}",
    "./website/pages/**/*.{ts,tsx}",
  ],
  plugins: [],
  theme,
};
