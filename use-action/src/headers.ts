import { localWebStorage } from "@ggbot2/web-storage"

export type UseActionHeadersConstructorArg = {
	withJwt?: boolean
}

export class UseActionHeaders extends Headers {
	constructor({ withJwt = false }: UseActionHeadersConstructorArg) {
		super({
			Accept: "application/json",
			"Content-Type": "application/json"
		})
		if (withJwt) {
			const { jwt } = localWebStorage
			this.append("Authorization", `Bearer ${jwt}`)
		}
	}
}
