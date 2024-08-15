import { errorsIDB, ordersIDB } from "_/storages/indexedDBs"
import { useEffect, useState } from "react"

export function useErrorsIDB() {
	const [dbIsOpen, setDbIsOpen] = useState(errorsIDB.isOpen)
	useEffect(() => {
		function onDbOpen() {
			setDbIsOpen(true)
		}
		errorsIDB.addEventListener("open", onDbOpen)
		return () => errorsIDB.removeEventListener("open", onDbOpen)
	}, [])
	return { dbIsOpen, db: errorsIDB }
}

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
