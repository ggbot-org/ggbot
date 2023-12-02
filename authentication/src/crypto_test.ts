import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { decrypt, encrypt } from "./crypto.js"

void describe("encrypt and decrypt", () => {
	void test("their composition is the identity", async () => {
		const data = "Hello"
		const password = "secr3t"
		const encryptedData = await encrypt(data, password)
		const decryptedData = await decrypt(encryptedData, password)
		assert.equal(decryptedData, data)
	})
})
