import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { TsConfigJson } from "type-fest"

import { FileProvider } from "./filesystemProviders.js"

export class WorkspaceTsConfigJson implements FileProvider {
	directoryPathname: string
	filename = "tsconfig.json"

	compilerOptions: TsConfigJson["compilerOptions"] = {}

	constructor(directoryPathname: string) {
		this.directoryPathname = directoryPathname
	}

	async read() {
		const text = await readFile(
			join(this.directoryPathname, this.filename),
			"utf-8"
		)
		const { compilerOptions } = JSON.parse(text)
		this.compilerOptions = compilerOptions
	}
}
