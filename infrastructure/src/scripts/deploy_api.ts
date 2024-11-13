import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import { Repository, WorkspacePackageJson } from '@workspace/repository'
import readFile from 'read-file-utf8'
import writeFile from 'write-file-utf8'

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for API workspace `api-foo` add the following scripts.
 *
 * ```json
 * "scripts": {
 * 	"build:api:foo": "npm run build -w api-foo",
 * 	"deploy:api:foo": "npm run deploy_api -w infrastructure api-foo",
 * 	"predeploy:api:foo": "npm run build:api:foo",
 *  "prebuild:api:foo": "npm run build_workspace_dependencies -w repository api-foo",
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname !== 'string') process.exit(1)

const repository = new Repository()
await repository.read()

const { workspaces } = repository

const lambdaDir = join(repository.pathname, workspacePathname, 'dist', 'lambda')
const nodeModulesDir = join(lambdaDir, 'node_modules')

// Cleanup node_modules directory, if any.
rmSync(nodeModulesDir, { force: true, recursive: true })

// Create temporary package.json with external dependencies and install them.

const externalDependencies = WorkspacePackageJson.externalDependenciesChain(workspacePathname, workspaces)

await writeFile(join(lambdaDir, 'package.json'), JSON.stringify({
	name: workspacePathname,
	type: 'module',
	dependencies: Object.fromEntries(externalDependencies)
}, null, 2))

execSync('npm install', { cwd: lambdaDir })

// Copy internal dependencies.

const internalDependencies = WorkspacePackageJson.internalDependenciesChain(workspacePathname, workspaces)

for (const internalDependency of internalDependencies) {
	if (internalDependency === '@workspace/tsconfig') continue
	const workspacePathname = WorkspacePackageJson.workspacePathnameFromInternalDependency(internalDependency)
	const workspaceDir = join(repository.pathname, workspacePathname)
	const nodeModulesWorkspaceDir = join(nodeModulesDir, WorkspacePackageJson.scope, workspacePathname)
	mkdirSync(nodeModulesWorkspaceDir, { recursive: true })
	const packageJson = await readFile(join(workspaceDir, 'package.json'))
	await writeFile(join(nodeModulesWorkspaceDir, 'package.json'), JSON.stringify(packageJson, null, 2))
	cpSync(join(workspaceDir, 'dist'), join(nodeModulesWorkspaceDir, 'dist'), { recursive: true })
}
