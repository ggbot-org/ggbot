import {
	BacktestingBinanceClient,
	BacktestingMessageInData,
	BacktestingMessageOutData,
	BacktestingSession,
	BacktestingStrategy,
} from '@workspace/backtesting'
import { DflowBinanceExecutor } from '@workspace/dflow'
import { newId, Order } from '@workspace/models'
import { Time } from 'minimal-time-helpers'

import { getBinance, prepareBinance } from './binance.js'

const { postMessage } = self

const session = new BacktestingSession()
const binanceExecutor = new DflowBinanceExecutor()

let memoryChangedOnSomeStep = false
const orderSet = new Set<Order>()

function STATUS_CHANGED(session: BacktestingSession) {
	return {
		type: 'STATUS_CHANGED',
		status: session.status,
	} satisfies BacktestingMessageOutData
}

function UPDATED_PROGRESS(session: BacktestingSession) {
	return {
		type: 'UPDATED_PROGRESS',
		currentTimestamp: session.currentTimestamp,
		stepIndex: session.stepIndex,
		numSteps: session.numSteps,
	} satisfies BacktestingMessageOutData
}

// TODO refactor this function, it depends on when it is called, and which status the session is.
// the best option could be do remove it or split it.
function updateUI(session: BacktestingSession) {
	// Check if session should be stopped before handling memory or orders.
	if (
		(memoryChangedOnSomeStep &&
			session.afterStepBehaviour.pauseOnMemoryChange) ||
		(orderSet.size > 0 && session.afterStepBehaviour.pauseOnNewOrder)
	) {
		const statusChanged = session.pause()
		if (statusChanged) postMessage(STATUS_CHANGED(session))
	}
	// Update progress.
	postMessage(UPDATED_PROGRESS(session))
	// Update memory.
	if (memoryChangedOnSomeStep) {
		postMessage({
			type: 'UPDATED_MEMORY',
			memory: session.memory,
		} satisfies BacktestingMessageOutData)
		memoryChangedOnSomeStep = false
	}
	// Update orders.
	if (orderSet.size > 0) {
		const orders = Array.from(orderSet.values())
		postMessage({
			type: 'UPDATED_ORDERS',
			orders,
		} satisfies BacktestingMessageOutData)
		orderSet.clear()
	}
}

// TODO runBinance should be decoupled and moved in ./binance.js
async function runBinance(
	binance: BacktestingBinanceClient,
	binanceExecutor: DflowBinanceExecutor,
	session: BacktestingSession
) {
	const flow = session.strategy?.flow
	if (!flow) {
		console.error('Cannot run backtesting, flow is undefined')
		return
	}
	const updateInterval = 2_000
	let time: Time | undefined
	let shouldUpdateUI = false
	let nextUpdateTime = Date.now() + updateInterval
	memoryChangedOnSomeStep = false

	while ((time = session.nextTime)) {
		binance.time = time
		// Run executor.
		try {
			const { memory, memoryChanged, orders } = await binanceExecutor.run(
				{ binance, params: {}, memory: session.memory, time },
				flow
			)
			if (memoryChanged) {
				memoryChangedOnSomeStep = true
				session.memory = memory
				if (session.afterStepBehaviour.pauseOnMemoryChange)
					shouldUpdateUI = true
			}
			if (orders.length) {
				if (session.afterStepBehaviour.pauseOnNewOrder) shouldUpdateUI = true
				for (const { info } of orders) {
					const order: Order = { id: newId(), info, whenCreated: time }
					orderSet.add(order)
					session.orders.push(order)
				}
			}
		} catch (error) {
			console.error(error)
			const statusChanged = session.pause()
			if (statusChanged) postMessage(STATUS_CHANGED(session))
		}

		if (Date.now() > nextUpdateTime) {
			nextUpdateTime = Date.now() + updateInterval
			shouldUpdateUI = true
		}

		if (shouldUpdateUI) {
			shouldUpdateUI = false
			updateUI(session)
		}
	}
}

async function runBacktesting(session: BacktestingSession): Promise<void> {
	if (session.strategyKind === 'binance') {
		const binance = getBinance(session.frequency?.interval ?? '1h')
		await prepareBinance(binance, binanceExecutor, session)
		await runBinance(binance, binanceExecutor, session)
	}

	if (session.status === 'done') {
		updateUI(session)
		postMessage(STATUS_CHANGED(session))
		session.reset()
		postMessage(UPDATED_PROGRESS(session))
	}
}

self.onmessage = async ({
	data: message,
}: MessageEvent<BacktestingMessageInData>) => {
	try {
		const { type: messageType } = message

		if (messageType === 'SET_AFTER_STEP_BEHAVIOUR') {
			const { afterStepBehaviour } = message
			session.afterStepBehaviour = afterStepBehaviour
		}

		if (messageType === 'SET_DAY_INTERVAL') {
			session.dayInterval = message.dayInterval
			session.computeTimes()
			postMessage(UPDATED_PROGRESS(session))
		}

		if (messageType === 'SET_FREQUENCY') {
			session.frequency = message.frequency
			session.computeTimes()
			postMessage(UPDATED_PROGRESS(session))
		}

		if (messageType === 'START') {
			const { dayInterval, flow, frequency, strategyKey, strategyName } =
				message
			// Initialize session.
			session.dayInterval = dayInterval
			session.frequency = frequency
			session.computeTimes()
			const strategy = new BacktestingStrategy({
				strategyKey,
				strategyName,
				flow,
			})
			session.strategy = strategy

			// Start session (if possible) and notify UI.
			const statusChanged = session.start()
			if (statusChanged) postMessage(STATUS_CHANGED(session))
			if (!session.canRun) return

			// Reset conditions.
			orderSet.clear()
			memoryChangedOnSomeStep = false

			await runBacktesting(session)
		}

		if (messageType === 'STOP') {
			const statusChanged = session.stop()
			if (statusChanged) {
				session.computeTimes()
				postMessage(STATUS_CHANGED(session))
				postMessage(UPDATED_PROGRESS(session))
			}
		}

		if (messageType === 'PAUSE') {
			const statusChanged = session.pause()
			if (statusChanged) postMessage(STATUS_CHANGED(session))
			postMessage(UPDATED_PROGRESS(session))
		}

		if (messageType === 'RESUME') {
			const statusChanged = session.resume()
			if (statusChanged) postMessage(STATUS_CHANGED(session))

			await runBacktesting(session)
		}
	} catch (error) {
		console.error(error)
	}
}
