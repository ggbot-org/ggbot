import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"

import { commonNodeTextToDflowKind, nodeTextToViewType } from "./nodeResolution.js"

test("commonNodeTextToDflowKind", () => {
	assertEqual<string, ReturnType<typeof commonNodeTextToDflowKind>>(
		commonNodeTextToDflowKind,
		[
			{ input: "this is a comment", output: "info" },
			{ input: "foo", output: "foo" },
			{ input: "%1", output: "perc" },
			{ input: "[1,2,3]", output: "data" }
		]
	)
})

type NodeTextToViewType = typeof nodeTextToViewType

describe("nodeTextToViewType", () => {
	test("resolves node containing comments to `info` type", () => {
		assertEqual<Parameters<NodeTextToViewType>[0], ReturnType<NodeTextToViewType>>(
			nodeTextToViewType, [
				{ input: "this is a comment, it contains spaces", output: "info" },
				{ input: "this\nis\na\ncomment", output: "info" },
				{ input: "thisCouldBeSomeNode", output: undefined }
			])
	})

	test("resolves node containing JSON to `json` type", () => {
		assertEqual<Parameters<NodeTextToViewType>[0], ReturnType<NodeTextToViewType>>(
			nodeTextToViewType, [
				{ input: "1", output: "json" },
				{ input: "true", output: "json" },
				{ input: "false", output: "json" },
				{ input: '{"message":"hello world"}', output: "json" },
				{ input: "[ 1 ]", output: "json" }
			])
	})

	test("resolves node containing a percentage to `percentage` type", () => {
		assertEqual<Parameters<NodeTextToViewType>[0], ReturnType<NodeTextToViewType>>(
			nodeTextToViewType, [
				{ input: "1%", output: "perc" },
				{ input: "0%", output: "perc" },
				{ input: "-1%", output: "perc" },
				{ input: "1.5%", output: "perc" },
				{ input: "10.1 %", output: "perc" },
				{ input: "1  %", output: "perc" },
				{ input: " -2  %", output: "perc" }
			])
	})
})
