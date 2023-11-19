import { describe, test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { nullId } from "./item.js"
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
						id: nullId,
						status: "active",
						frequency: { every: 1, interval: "1h" }
					},
					output: true
				},
				{
					input: {
						id: nullId,
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
						id: nullId,
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
