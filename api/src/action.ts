import {
	BadGatewayError,
	BadRequestError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from "@workspace/http"
import {
	ErrorAccountItemNotFound,
	ErrorExceededQuota,
	ErrorUnknownItem,
	isSerializableObject,
	SerializableData,
	SerializableObject
} from "@workspace/models"
import { isLiteralType, objectTypeGuard } from "minimal-type-guard-helpers"

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
	ErrorUnknownItem.errorName,
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

export const apiActionMethod = "POST"

export type ApiActionInput<ActionType extends string> = {
	type: ActionType
	data?: unknown
}

type ActionInputValidators<ActionType extends string> = Record<
	ActionType,
	(arg: unknown) => boolean
>

export const isActionInput = <ActionType extends string>(
	actionInputValidator: ActionInputValidators<ActionType>
) =>
	objectTypeGuard<ApiActionInput<ActionType>>(
		({ type }) =>
			typeof type === "string" &&
			typeof actionInputValidator[type as ActionType] === "function"
	)

export const __noInput = () => false
