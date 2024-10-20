import { Executor } from "./Executor.js"

function sleep (delay: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay)
	})
}

async function start () {
	const executor = new Executor()

	let canRun = true
	let gotSIGINT = false
	let gotSIGHUP = false
	let gotSIGTERM = false

	const terminate = () => {
		console.info("terminating")
		canRun = false
	}

	process.on("SIGHUP", () => {
		if (gotSIGHUP) return
		gotSIGHUP = true
		console.info("got SIGHUP")
	})

	process.on("SIGINT", () => {
		if (gotSIGINT) return
		gotSIGINT = true
		console.info("got SIGINT")
		terminate()
	})

	process.on("SIGTERM", () => {
		if (gotSIGTERM) return
		gotSIGTERM = true
		console.info("got SIGTERM")
		terminate()
	})

	// The `while` loop must be last statement.
	while (canRun) {
		await executor.runTasks()
		await sleep(1000)
	}
}

process.on("uncaughtException", (error) => {
	console.error(error)
})

await start()
