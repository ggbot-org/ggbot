import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { packageRootDir } from "./packageRootDir.js"

describe("packageRootDir", () => {
	it("returns package root dir", () => {
		assert.equal(
			packageRootDir("file:///repo/my-package/src/package.js"),
			"/repo/my-package"
		)
	})
})
