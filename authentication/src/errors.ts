export class ErrorUnauthorizedAuthenticationHeader extends Error {
	static errorName = "UnauthorizedAuthenticationHeader"
	constructor() {
		super("Unauthorized authentication header")
		this.name = ErrorUnauthorizedAuthenticationHeader.errorName
	}
}
