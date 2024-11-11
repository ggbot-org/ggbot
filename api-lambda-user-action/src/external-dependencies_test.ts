import { strict as assert } from "node:assert"
import { test } from "node:test"

import readFile from "read-file-utf8"

import { dflowWorkspacePackageJson, externalDependenciesJson, modelsWorkspacePackageJson } from "./package.js"

type Dependencies = {
	dependencies: { [key in string]: string }
}

test("external-dependencies.json", async () => {
	const externalDependencies = await readFile<Dependencies>(externalDependenciesJson)
	const dflow = await readFile<Dependencies>(dflowWorkspacePackageJson)
	const models = await readFile<Dependencies>(modelsWorkspacePackageJson)

	assert.equal(externalDependencies.dependencies.dflow, dflow.dependencies.dflow)
	assert.equal(externalDependencies.dependencies["minimal-time-helpers"], models.dependencies["minimal-time-helpers"])
	assert.equal(externalDependencies.dependencies["minimal-type-guard-helpers"], models.dependencies["minimal-type-guard-helpers"])
})
