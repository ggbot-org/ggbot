import { ENV } from '@workspace/env'

export const github = {
	get organization() {
		return ENV.GITHUB_ORG_URL()
	}
}

export const telegram = {
	get support() {
		return ENV.TELEGRAM_SUPPORT_URL()
	}
}
