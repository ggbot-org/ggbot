import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export const rootDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))
