import { ApiService, AuthClientActionOutput as Output, AuthClientActionType, BadRequestError, DocumentProviderLevel2, isAuthClientActionInput as isInput } from "@workspace/api"
import { signSession } from "@workspace/authentication"
import { AuthDatabase } from "@workspace/database"
import { SendEmailProvider } from "@workspace/email-messages"
import { ClientSession } from "@workspace/models"
import { today } from "minimal-time-helpers"

export class Service implements ApiService<AuthClientActionType> {
	dataProvider: AuthDatabase
	sendEmailProvider: SendEmailProvider

	constructor(documentProvider: DocumentProviderLevel2) {
		this.dataProvider = new AuthDatabase(documentProvider)
		this.sendEmailProvider = new SendEmailProvider()
	}

	async Enter(arg: unknown) {
		if (!isInput.Enter(arg)) throw new BadRequestError()
		const { email } = arg
		const oneTimePassword = await this.dataProvider.CreateOneTimePassword(email)
		await this.sendEmailProvider.SendOneTimePassword({ language: "en", email, oneTimePassword })
		return { emailSent: true } satisfies Output["Enter"]
	}

	async Verify(arg: unknown) {
		if (!isInput.Verify(arg)) throw new BadRequestError()
		const { code, email } = arg

		const output: Output["Verify"] = { token: undefined }

		const storedOneTimePassword = await this.dataProvider.ReadOneTimePassword(email)
		const verified = code === storedOneTimePassword?.code
		if (!verified) return output

		await this.dataProvider.DeleteOneTimePassword(email)

		const emailAccount = await this.dataProvider.ReadEmailAccount(email)
		const creationDay = today()

		if (emailAccount) {
			// Given email is associated with an account: create a session.
			const session: ClientSession = { creationDay, accountId: emailAccount.accountId }
			const token = await signSession(session)
			output.token = token
		} else {
			// Given email is new: create account first, then create a session.
			const account = await this.dataProvider.CreateAccount(email)
			const session: ClientSession = { creationDay, accountId: account.id }
			const token = await signSession(session)
			output.token = token
		}

		return output
	}
}
