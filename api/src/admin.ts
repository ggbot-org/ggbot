import { Account, AccountKey, isAccountKey } from "@workspace/models"

type Action = {
	ListAccountKeys: () => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
}
export type AdminAction = Action
export type AdminActionType = keyof AdminAction

type Input = {
	ReadAccount: Parameters<Action["ReadAccount"]>[0]
}
export type AdminActionInput = Input

type Output = {
	ListAccountKeys: Awaited<ReturnType<Action["ListAccountKeys"]>>
	ReadAccount: Awaited<ReturnType<Action["ReadAccount"]>>
}
export type AdminActionOutput = Output

export const isAdminActionInput = {
	ReadAccount: isAccountKey
}
