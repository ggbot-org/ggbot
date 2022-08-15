import { fileURLToPath } from "node:url";
export const isMainModule = (importMetaUrl) => {
    if (importMetaUrl.startsWith("file:")) {
        const modulePath = fileURLToPath(importMetaUrl);
        return process.argv[1] === modulePath;
    }
    return false;
};
