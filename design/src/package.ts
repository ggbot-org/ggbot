import { join } from "node:path"

import { packageDir, packageRootDir } from "@ggbot2/repo"

const rootDir = packageRootDir(import.meta.url)

export const publicDir = packageDir(rootDir, "public")

export const srcDir = packageDir(rootDir, "src")

export const srcPagesDir = join(srcDir, "webapp", "pages")

export const indexHtmlFilename = "index.html"
export const indexHtmlAppJs = "homepage.js"
export const indexHtmlEntryPoint = join(srcPagesDir, "homepage.tsx")
