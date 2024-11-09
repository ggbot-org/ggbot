import { join } from "node:path"

import readFile from "read-file-utf8"

import { FileProvider } from "./filesystemProviders.js"
import { TsconfigJson } from "./TsconfigJson.js"

export class RepositoryTsconfigJson implements FileProvider {
	directoryPathname: string
	filename = "tsconfig.json"
	/** Maps the compilerOptions.paths key to the first element of its value */
	paths = new Map<string, string>()

	constructor(directoryPathname: string) {
		this.directoryPathname = directoryPathname
	}

	async read() {
		const { compilerOptions } = await readFile<TsconfigJson>(
			join(this.directoryPathname, this.filename)
		)
		if (!compilerOptions) return
		const { paths } = compilerOptions
		if (!paths) return
		for (const [key, path] of Object.entries(paths).map(([key, list]) => [
			key,
			list[0]
		])) this.paths.set(key, path)
	}
}
