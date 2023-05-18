import { existsSync, mkdirSync } from "node:fs";

export const mkdir = (dir: string) => {
  if (!existsSync(dir)) mkdirSync(dir);
};
