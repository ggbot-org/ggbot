import { createServer } from 'node:http'
import { exit } from 'node:process'

import { BinanceProxyBaseURL } from '@workspace/locators'

import { associateIp, disassociateIp } from './elasticIp.js'
import { requestListener } from './requestListener.js'

const { port } = BinanceProxyBaseURL

let gotSIGINT = false
let gotSIGHUP = false
let gotSIGTERM = false

createServer(requestListener).listen(port, () => {
	associateIp().then(() => {
		console.info('Server running on port', port)
	})
})

function terminate() {
	disassociateIp()
		.then(() => {
			exit(0)
		})
		.catch((error) => {
			console.error(error)
			exit(1)
		})
}

process.on('SIGHUP', () => {
	if (gotSIGHUP) return
	gotSIGHUP = true
	console.info('got SIGHUP')
	terminate()
})

process.on('SIGINT', () => {
	if (gotSIGINT) return
	gotSIGINT = true
	console.info('got SIGINT')
	terminate()
})

process.on('SIGTERM', () => {
	if (gotSIGTERM) return
	gotSIGTERM = true
	console.info('got SIGTERM')
	terminate()
})

process.on('exit', (code) => {
	if (code) console.warn('Exit with error code', code)
	else console.info('Exit')
})

process.on('uncaughtException', (error) => {
	console.warn('Uncaught Exception', error)
})
