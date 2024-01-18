export class ErrorCannotParseElasticIps extends Error {
	constructor() {
		super("Cannot parse static IPs")
	}
}

export class ErrorElasticIpsListIsEmpty extends Error {
	constructor() {
		super("Cannot associate Elastic IP, empty address list")
	}
}

export class ErrorNoElasticIpAvailable extends Error {
	constructor() {
		super("Cannot associate Elastic IP, no available address found")
	}
}
