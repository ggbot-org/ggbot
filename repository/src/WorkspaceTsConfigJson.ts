import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { TsConfigJson } from "type-fest"

import { FileProvider } from "./FileProvider.js"

export class WorkspaceTsConfigJson implements FileProvider {
	dirPathname: string
	filename = "tsconfig.json"

	compilerOptions: TsConfigJson["compilerOptions"] = {}

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
	}

	async read() {
		const text = await readFile(
			join(this.dirPathname, this.filename),
			"utf-8"
		)
		const { compilerOptions } = JSON.parse(text)
		this.compilerOptions = compilerOptions
	}
}
