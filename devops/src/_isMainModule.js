import { fileURLToPath } from "node:url";

/**
 * @param {String} importMetaUrl
 */
export const isMainModule = (importMetaUrl) => {
  if (importMetaUrl.startsWith("file:")) {
    const modulePath = fileURLToPath(importMetaUrl);
    return process.argv[1] === modulePath;
  }
  return false;
};
