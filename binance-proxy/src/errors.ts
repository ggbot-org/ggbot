export class ErrorCannotParseElasticIps extends Error {
	constructor() {
		super("Cannot parse static IPs")
	}
}

export class ErrorCannotReleaseElasticIp extends Error {
	constructor() {
		super("Cannot release static IP")
	}
}
