import { repoDir } from "./repoDir.js"
import { RepoPackageJson } from "./RepoPackageJson.js"

const repoPackageJson = new RepoPackageJson(repoDir)
await repoPackageJson.read()

export const repoPackage = repoPackageJson
