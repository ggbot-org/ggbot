/* eslint-disable no-console */
// TODO remove the eslint-disable above

/// <reference no-default-lib="true"/>
/// <reference lib="ES2017" />
/// <reference lib="webworker" />

import {
	BacktestingMessageIn,
	BacktestingMessageOut,
	BacktestingSession
} from "@workspace/backtesting"

// TODO try two backtests,  open two browser tabs on two different strategies or on the same strategy
// is this `session` shared?
const session = new BacktestingSession()

const statusChangedMessage = (
	session: BacktestingSession
): BacktestingMessageOut => ({
	type: "STATUS_CHANGED",
	status: session.status
})

self.onmessage = (event: MessageEvent<BacktestingMessageIn>) => {
	const message = event.data

	if (message.type === "START") {
		const statusChanged = session.start()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "STOP") {
		const statusChanged = session.stop()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "PAUSE") {
		const statusChanged = session.pause()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}

	if (message.type === "RESUME") {
		const statusChanged = session.resume()
		if (statusChanged) self.postMessage(statusChangedMessage(session))
	}
}
