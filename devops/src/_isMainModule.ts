import { fileURLToPath } from "node:url";

export const isMainModule = (importMetaUrl: string) =>
  importMetaUrl.startsWith("file:") &&
  fileURLToPath(importMetaUrl) === process.argv[1];
