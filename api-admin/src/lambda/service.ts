import {
	AdminClientActionOutput as Output,
	AdminClientActionType,
	ApiService,
	BadRequestError,
	DocumentProviderLevel3,
	isAdminClientActionInput as isInput,
} from '@workspace/api'
import { signSession } from '@workspace/authentication'
import { AdminDatabase } from '@workspace/database'
import { ClientSession } from '@workspace/models'
import { today } from 'minimal-time-helpers'

export class Service implements ApiService<AdminClientActionType> {
	dataProvider: AdminDatabase

	constructor(documentProvider: DocumentProviderLevel3) {
		this.dataProvider = new AdminDatabase(documentProvider)
	}

	async EnterAsAccount(arg: unknown) {
		if (!isInput.EnterAsAccount(arg)) throw new BadRequestError()
		const { accountId } = arg

		const output: Output['EnterAsAccount'] = { token: undefined }

		const session: ClientSession = { creationDay: today(), accountId }
		const token = await signSession(session)
		output.token = token

		return output
	}

	ReadAccountInfo(arg: unknown) {
		if (!isInput.ReadAccount(arg)) throw new BadRequestError()
		return this.dataProvider.ReadAccountInfo(arg)
	}

	ListAccounts(arg: unknown) {
		if (!isInput.ListAccounts(arg)) throw new BadRequestError()
		return this.dataProvider.ListAccounts(arg)
	}
}
