import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Frequency } from "@workspace/models"
import { DayInterval, isTime, Time } from "minimal-time-helpers"

import { BacktestingSession } from "./session.js"
import { BacktestingStrategy } from "./strategy.js"
import { emptyStrategy } from "./strategy_test.js"

const newSession = ({
	dayInterval,
	frequency,
	strategy
}: {
	dayInterval: NonNullable<BacktestingSession["dayInterval"]>
	frequency: NonNullable<BacktestingSession["frequency"]>
	strategy: NonNullable<BacktestingSession["strategy"]>
}) => {
	const session = new BacktestingSession()
	session.strategy = strategy
	session.dayInterval = dayInterval
	session.frequency = frequency
	session.computeTimes()
	return session
}

void describe("BacktestingSession", () => {
	void test("`canRun` is true only when `dayInterval`, `frequency` and `strategy` are provided", () => {
		const session = new BacktestingSession()
		assert.ok(!session.canRun)
		session.dayInterval = {
			start: "2000-01-01",
			end: "2001-01-01"
		}
		session.frequency = { every: 1, interval: "1h" }
		assert.ok(!session.canRun)
		session.strategy = emptyStrategy()
		assert.ok(!session.canRun)
		session.computeTimes()
		assert.ok(session.canRun)
	})

	void test('cannot set `dayInterval` while `status` is "running"', () => {
		const dayInterval1: DayInterval = {
			start: "2000-01-01",
			end: "2001-01-01"
		}
		const dayInterval2: DayInterval = {
			start: "2021-01-01",
			end: "2022-01-01"
		}
		const session = newSession({
			dayInterval: dayInterval1,
			frequency: { every: 1, interval: "1h" },
			strategy: emptyStrategy()
		})
		assert.deepEqual(session.dayInterval, dayInterval1)
		// Session is "running", `dayInterval` modifier does not apply.
		session.start()
		session.dayInterval = dayInterval2
		assert.deepEqual(session.dayInterval, dayInterval1)
		// Session is "paused", `dayInterval` modifier does not apply.
		session.pause()
		session.dayInterval = dayInterval2
		assert.deepEqual(session.dayInterval, dayInterval1)
		// Session is resumed, so it is "running" again, `dayInterval` modifier does not apply.
		session.resume()
		session.dayInterval = dayInterval2
		assert.deepEqual(session.dayInterval, dayInterval1)
		// Session is not "running" nor "paused", `dayInterval` modifier can set new value.
		session.stop()
		session.dayInterval = dayInterval2
		assert.deepEqual(session.dayInterval, dayInterval2)
	})

	void test('cannot set `frequency` while `status` is "running"', () => {
		const frequency1: Frequency = {
			every: 1,
			interval: "1h"
		}
		const frequency2: Frequency = {
			every: 20,
			interval: "1m"
		}
		const session = newSession({
			dayInterval: { start: "2000-01-01", end: "2001-01-01" },
			frequency: frequency1,
			strategy: emptyStrategy()
		})
		assert.deepEqual(session.frequency, frequency1)
		// Session is "running", `frequency` modifier does not apply.
		session.start()
		session.frequency = frequency2
		assert.deepEqual(session.frequency, frequency1)
		// Session is "paused", `frequency` modifier does not apply.
		session.pause()
		session.frequency = frequency2
		assert.deepEqual(session.frequency, frequency1)
		// Session is resumed, so it is "running" again, `frequency` modifier does not apply.
		session.resume()
		session.frequency = frequency2
		assert.deepEqual(session.frequency, frequency1)
		// Session is not "running" nor "paused", `frequency` modifier can set new value.
		session.stop()
		session.frequency = frequency2
		assert.deepEqual(session.frequency, frequency2)
	})

	void test('cannot set `strategy` while `status` is "running"', () => {
		const strategy1 = emptyStrategy()
		const strategy2 = new BacktestingStrategy({
			strategyKey: { strategyKind: "test", strategyId: "01010101" },
			view: { nodes: [{ id: "a", text: "true" }], edges: [] }
		})
		const session = newSession({
			dayInterval: {
				start: "2000-01-01",
				end: "2001-01-01"
			},
			frequency: { every: 1, interval: "1h" },
			strategy: strategy1
		})
		assert.deepEqual(session.strategy?.strategyKey, strategy1.strategyKey)
		assert.deepEqual(session.strategy?.view, strategy1.view)
		// Session is "running", `strategy` modifier does not apply.
		session.start()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.strategyKey, strategy1.strategyKey)
		assert.deepEqual(session.strategy?.view, strategy1.view)
		// Session is "paused", `strategy` modifier does not apply.
		session.pause()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.strategyKey, strategy1.strategyKey)
		assert.deepEqual(session.strategy?.view, strategy1.view)
		// Session is resumed, so it is "running" again, `strategy` modifier does not apply.
		session.resume()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.strategyKey, strategy1.strategyKey)
		assert.deepEqual(session.strategy?.view, strategy1.view)
		// Session is not "running" nor "paused", `strategy` modifier can set new value.
		session.stop()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.strategyKey, strategy2.strategyKey)
		assert.deepEqual(session.strategy?.view, strategy2.view)
	})

	void test('cannot set `strategyView` while `status` is "running"', () => {
		const strategy = emptyStrategy()
		const strategyView1 = strategy.view
		const strategyView2: BacktestingStrategy["view"] = {
			nodes: [{ id: "a", text: "true" }],
			edges: []
		}
		const session = newSession({
			dayInterval: {
				start: "2000-01-01",
				end: "2001-01-01"
			},
			frequency: { every: 1, interval: "1h" },
			strategy
		})
		assert.deepEqual(session.strategy?.view, strategyView1)
		// Session is "running", `strategy` modifier does not apply.
		session.start()
		session.strategyView = strategyView2
		assert.deepEqual(session.strategy?.view, strategyView1)
		// Session is "paused", `strategy` modifier does not apply.
		session.pause()
		session.strategyView = strategyView2
		assert.deepEqual(session.strategy?.view, strategyView1)
		// Session is resumed, so it is "running" again, `strategy` modifier does not apply.
		session.resume()
		session.strategyView = strategyView2
		assert.deepEqual(session.strategy?.view, strategyView1)
		// Session is not "running" nor "paused", `strategy` modifier can set new value.
		session.stop()
		session.strategyView = strategyView2
		assert.deepEqual(session.strategy?.view, strategyView2)
	})

	void test('`nextTime` return Time if status is "running"', () => {
		const session = newSession({
			dayInterval: {
				start: "2000-01-01",
				end: "2000-01-01"
			},
			frequency: { every: 1, interval: "1h" },
			strategy: emptyStrategy()
		})
		assert.equal(session.nextTime, undefined)
		session.start()
		let time: Time | undefined
		const dateIsoStrings: string[] = []
		while ((time = session.nextTime)) {
			assert.ok(isTime(time))
			if (!time) continue
			dateIsoStrings.push(new Date(time).toISOString())
		}
		assert.deepEqual(dateIsoStrings, [
			"2000-01-01T00:00:00.000Z",
			"2000-01-01T01:00:00.000Z",
			"2000-01-01T02:00:00.000Z",
			"2000-01-01T03:00:00.000Z",
			"2000-01-01T04:00:00.000Z",
			"2000-01-01T05:00:00.000Z",
			"2000-01-01T06:00:00.000Z",
			"2000-01-01T07:00:00.000Z",
			"2000-01-01T08:00:00.000Z",
			"2000-01-01T09:00:00.000Z",
			"2000-01-01T10:00:00.000Z",
			"2000-01-01T11:00:00.000Z",
			"2000-01-01T12:00:00.000Z",
			"2000-01-01T13:00:00.000Z",
			"2000-01-01T14:00:00.000Z",
			"2000-01-01T15:00:00.000Z",
			"2000-01-01T16:00:00.000Z",
			"2000-01-01T17:00:00.000Z",
			"2000-01-01T18:00:00.000Z",
			"2000-01-01T19:00:00.000Z",
			"2000-01-01T20:00:00.000Z",
			"2000-01-01T21:00:00.000Z",
			"2000-01-01T22:00:00.000Z",
			"2000-01-01T23:00:00.000Z"
		])
		assert.equal(session.status, "done")
	})
})
