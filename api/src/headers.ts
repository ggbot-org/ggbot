export class ApiActionHeaders extends Headers {
	constructor() {
		super({
			Accept: "application/json",
			"Content-Type": "application/json"
		})
	}
	appendAuthorization(token: string) {
		this.append("Authorization", token)
	}
}
