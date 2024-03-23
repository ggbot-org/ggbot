import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	StripeClientActionInput as Input,
	StripeClientActionOutput as Output,
	StripeClientActionType as ActionType
} from "@workspace/api"

const apiOptions: UseActionApiArg = {
	url: api.stripe.action,
	withAuth: true
}

export const useStripeApi = {
	CreateCheckoutSession: () =>
		useAction<
			ActionType,
			Input["CreateCheckoutSession"],
			Output["CreateCheckoutSession"]
		>(apiOptions, "CreateCheckoutSession")
}
