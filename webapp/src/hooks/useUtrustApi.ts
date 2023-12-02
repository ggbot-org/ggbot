import { Authenticated, useAction } from "_/hooks/useAction"
import { url } from "_/routing/user/URLs"
import { UtrustApiActionType } from "@workspace/api"
import { CreateUtrustOrder } from "@workspace/models"

// TODO remove this file
export const useUtrustApi = {
	CreateUtrustOrder: () =>
		useAction<Authenticated<CreateUtrustOrder>, UtrustApiActionType>(
			{ endpoint: url.apiUtrustOrder, withAuth: true },
			"CreateUtrustOrder"
		)
}
