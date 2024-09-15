import { ordersIDB } from "_/storages/indexedDBs"
import { useEffect, useState } from "react"

export function useOrdersIDB() {
	const [dbIsOpen, setDbIsOpen] = useState(ordersIDB.isOpen)
	useEffect(() => {
		function onDbOpen() {
			setDbIsOpen(true)
		}
		ordersIDB.addEventListener("open", onDbOpen)
		return () => ordersIDB.removeEventListener("open", onDbOpen)
	}, [])
	return { dbIsOpen, db: ordersIDB }
}
