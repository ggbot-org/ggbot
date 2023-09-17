export class ErrorCannotGetInstanceId extends Error {
	constructor() {
		super("Cannot get instance id")
	}
}

export class ErrorCannotParseStaticIps extends Error {
	constructor() {
		super("Cannot parse static IPs")
	}
}
