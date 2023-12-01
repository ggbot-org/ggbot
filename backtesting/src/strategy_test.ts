import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { BacktestingStrategy } from "./strategy.js"

export const emptyStrategy = () =>
	new BacktestingStrategy({
		strategyKey: { strategyKind: "test", strategyId: "00000000" },
		view: { nodes: [], edges: [] }
	})

void describe("BacktestingStrategy", () => {
	void test("constructor", () => {
		assert.ok(emptyStrategy() instanceof BacktestingStrategy)
	})
})
