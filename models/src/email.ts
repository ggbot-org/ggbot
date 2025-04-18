import { ErrorInvalidArg } from './errors.js'

export type EmailAddress = string

export function isEmailAddress(arg: unknown): arg is EmailAddress {
	// EmailAddress is a string.
	if (typeof arg !== 'string') return false

	// EmailAddress contains two parts separated by '@'.
	const parts = arg.split('@')
	if (parts.length !== 2) return false

	const [firstPart, domain] = parts

	// EmailAddress first part is not empty.
	if (firstPart === '') return false

	// EmailAddress domain has at least one ".".
	const domainParts = domain.split('.')
	if (domainParts.length < 2) return false

	// EmailAddress domain extension is not empty.
	const domainExtension = domainParts.pop()
	if (domainExtension === '') return false

	return true
}

/**
 * Normalize email address.
 *
 * If a domain is gmail.com or is handled by Google for Business, any "."
 * character in the EmailAddress user part is ignored.
 *
 * `Namesurname@gmail.com` is the same as `name.surname@gmail.com` and also the
 * same as `n.a.m.e.s.u.r.n.a.m.e@gmail.com`
 *
 * Also users can append labels to the EmailAddress user part after a "+"
 * character.
 *
 * `Name@gmail.com` can be used as `name+label@gmail.com`
 */
export function normalizeEmailAddress(email: EmailAddress): EmailAddress {
	// Split EmailAddress
	const [firstPart, domain] = email.split('@')
	// Remove labels
	const [user] = firstPart.split('+')
	// Remove dots
	const userWithNoDots = user.replace(/\./g, '')
	// Return normalized email as a lowercase string
	const normalizeEmail = `${userWithNoDots}@${domain}`.toLowerCase()
	if (!isEmailAddress(normalizeEmail))
		throw new ErrorInvalidArg({ type: 'EmailAddress', arg: normalizeEmail })
	return normalizeEmail
}
