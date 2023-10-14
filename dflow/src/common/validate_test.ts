import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { DflowNodesCatalog } from "dflow"
import { now } from "minimal-time-helpers"

import { ErrorUknownDflowNodes } from "../errors.js"
import { DflowExecutorView } from "./executor.js"
import { DflowCommonHostMock } from "./mocks/host.js"
import { commonNodeTextToDflowKind } from "./nodeResolution.js"
import { dflowValidate } from "./validate.js"

describe("dflowValidate", () => {
	test("throws ErrorUknownDflowNodes", () => {
		const nodesCatalog: DflowNodesCatalog = {}
		const view: DflowExecutorView = {
			nodes: [{ id: "n1", text: "unknownNode" }],
			edges: []
		}
		assert.throws(
			() => {
				dflowValidate({
					nodesCatalog,
					nodeTextToDflowKind: commonNodeTextToDflowKind,
					view
				})
			},
			{
				name: "Error",
				message: ErrorUknownDflowNodes.message
			}
		)
	})

	test("ignores info nodes", () => {
		const nodesCatalog: DflowNodesCatalog = {}
		const view: DflowExecutorView = {
			nodes: [{ id: "n1", text: "this is a comment" }],
			edges: []
		}
		assert.doesNotThrow(() => {
			dflowValidate({
				nodesCatalog,
				nodeTextToDflowKind: commonNodeTextToDflowKind,
				view
			})
		}, Error)
	})

	test("validates json nodes", () => {
		const dflow = new DflowCommonHostMock(
			{ nodesCatalog: {} },
			{ params: {}, memory: {}, time: now() }
		)
		const view: DflowExecutorView = {
			nodes: [
				{
					id: "n1",
					text: '{"message":"hello world"}',
					outs: [{ id: "o1" }]
				}
			],
			edges: []
		}
		assert.doesNotThrow(() => {
			dflowValidate({
				nodesCatalog: dflow.nodesCatalog,
				nodeTextToDflowKind: commonNodeTextToDflowKind,
				view
			})
		}, Error)
	})
})
