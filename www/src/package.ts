import { join } from "node:path";

import { packageDir, packageRootDir } from "@ggbot2/repo";

export { privacyHtmlFilename, termsHtmlFilename } from "./routing/pages.js";

const rootDir = packageRootDir(import.meta.url);

export const publicDir = packageDir(rootDir, "public");

export const srcDir = packageDir(rootDir, "src");

export const srcPagesDir = join(srcDir, "pages");

export const indexHtmlAppJs = "home.js";
export const indexHtmlFilename = "index.html";
export const indexHtmlEntryPoint = join(srcPagesDir, "homepage.tsx");

export const privacyHtmlAppJs = "privacy.js";
export const privacyHtmlEntryPoint = join(srcPagesDir, "privacy.tsx");

export const termsHtmlAppJs = "terms.js";
export const termsHtmlEntryPoint = join(srcPagesDir, "terms.tsx");
