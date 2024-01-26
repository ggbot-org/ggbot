import { Account, AccountKey, isAccountKey } from "@workspace/models"

type Action = {
	ListAccountKeys: () => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
}
export type AdminDataprovider = Action

type ActionType = keyof AdminDataprovider
export type AdminActionType = ActionType

type Input = {
	ListAccountKeys: void
	ReadAccount: Parameters<Action['ReadAccount']>[0]
}
export type AdminActionInput = Input

type Output = {
	ListAccountKeys: Awaited<ReturnType<Action['ListAccountKeys']>>
	ReadAccount: Awaited<ReturnType<Action['ReadAccount']>>
}
export type AdminActionOutput = Output

export const adminActionTypes = [
	"ListAccountKeys", "ReadAccount"
] as const satisfies readonly ActionType[]

export const isAdminActionInput = {
	ReadAccount: isAccountKey
}
