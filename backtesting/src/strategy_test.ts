import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { BacktestingStrategy } from "./strategy.js"

export const emptyStrategy = () =>
	new BacktestingStrategy({
		flow: { nodes: [], edges: [] },
		strategyKey: { strategyKind: "test", strategyId: "00000000" },
		strategyName: "empty strategy"
	})

void describe("BacktestingStrategy", () => {
	void test("constructor", () => {
		assert.ok(emptyStrategy() instanceof BacktestingStrategy)
	})
})
