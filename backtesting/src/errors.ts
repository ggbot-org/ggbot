export class ErrorCannotCreateOrder extends Error {
	constructor() {
		super(ErrorCannotCreateOrder.message())
	}
	static message() {
		return "Cannot create order"
	}
}
