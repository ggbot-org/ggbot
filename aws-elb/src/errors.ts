export class ErrorCannotLoadBalancerDescription extends Error {
	constructor() {
		super("Cannot get loadBalancer description")
	}
}
