import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { exit } from 'node:process'

import { buildWorkspacesDependencies, Repository, WorkspacePackageJson } from '@workspace/repository'
import readFile from 'read-file-utf8'
import writeFile from 'write-file-utf8'

import { ApiLambda, ApiLambdaPublic, ApiLambdaStripeAction, ApiLambdaUser } from './apiLambdas.js'

export async function prepareApi(workspacePathname: string) {
	// Instantiate ApiLambda.
	// TODO put this in a function in apiLambdas to be imported by deploy_api and create_api scripts.

	let apiLamda: ApiLambda | undefined

	if (workspacePathname == 'api-user') apiLamda = new ApiLambdaUser()
	if (workspacePathname == 'api-public') apiLamda = new ApiLambdaPublic()
	if (workspacePathname == 'api-stripe-action') apiLamda = new ApiLambdaStripeAction()

	if (!apiLamda) {
		console.error('Cannot instantiate API Lambda for workspace', workspacePathname)
		exit(1)
	}

	// Prepare workspace folders.

	const repository = new Repository()
	await repository.read()

	const { workspaces } = repository

	const distDir = join(repository.pathname, workspacePathname, 'dist')
	const lambdaDir = join(distDir, 'lambda')
	const nodeModulesDir = join(lambdaDir, 'node_modules')

	// Build API workspace.

	await buildWorkspacesDependencies(workspacePathname)
	execSync(`npm run build:api:${workspacePathname.substring('api-'.length)}`, { cwd: repository.pathname })

	// Cleanup dist directory, if any.
	rmSync(distDir, { force: true, recursive: true })

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

	// Create zip file.

	execSync('zip -X -r ../lambda.zip *', { cwd: lambdaDir })
}
