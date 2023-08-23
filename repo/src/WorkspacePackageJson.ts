import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { PackageJson } from "type-fest"

import { JsonFile } from "./JsonFile.js"

export class WorkspacePackageJson implements JsonFile {
	dirPathname: string
	filename = "package.json"

	packageName: PackageJson["name"] = ""
	dependencies: PackageJson["dependencies"] = {}

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
	}

	async read() {
		const text = await readFile(
			join(this.dirPathname, this.filename),
			"utf-8"
		)
		const { name, dependencies } = JSON.parse(text) as PackageJson
		this.packageName = name
		this.dependencies = dependencies
	}
}
