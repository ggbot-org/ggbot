import { AuthDatabaseAction, AuthDatabaseActionInput as Input, AuthDatabaseActionOutput as Output, DocumentProviderLevel2 } from '@workspace/api'
import { Account, EmailAccount, generateOneTimePassword } from '@workspace/models'

import { newId } from './item.js'
import { pathname } from './locators.js'
import { createdNow } from './time.js'

export class AuthDatabase implements AuthDatabaseAction {
	documentProvider: DocumentProviderLevel2

	constructor(documentProvider: DocumentProviderLevel2) {
		this.documentProvider = documentProvider
	}

	async CreateAccount(email: Input['CreateAccount']) {
		const account: Account = {
			email,
			id: newId(),
			...createdNow()
		}
		const accountId = account.id
		await this.documentProvider.setItem(pathname.account({ accountId }), account)
		const data: EmailAccount = { accountId, email, ...createdNow() }
		await this.documentProvider.setItem(pathname.emailAccount(email), data)
		return account
	}

	async CreateOneTimePassword(email: Input['CreateOneTimePassword']) {
		const data = generateOneTimePassword()
		await this.documentProvider.setItem(pathname.oneTimePassword(email), data)
		return data
	}

	async DeleteOneTimePassword(email: Input['DeleteOneTimePassword']) {
		await this.documentProvider.removeItem(pathname.oneTimePassword(email))
	}

	ReadEmailAccount(email: Input['ReadEmailAccount']) {
		return this.documentProvider.getItem<Output['ReadEmailAccount']>(pathname.emailAccount(email))
	}

	ReadOneTimePassword(email: Input['ReadOneTimePassword']) {
		return this.documentProvider.getItem<Output['ReadOneTimePassword']>(pathname.oneTimePassword(email))
	}
}
