import { ENV } from "@workspace/env"

export const github = {
	organization: ENV.GITHUB_ORG_URL()
}

export const telegram = {
	support: "https://t.me/ggbot_support"
}
