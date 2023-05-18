import { packagePublicDir, packageRootDir } from "@ggbot2/repo";

const rootDir = packageRootDir(import.meta.url);

export const publicDir = packagePublicDir(rootDir);
