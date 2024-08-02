import { exit } from "node:process"

import { Item } from "@workspace/models"

import { Executor } from "./Executor.js"
import { info, warn } from "./logging.js"

const sleep = (delay: number) => new Promise((resolve) => {
	setTimeout(resolve, delay)
})

const start = async () => {
	// TODO if it is a dedicated server, it will run only strategies of one account
	// how to get the account id?
	const capacity = 1
	const hostIndex = 0
	// TODO how to get the index of this host?
	const executor = new Executor(capacity, hostIndex)

	let executorId: undefined | Item["id"]
	try {
		executorId = await Executor.getExecutorId()
	} catch (error) {
		warn(error)
		exit(1)
	}

	info("executorId", executorId)

	let canRun = true
	let gotSIGINT = false
	let gotSIGHUP = false
	let gotSIGTERM = false

	const terminate = () => {
		warn("terminating")
		canRun = false
	}

	process.on("SIGHUP", () => {
		if (gotSIGHUP) return
		gotSIGHUP = true
		warn("got SIGHUP")
	})

	process.on("SIGINT", () => {
		if (gotSIGINT) return
		gotSIGINT = true
		warn("got SIGINT")
		terminate()
	})

	process.on("SIGTERM", () => {
		if (gotSIGTERM) return
		gotSIGTERM = true
		warn("got SIGTERM")
		terminate()
	})

	// The `while` loop must be last statement.
	while (canRun) {
		try {
			await executor.runTasks()
			await sleep(1000)
		} catch (error) {
			warn(error)
		}
	}
}

process.on("exit", () => {
	warn("Exit")
})

process.on("uncaughtException", (error) => {
	if (error instanceof Error) warn("Uncaught Exception", error.message)
})

await start()
