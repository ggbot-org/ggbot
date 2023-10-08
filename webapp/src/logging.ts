/* eslint-disable no-console */

// TODO why cannot use sessionWebStorage: SessionWebStorage ?
// If I add import
// esbuild does not work
// I get error
//     Uncaught TypeError: logging is not a function
// ... probably it is a good idea to remove esbuild too:
// no bundler, just ES modules and transpilation from src/ to public/
// For now I use native sessionStorage
const key = "loggingEnabled"
let enabled = Boolean(window.sessionStorage.getItem(key))

export type LoggingController = {
	enable(): void
	disable(): void
}

const log: LoggingController = {
	enable: () => {
		enabled = true
		window.sessionStorage.setItem(key, "true")
		// TODO sessionWebStorage.loggingEnabled.set(enabled)
	},
	disable: () => {
		enabled = false
		window.sessionStorage.removeItem(key)
		// TODO sessionWebStorage.loggingEnabled.set(enabled)
	}
}

export const logging = (prefix: string) => ({
	info: (...args: unknown[]) => {
		if (enabled) console.info(prefix, ...args)
	},
	warn: (...args: unknown[]) => {
		if (enabled) console.warn(prefix, ...args)
	}
})

if (IS_DEV) log.enable()

window.log = log
