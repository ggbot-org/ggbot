import { join } from 'node:path'

import writeFile from 'write-file-utf8'

import { Repository } from '../Repository.js'
import { WorkspacePackageJson } from '../WorkspacePackageJson.js'

type InternalDependencyRelation = [packageName: string, dependency: string]

type InternalDependencyGraph = InternalDependencyRelation[]

const internalDependencyGraph: InternalDependencyGraph = []
const graphInternalDependencyRows: string[] = []

const repository = new Repository()
await repository.read()
const repositoryDocsDir = join(repository.pathname, 'repository', 'docs')

const pathname = join(repositoryDocsDir, 'npm-dependencies.md')

function internalPackageGraphNode(packageName: string) {
	return packageName.substring(WorkspacePackageJson.scope.length + 1)
}

function allDependencies(
	wantedPackageName: string,
	internalDependencyGraph: InternalDependencyGraph,
	foundDependencies: string[] = []
): string[] {
	const dependencies: string[] = foundDependencies
	for (const [packageName, dependency] of internalDependencyGraph) {
		if (packageName !== wantedPackageName) continue
		if (dependencies.includes(dependency)) continue
		dependencies.push(dependency)
		dependencies.push(
			...allDependencies(dependency, internalDependencyGraph, dependencies)
		)
	}
	return dependencies
}

function isRedundantDependency(
	[packageName, dependency]: InternalDependencyRelation,
	internalDependencyGraph: InternalDependencyGraph
): boolean {
	const packageDependencies = internalDependencyGraph.filter(
		(item) => item[0] === packageName
	)

	for (const dependencyRelation of packageDependencies) {
		const siblingDependencyRelations = packageDependencies.filter(
			([_, dependency]) => dependencyRelation[1] !== dependency
		)
		for (const [_, siblingDependency] of siblingDependencyRelations) {
			if (
				allDependencies(siblingDependency, internalDependencyGraph).includes(
					dependency
				)
			)
				return true
		}
	}

	return false
}

for (const workspace of repository.workspaces.values()) {
	const workspacePackageJson = workspace.packageJson
	const packageName = workspacePackageJson.packageName
	for (const dependency of workspacePackageJson.dependencies.keys()) {
		if (WorkspacePackageJson.isInternalDependency(dependency)) {
			internalDependencyGraph.push([packageName, dependency])
		}
	}
}

for (const dependencyRelation of internalDependencyGraph) {
	if (!isRedundantDependency(dependencyRelation, internalDependencyGraph)) {
		graphInternalDependencyRows.push(
			`    ${internalPackageGraphNode(dependencyRelation[0])} --- ${internalPackageGraphNode(dependencyRelation[1])}`
		)
	}
}

function graphRows(graphInternalDependencyRows: string[]) {
	return [
		'```mermaid',
		'graph LR',
		...graphInternalDependencyRows,
		'```',
		'',
	].join('\n')
}

const content = `
# npm dependencies

This is the internal dependencies graph: it shows how workspaces depend on each other.

${graphRows(graphInternalDependencyRows)}

`

await writeFile(pathname, content)
