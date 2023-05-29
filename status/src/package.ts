import { packageDir, packageRootDir } from "@ggbot2/repo";

const rootDir = packageRootDir(import.meta.url);

export const publicDir = packageDir(rootDir, "public");
