import { createServer } from "node:http"
import { exit } from "node:process"

import { BinanceProxyBaseURL } from "@workspace/locators"

import { associateIp, disassociateIp } from "./elasticIp.js"
import { info, warn } from "./logging.js"
import { requestListener } from "./requestListener.js"

const { port } = BinanceProxyBaseURL

let gotSIGINT = false
let gotSIGHUP = false
let gotSIGTERM = false

createServer(requestListener).listen(port, () => {
	info("Server running on port", port)

	associateIp().catch(warn)
})

const terminate = () => {
	disassociateIp()
		.then(() => {
			exit(0)
		})
		.catch((error) => {
			warn(error)
			exit(1)
		})
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
