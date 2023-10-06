import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

export const publicDir = join(packageDir, "public")
