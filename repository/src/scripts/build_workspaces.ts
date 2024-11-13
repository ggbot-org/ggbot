import { exec } from 'node:child_process'

import { Repository } from '../Repository.js'
import { RepositoryPackageJson } from '../RepositoryPackageJson.js'

const repository = new Repository()
await repository.read()

const command = RepositoryPackageJson.buildCommandSequence(repository.workspaces)

exec(command, { cwd: repository.pathname }, (error) => {
	if (error) {
		console.error(error)
		process.exit(1)
	}
})
