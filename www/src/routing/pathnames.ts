import { privacyHtmlFilename } from "../pages/privacy.html.js";
import { termsHtmlFilename } from "../pages/terms.html.js";

export const pathname = {
  privacyPolicyPage: () => `${privacyHtmlFilename}`,
  termsOfServicePage: () => `/${termsHtmlFilename}`,
};
