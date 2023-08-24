import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { PackageJson } from "type-fest"

import { JsonFile } from "./JsonFile.js"

export class WorkspacePackageJson implements JsonFile {
	dirPathname: string
	filename = "package.json"

	packageName: PackageJson["name"] = ""
	isPrivate: PackageJson["private"]
	dependencies: PackageJson["dependencies"] = {}
	devDependencies: PackageJson["devDependencies"] = {}

	constructor(dirPathname: string) {
		this.dirPathname = dirPathname
	}

	async read() {
		const text = await readFile(
			join(this.dirPathname, this.filename),
			"utf-8"
		)
		const {
			name,
			private: isPrivate,
			dependencies,
			devDependencies
		} = JSON.parse(text) as PackageJson
		this.packageName = name
		this.isPrivate = isPrivate
		this.dependencies = dependencies
		this.devDependencies = devDependencies
	}
}
