import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import {
	commonNodeTextToDflowKind,
	nodeTextToViewType
} from "./nodeResolution.js"

void describe("commonNodeTextToDflowKind", () => {
	void test("works", () => {
		[
			{ input: "this is a comment", output: "info" },
			{ input: "foo", output: "foo" },
			{ input: "%1", output: "perc" },
			{ input: "[1,2,3]", output: "data" }
		].forEach(({ input, output }) => {
			assert.equal(commonNodeTextToDflowKind(input), output)
		})
	})
})

void describe("nodeTextToViewType", () => {
	void test("resolves node containing comments to `info` type", () => {
		[
			{ input: "this is a comment, it contains spaces", output: "info" },
			{ input: "this\nis\na\ncomment", output: "info" }
		].forEach(({ input, output }) => {
			assert.equal(nodeTextToViewType(input), output)
		})

		assert.equal(nodeTextToViewType("thisCouldBeSomeNode"), undefined)
	})

	void test("resolves node containing JSON to `json` type", () => {
		[
			{ input: "1", output: "json" },
			{ input: "true", output: "json" },
			{ input: "false", output: "json" },
			{ input: '{"message":"hello world"}', output: "json" },
			{ input: "[ 1 ]", output: "json" }
		].forEach(({ input, output }) => {
			assert.equal(nodeTextToViewType(input), output)
		})
	})

	void test("resolves node containing a percentage to `percentage` type", () => {
		[
			{ input: "1%", output: "perc" },
			{ input: "0%", output: "perc" },
			{ input: "-1%", output: "perc" },
			{ input: "1.5%", output: "perc" },
			{ input: "10.1 %", output: "perc" },
			{ input: "1  %", output: "perc" },
			{ input: " -2  %", output: "perc" }
		].forEach(({ input, output }) => {
			assert.equal(nodeTextToViewType(input), output)
		})
	})
})
