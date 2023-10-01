export class ErrorCannotGetOwnEc2InstanceId extends Error {
	constructor() {
		super("Cannot get own EC2 instance-id")
	}
}

export class ErrorCannotLoadBalancerDescription extends Error {
	constructor() {
		super("Cannot get loadBalancer description")
	}
}
