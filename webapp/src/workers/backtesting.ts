/* eslint-disable no-console */
// TODO remove the eslint-disable above

// To debug Web Workers on Chrome, go to chrome://inspect/#workers

/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

import {
	BacktestingMessageIn,
	BacktestingSession
} from "@workspace/backtesting"

const sessions: Map<BacktestingSession["strategyId"], BacktestingSession> =
	new Map()

self.onmessage = (event: MessageEvent<BacktestingMessageIn>) => {
	console.log(sessions)
	if (event.data.type === "START") {
		console.log("START")
	}
}
