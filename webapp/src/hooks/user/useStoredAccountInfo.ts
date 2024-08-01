import { sessionWebStorage } from "_/storages/session"
import { AccountInfo } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

// TODO this may be inside Authentication context
export function useStoredAccountInfo() {
	const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
		sessionWebStorage.accountInfo.get()
	)

	// Handle case when `account` changes or is deleted from localWebStorage in other tabs.
	const onLocalStorageChange = useCallback(() => {
		setAccountInfo(sessionWebStorage.accountInfo.get())
	}, [])
	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => {
			removeEventListener("storage", onLocalStorageChange)
		}
	}, [onLocalStorageChange])

	return accountInfo
}
