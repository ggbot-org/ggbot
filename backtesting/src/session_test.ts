import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { Frequency } from "@workspace/models"
import { DayInterval, isTime,Time } from "minimal-time-helpers"

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
			params: {},
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
		assert.deepEqual(session.strategy?.toValue(), strategy1.toValue())
		// Session is "running", `strategy` modifier does not apply.
		session.start()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.toValue(), strategy1.toValue())
		// Session is "paused", `strategy` modifier does not apply.
		session.pause()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.toValue(), strategy1.toValue())
		// Session is resumed, so it is "running" again, `strategy` modifier does not apply.
		session.resume()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.toValue(), strategy1.toValue())
		// Session is not "running" nor "paused", `strategy` modifier can set new value.
		session.stop()
		session.strategy = strategy2
		assert.deepEqual(session.strategy?.toValue(), strategy2.toValue())
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
		let hour = 1
		let time: Time | undefined
		while ((time = session.nextTime)) {
			assert.ok(isTime(time))
			if (!time) continue
			assert.equal(new Date(time).getHours(), hour % 24)
			hour++
		}
		assert.equal(session.status, "done")
	})
})
