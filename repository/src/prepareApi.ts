import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import readFile from 'read-file-utf8'
import writeFile from 'write-file-utf8'

import { buildWorkspacesDependencies } from './buildWorkspaceDependencies.js'
import { Repository } from './Repository.js'
import { WorkspacePackageJson } from './WorkspacePackageJson.js'

/**
 * Prepare API workspace for deployment.
 */
export async function prepareApi(workspacePathname: string): Promise<string> {
	// Prepare workspace folders.

	const repository = new Repository()
	await repository.read()

	const { workspaces } = repository

	const distDir = join(repository.pathname, workspacePathname, 'dist')
	const lambdaDir = join(distDir, 'lambda')
	const nodeModulesDir = join(lambdaDir, 'node_modules')

	const lambdaZipFilename = 'lambda.zip'
	const lambdaZipPathname = join(distDir, lambdaZipFilename)

	// Cleanup dist directory, if any.
	rmSync(distDir, { force: true, recursive: true })

	// Build API workspace.

	await buildWorkspacesDependencies(workspacePathname)

	const buildCommand = `npm run build:api:${workspacePathname.substring('api-'.length)}`
	console.info(buildCommand)
	execSync(buildCommand, { cwd: repository.pathname })

	// Create temporary package.json with external dependencies and install them.
	console.info('Install external dependencies')

	const externalDependencies = WorkspacePackageJson.externalDependenciesChain(
		workspacePathname,
		workspaces
	)

	await writeFile(
		join(lambdaDir, 'package.json'),
		JSON.stringify(
			{
				name: workspacePathname,
				type: 'module',
				dependencies: Object.fromEntries(externalDependencies),
			},
			null,
			2
		)
	)

	execSync('npm install --no-package-lock', { cwd: lambdaDir })

	// Copy internal dependencies.
	console.info('Install internal dependencies')

	const internalDependencies = WorkspacePackageJson.internalDependenciesChain(
		workspacePathname,
		workspaces
	)

	for (const internalDependency of internalDependencies) {
		if (internalDependency === '@workspace/tsconfig') continue
		const workspacePathname =
			WorkspacePackageJson.workspacePathnameFromInternalDependency(
				internalDependency
			)
		const workspaceDir = join(repository.pathname, workspacePathname)
		const nodeModulesWorkspaceDir = join(
			nodeModulesDir,
			WorkspacePackageJson.scope,
			workspacePathname
		)
		mkdirSync(nodeModulesWorkspaceDir, { recursive: true })
		const packageJson = await readFile(join(workspaceDir, 'package.json'))
		await writeFile(
			join(nodeModulesWorkspaceDir, 'package.json'),
			JSON.stringify(packageJson, null, 2)
		)
		cpSync(join(workspaceDir, 'dist'), join(nodeModulesWorkspaceDir, 'dist'), {
			recursive: true,
		})
	}

	// Create zip file.

	execSync(`zip -X -r ../${lambdaZipFilename} * `, { cwd: lambdaDir })

	return lambdaZipPathname
}
