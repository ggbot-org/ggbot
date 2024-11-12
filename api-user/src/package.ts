import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

const monorepoDir = dirname(workspaceDir)

export const externalDependenciesJson = join(workspaceDir, "external-dependencies.json")

export const dflowWorkspacePackageJson = join(monorepoDir, "dflow", "package.json")
export const modelsWorkspacePackageJson = join(monorepoDir, "models", "package.json")
