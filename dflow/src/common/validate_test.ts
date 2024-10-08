import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { StrategyFlowGraph } from "@workspace/models"
import { DflowNodesCatalog } from "dflow"
import { now } from "minimal-time-helpers"

import { ErrorUknownDflowNodes } from "../errors.js"
import { DflowCommonHost } from "./host.js"
import { dflowValidate } from "./validate.js"

describe("dflowValidate", () => {
	test("throws ErrorUknownDflowNodes", () => {
		const nodesCatalog: DflowNodesCatalog = {}
		const graph: StrategyFlowGraph = {
			nodes: [{ id: "n1", text: "unknownNode" }],
			edges: []
		}
		assert.throws(
			() => {
				dflowValidate({ nodesCatalog, graph })
			},
			{
				name: "Error",
				message: ErrorUknownDflowNodes.message
			}
		)
	})

	test("ignores info nodes", () => {
		const nodesCatalog: DflowNodesCatalog = {}
		const graph: StrategyFlowGraph = {
			nodes: [{ id: "n1", text: "this is a comment" }],
			edges: []
		}
		assert.doesNotThrow(() => {
			dflowValidate({ nodesCatalog, graph })
		}, Error)
	})

	test("validates json nodes", () => {
		const dflow = new DflowCommonHost(
			{ nodesCatalog: {} },
			{
				defaults: {},
				params: {},
				memory: {},
				time: now()
			}
		)
		const graph: StrategyFlowGraph = {
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
			dflowValidate({ nodesCatalog: dflow.nodesCatalog, graph })
		}, Error)
	})
})
