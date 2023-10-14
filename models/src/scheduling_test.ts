import { describe, test } from "node:test"

import { assertDeepEqual, assertEqual } from "minimal-assertion-helpers"

import {
	getSchedulingSummary,
	Scheduling,
	schedulingsAreInactive,
	SchedulingSummary
} from "./scheduling.js"

describe("getSchedulingSummary", () => {
	test("return a SchedulingSummary", () => {
		assertDeepEqual<Scheduling[], SchedulingSummary>(getSchedulingSummary, [
			{
				input: [],
				output: {
					active: 0,
					inactive: 0,
					suspended: 0
				}
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 1, interval: "1h" }
					}
				],
				output: {
					active: 0,
					inactive: 1,
					suspended: 0
				}
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "active",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: {
					active: 1,
					inactive: 1,
					suspended: 0
				}
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "inactive",
						frequency: { every: 3, interval: "1h" }
					},
					{
						status: "suspended",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: {
					active: 0,
					inactive: 2,
					suspended: 1
				}
			}
		])
	})
})

describe("schedulingsAreInactive", () => {
	test("checks if schedulings are inactive overall", () => {
		assertEqual<Scheduling[], boolean>(schedulingsAreInactive, [
			{
				input: [],
				output: true
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 1, interval: "1h" }
					}
				],
				output: true
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "active",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: false
			},
			{
				input: [
					{
						status: "inactive",
						frequency: { every: 2, interval: "1h" }
					},
					{
						status: "inactive",
						frequency: { every: 3, interval: "1h" }
					}
				],
				output: true
			}
		])
	})
})
