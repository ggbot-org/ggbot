import { existsSync, mkdirSync } from "node:fs"

/** Create directory if it does not exist. */
export const createDir = (dir: string) => {
	if (!existsSync(dir)) mkdirSync(dir)
}
