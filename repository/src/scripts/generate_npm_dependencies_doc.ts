import { writeFile } from "node:fs/promises"
import { join } from "node:path"

import { repositoryDocsDir } from "../repository.js"
import { repositoryPackageJsons } from "../repositoryPackages.js"
import { WorkspacePackageJson } from "../WorkspacePackageJson.js"

const { workspaceMap } = await repositoryPackageJsons()

const pathname = join(repositoryDocsDir, "npm-dependencies.md")

const graphInternalDependencyRows: string[] = []

// Node text cannot contain `@`
const packageGraphNode = (packageName: string) =>
	packageName.startsWith("@") ? packageName.substring(1) : packageName

const isInternalDependency = (packageName: string) =>
	packageName.startsWith(WorkspacePackageJson.scope)

for (const workspacePackageJson of workspaceMap.values()) {
	const packageName = workspacePackageJson.packageName
	for (const dependency of workspacePackageJson.dependencies.keys())
		if (isInternalDependency(dependency))
			graphInternalDependencyRows.push(
				`    ${packageGraphNode(packageName)} --- ${packageGraphNode(
					dependency
				)}`
			)
}

const graphRows = [
	"```mermaid",
	"graph LR",
	...graphInternalDependencyRows,
	"```",
	""
]

const content = `
# npm dependencies

This is the internal dependencies graph: it shows how workspaces depend on each other.

${graphRows.join("\n")}

`

await writeFile(pathname, content, { encoding: "utf8" })
