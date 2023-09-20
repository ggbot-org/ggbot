import { dirname, join } from "path"

import { packageDir } from "./package.js"

export const repositoryDir = dirname(packageDir)

export const repositoryDocsDir = join(repositoryDir, "docs")
