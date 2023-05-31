import { privacyHtmlFilename } from "src/pages/privacy.html.js";
import { termsHtmlFilename } from "src/pages/terms.html.js";

export const pathname = {
  privacyPolicyPage: () => `${privacyHtmlFilename}`,
  termsOfServicePage: () => `/${termsHtmlFilename}`,
};
