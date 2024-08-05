import { AdminActionType, ApiService, DocumentProviderLevel2, isAdminActionInput as isInput } from "@workspace/api"
import { AdminDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"

export class Service implements ApiService<AdminActionType> {
	dataProvider: AdminDatabase

	constructor(documentProvider: DocumentProviderLevel2) {
		this.dataProvider = new AdminDatabase(documentProvider)
	}

	ReadAccount(arg: unknown) {
		if (!isInput.ReadAccount(arg)) throw new BadRequestError()
		return this.dataProvider.ReadAccount(arg)
	}

	ListAccountKeys() {
		return this.dataProvider.ListAccountKeys()
	}
}
