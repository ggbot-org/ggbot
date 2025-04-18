import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnknownItem,
	isSerializableObject,
	SerializableData,
	SerializableObject,
} from '@workspace/models'
import { isLiteralType, objectTypeGuard } from 'minimal-type-guard-helpers'

import { GenericError, TimeoutError } from './errors.js'
import {
	BadGatewayError,
	BadRequestError,
	InternalServerError,
	UnauthorizedError,
} from './http/errors.js'

export type ActionIO = void | SerializableData

export type Action<Input extends ActionIO, Output extends ActionIO> = (
	arg: Input
) => Promise<Output>

export type ActionTypes<ActionType extends string> = Readonly<ActionType[]>

export type ApiActionOutputError = {
	error: ApiActionServerSideError
}

export const isApiActionOutputError = objectTypeGuard<ApiActionOutputError>(
	({ error }) => isApiActionServerSideError(error)
)

export type ApiActionOutputData = {
	data: SerializableData
}

export const isApiActionOutputData = objectTypeGuard<ApiActionOutputData>(
	({ data }) => data !== undefined
)

export type ApiActionOutput = ApiActionOutputData | ApiActionOutputError

// Server errors
// ////////////

const apiActionServerSideErrorNames = [
	// Model errors.
	ErrorAccountItemNotFound.errorName,
	ErrorExceededQuota.errorName,
	ErrorUnknownItem.errorName,
	// Other errors.
	BadGatewayError.errorName,
	InternalServerError.errorName,
] as const
type ApiActionServerSideErrorName =
	(typeof apiActionServerSideErrorNames)[number]
const isApiActionServerSideErrorName =
	isLiteralType<ApiActionServerSideErrorName>(apiActionServerSideErrorNames)

type ApiActionServerSideError = {
	name: ApiActionServerSideErrorName
	info?: SerializableObject
}

export const isApiActionServerSideError =
	objectTypeGuard<ApiActionServerSideError>(
		({ name, info }) =>
			isApiActionServerSideErrorName(name) &&
			(info === undefined ? true : isSerializableObject(info))
	)

// Client errors
// ////////////

type ApiActionClientSideErrorName =
	| typeof BadRequestError.errorName
	| typeof UnauthorizedError.errorName
	| typeof GenericError.errorName
	| typeof TimeoutError.errorName

type ApiActionClientSideError = {
	name: ApiActionClientSideErrorName
}

export type ActionInput<ActionType extends string> = {
	type: ActionType
	data?: unknown
}

export const isActionInput = <ActionType extends string>(
	actionTypes: readonly ActionType[]
) =>
	objectTypeGuard<ActionInput<ActionType>>(({ type }) =>
		isLiteralType<ActionType>(actionTypes)(type)
	)

// Common
// //////

export type ApiActionError = ApiActionClientSideError | ApiActionServerSideError
