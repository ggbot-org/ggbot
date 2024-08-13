import { AdminClientActionOutput as Output, AdminClientActionType, ApiService, DocumentProviderLevel2, isAdminClientActionInput as isInput } from "@workspace/api"
import { signSession } from "@workspace/authentication"
import { AdminDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"
import { ClientSession } from "@workspace/models"
import { today } from "minimal-time-helpers"

export class Service implements ApiService<AdminClientActionType> {
	dataProvider: AdminDatabase

	constructor(documentProvider: DocumentProviderLevel2) {
		this.dataProvider = new AdminDatabase(documentProvider)
	}

	async EnterAsUser(arg: unknown) {
		if (!isInput.EnterAsUser(arg)) throw new BadRequestError()
		const { email } = arg

		const output: Output["EnterAsUser"] = { token: undefined }

		const emailAccount = await this.dataProvider.ReadEmailAccount(email)
		const creationDay = today()

		if (emailAccount) {
			const session: ClientSession = { creationDay, accountId: emailAccount.accountId }
			const token = await signSession(session)
			output.token = token
		}

		return output
	}

	ReadAccountInfo(arg: unknown) {
		if (!isInput.ReadAccount(arg)) throw new BadRequestError()
		return this.dataProvider.ReadAccountInfo(arg)
	}

	ListAccountKeys(arg: unknown) {
		if (!isInput.ListAccountKeys(arg)) throw new BadRequestError()
		return this.dataProvider.ListAccountKeys(arg)
	}
}
