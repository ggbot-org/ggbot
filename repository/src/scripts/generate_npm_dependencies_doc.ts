import { writeFile } from "node:fs/promises"
import { join } from "node:path"

import { Repository } from "../Repository.js"
import { WorkspacePackageJson } from "../WorkspacePackageJson.js"

type InternalDependencyRelation = [string, string]

type InternalDependencyGraph = InternalDependencyRelation[]

const internalDependencyGraph: InternalDependencyGraph = []
const graphInternalDependencyRows: string[] = []

const repository = new Repository()
await repository.read()
const repositoryDocsDir = join(repository.pathname, "docs")

const pathname = join(repositoryDocsDir, "npm-dependencies.md")

// Node text cannot contain `@`
const packageGraphNode = (packageName: string) =>
	packageName.startsWith("@") ? packageName.substring(1) : packageName

const isInternalDependency = (packageName: string) =>
	packageName.startsWith(WorkspacePackageJson.scope)

for (const workspace of repository.workspaces.values()) {
	const workspacePackageJson = workspace.packageJson
	const packageName = workspacePackageJson.packageName
	for (const dependency of workspacePackageJson.dependencies.keys())
		if (isInternalDependency(dependency))
			internalDependencyGraph.push([packageName, dependency])
}

for (const [packageName, dependency] of internalDependencyGraph) {
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
