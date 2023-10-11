import { createServer } from "node:http"

import { ErrorCannotGetOwnEc2InstanceId } from "@workspace/aws-ec2"
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@workspace/http"

import { associateIp, releaseIp } from "./elasticIp.js"
import {
	ErrorCannotParseElasticIps,
	ErrorCannotReleaseElasticIp
} from "./errors.js"
import { info, warn } from "./logging.js"
import { requestListener } from "./requestListener.js"

const PORT = 3000

let gotSIGINT = false
let gotSIGHUP = false
let gotSIGTERM = false

createServer(requestListener).listen(PORT, async () => {
	info("Server running on port", PORT)

	try {
		await associateIp()
	} catch (error) {
		if (
			error instanceof ErrorCannotGetOwnEc2InstanceId ||
			error instanceof ErrorCannotParseElasticIps
		)
			warn(error.message)

		if (error instanceof Error) warn(error.toString())
	}
})

const terminate = async () => {
	try {
		await releaseIp()
		process.exit(0)
	} catch (error) {
		if (error instanceof ErrorCannotReleaseElasticIp) warn(error.message)

		if (error instanceof Error) warn(error.toString())
		process.exit(1)
	}
}

process.on("SIGHUP", async () => {
	if (gotSIGHUP) return
	gotSIGHUP = true
	warn("got SIGHUP")
	await terminate()
})

process.on("SIGINT", async () => {
	if (gotSIGINT) return
	gotSIGINT = true
	warn("got SIGINT")
	await terminate()
})

process.on("SIGTERM", async () => {
	if (gotSIGTERM) return
	gotSIGTERM = true
	warn("got SIGTERM")
	await terminate()
})

process.on("exit", (code) => {
	if (code) {
		warn("Exit with error")
	} else {
		warn("Exit")
	}
})

process.on("uncaughtException", (error) => {
	if (error instanceof Error) warn("Uncaught Exception", error.message)
})
