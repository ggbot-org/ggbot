/* eslint-disable no-console */
import { exec } from "node:child_process"

import { Repository } from "../Repository.js"
import { RepositoryPackageJson } from "../RepositoryPackageJson.js"
import { WorkspacePackageJson } from "../WorkspacePackageJson.js"

/**
 * This script accepts the `workspacePathname` as parameter.
 *
 * @example
 *
 * For example in the root package.json, for workspace `foo` add the following
 * scripts.
 *
 * ```json
 * "scripts": {
 * 	"build:foo":"npmrunbuild-wfoo","prebuild:foo": "npm run build_workspace_dependencies -w repository foo";
 * }
 * ```
 */
const workspacePathname = process.argv[2]
if (typeof workspacePathname !== "string") process.exit(1)

const repository = new Repository()
await repository.read()

const { workspaces } = repository

const internalDependenciesChain =
	WorkspacePackageJson.internalDependenciesChain(
		workspacePathname,
		workspaces
	)

const command = RepositoryPackageJson.workspacePrebuildCommandSequence(
	internalDependenciesChain,
	workspaces
)

exec(command, { cwd: repository.pathname }, (error) => {
	if (error) {
		console.error(error)
		process.exit(1)
	}
})
