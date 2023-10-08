import { LoggingController } from "_/logging"

declare global {
	interface Window {
		log: LoggingController
	}
}
