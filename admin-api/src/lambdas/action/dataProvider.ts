import { AdminApiDataProvider } from "@workspace/api"
import { listAccountKeys, readAccount } from "@workspace/database"

export const dataProvider: AdminApiDataProvider = {
	listAccountKeys,
	readAccount
}
