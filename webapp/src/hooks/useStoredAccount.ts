import { localWebStorage } from "_/storages/local"
import { Account } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export const useStoredAccount = () => {
	const [account, setAccount] = useState<Account | undefined>(
		localWebStorage.account.get()
	)

	// Handle case when `account` changes or is deleted from localWebStorage in other tabs.

	const onLocalStorageChange = useCallback(() => {
		setAccount(localWebStorage.account.get())
	}, [])

	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => {
			removeEventListener("storage", onLocalStorageChange)
		}
	}, [onLocalStorageChange])

	return account
}
