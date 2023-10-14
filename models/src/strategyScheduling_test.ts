import { describe, test } from "node:test"

import { MaybeObject } from "minimal-type-guard-helpers"

import { assertEqual } from "./assertions.js"
import {
	isStrategyScheduling,
	StrategyScheduling
} from "./strategyScheduling.js"

describe("isStrategyScheduling", () => {
	test("validates StrategyScheduling", () => {
		assertEqual<MaybeObject<StrategyScheduling>, boolean>(
			isStrategyScheduling,
			[
				{
					input: {
						id: "00000000",
						status: "active",
						frequency: { every: 1, interval: "1h" }
					},
					output: true
				},
				{
					input: {
						id: "00000000",
						status: "active",
						frequency: { every: 1, interval: "1h" },
						params: {
							"param 1": 123
						}
					},
					output: true
				},
				{
					input: {
						id: "00000000",
						status: "active",
						frequency: { every: 1, interval: "1h" },
						memory: {
							"label 1": 123
						}
					},
					output: true
				}
			]
		)
	})
})
