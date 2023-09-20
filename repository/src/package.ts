import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const packageDir = resolve(
	dirname(dirname(fileURLToPath(import.meta.url)))
)
