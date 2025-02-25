import { ENV } from '@workspace/env'

export const telegram = {
	get support() {
		return ENV.TELEGRAM_SUPPORT_URL()
	},
}
