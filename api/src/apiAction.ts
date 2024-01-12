import {
	__400__BAD_REQUEST__,
	__401__UNAUTHORIZED__,
	__500__INTERNAL_SERVER_ERROR__,
	BadGatewayError,
	BadRequestError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from "@workspace/http"
import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnknown,
	isSerializableObject,
	SerializableData,
	SerializableObject
} from "@workspace/models"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

export type ApiActionInput<ApiActionType extends string> = {
	type: ApiActionType
	data?: unknown
}

export const isApiActionInput = <ApiActionType extends string>(
	actionTypes: readonly ApiActionType[]
) =>
	objectTypeGuard<ApiActionInput<ApiActionType>>(({ type }) =>
		isLiteralType<ApiActionType>(actionTypes)(type)
	)

export type ApiActionOutputError = {
	error: ApiActionServerSideError
}

export type ApiActionOutputData = {
	data: SerializableData
}

export type ApiActionOutput = ApiActionOutputData | ApiActionOutputError

// Server errors
// ////////////

const apiActionServerSideErrorNames = [
	// Model errors.
	ErrorAccountItemNotFound.errorName,
	ErrorExceededQuota.errorName,
	ErrorUnknown.errorName,
	// Other errors.
	BadGatewayError.errorName,
	InternalServerError.errorName
] as const
type ApiActionServerSideErrorName =
	(typeof apiActionServerSideErrorNames)[number]
const isApiActionServerSideErrorName =
	isLiteralType<ApiActionServerSideErrorName>(apiActionServerSideErrorNames)

export type ApiActionServerSideError = {
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

const apiActionClientSideErrorNames = [
	BadRequestError.errorName,
	UnauthorizedError.errorName,
	NotFoundError.errorName,
	"GenericError",
	"Timeout"
] as const
type ApiActionClientSideErrorName =
	(typeof apiActionClientSideErrorNames)[number]

export type ApiActionClientSideError = {
	name: ApiActionClientSideErrorName
}
