import { fileURLToPath } from "node:url";

/**
 * @param {string} importMetaUrl
 */
export const isMainModule = (importMetaUrl) =>
  importMetaUrl.startsWith("file:") &&
  fileURLToPath(importMetaUrl) === process.argv[1];
