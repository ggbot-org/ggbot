import { AccountKey, isAccount } from "@ggbot2/models"
import { FC, useEffect } from "react"

import { useApi } from "../hooks/useApi.js"

type Props = AccountKey

export const Account: FC<Props> = ({ accountId }) => {
	const ReadAccount = useApi.ReadAccount()
	const account = ReadAccount.data

	let email = ""
	if (isAccount(account)) email = account.email

	useEffect(() => {
		if (ReadAccount.canRun) ReadAccount.request({ accountId })
	}, [accountId, ReadAccount])

	return <div>{email}</div>
}
