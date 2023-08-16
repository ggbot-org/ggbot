import {
	Account,
	createdNow,
	isEmailAddress,
	OneTimePassword
} from "@ggbot2/models"

export const testOtp: OneTimePassword = {
	code: "abcdef",
	...createdNow()
}

export const testAccount1: Account = {
	id: "test1",
	email: "test@ggbot2.com",
	whenCreated: 1669636196576
}

const testAccounts: Account[] = [testAccount1]

export const isTestAccountEmail = (value: unknown) =>
	isEmailAddress(value) &&
	testAccounts.map(({ email }) => email).includes(value)
