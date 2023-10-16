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
	ErrorUnimplementedStrategyKind
} from "@workspace/models"
import { Dflow, DflowObject } from "dflow"
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

// TODO ho tolto Request, togli anche Response
// solo Input e Output, la Request e la Response fanno parte del trasporto http
export type ApiActionResponseError = {
	error: ApiActionServerSideError
}

export type ApiActionResponseData = {
	data: unknown
}

export type ApiActionResponseOutput =
	| ApiActionResponseData
	| ApiActionResponseError

// Server errors
// ////////////

const apiActionServerSideErrorNames = [
	// Model errors.
	ErrorAccountItemNotFound.errorName,
	ErrorExceededQuota.errorName,
	ErrorUnimplementedStrategyKind.errorName,
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
	info?: DflowObject
}

export const isApiActionServerSideError =
	objectTypeGuard<ApiActionServerSideError>(
		({ name, info }) =>
			isApiActionServerSideErrorName(name) &&
			(info === undefined ? true : Dflow.isObject(info))
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
