import { AdminApiDataProvider, AdminApiService } from "@workspace/api"
import { BadRequestError } from "@workspace/http"
import { isAccountKey } from "@workspace/models"

export class ApiService implements AdminApiService {
	dataProvider: AdminApiDataProvider

	constructor(dataProvider: AdminApiDataProvider) {
		this.dataProvider = dataProvider
	}

	ReadAccount(arg: unknown) {
		if (!isAccountKey(arg)) throw new BadRequestError()
		return this.dataProvider.readAccount(arg)
	}

	ListAccountKeys() {
		return this.dataProvider.listAccountKeys()
	}
}
