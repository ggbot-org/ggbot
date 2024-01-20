import { createServer } from "node:http"

// import { exit } from "node:process"
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@workspace/http"

import { associateIp } from "./elasticIp.js"
import { info, warn } from "./logging.js"
import { requestListener } from "./requestListener.js"

const PORT = 3000

let gotSIGINT = false
let gotSIGHUP = false
let gotSIGTERM = false

createServer(requestListener).listen(PORT, () => {
	info("Server running on port", PORT)

	associateIp().catch((error) => {
		warn(error)
	})
})

const terminate = () => {
	// releaseIp()
	// 	.then(() => {
	// 		exit(0)
	// 	})
	// 	.catch((error) => {
	// 		warn(error)
	// 		exit(1)
	// 	})
}

process.on("SIGHUP", () => {
	if (gotSIGHUP) return
	gotSIGHUP = true
	warn("got SIGHUP")
	terminate()
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

process.on("exit", (code) => {
	if (code) warn("Exit with error")
	else warn("Exit")
})

process.on("uncaughtException", (error) => {
	warn("Uncaught Exception", error)
})
