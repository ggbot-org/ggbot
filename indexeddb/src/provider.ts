import { IDBInstance } from "./instance.js"

type IDBEventType = "open"

type IDBEventListener = {
	(evt: Event): void
}

type IDBEventListenerObject = {
	handleEvent(object: Event): void
}

// Similar to EventListenerOrEventListenerObject
type IDBEventListenerOrEventListenerObject =
	| IDBEventListener
	| IDBEventListenerObject

export class IDBProvider {
	db: IDBDatabase | undefined
	private openRequestState: IDBRequestReadyState | undefined
	private eventTarget: EventTarget

	constructor() {
		this.eventTarget = new EventTarget()
	}

	get isOpen(): boolean | undefined {
		if (this.openRequestState !== "done") return
		return this.db !== undefined
	}

	deleteDatabase() {
		const databaseName = this.db?.name
		if (!databaseName) return
		const request = indexedDB.deleteDatabase(databaseName)
		const cleanup = () => {
			this.db = undefined
			this.openRequestState = undefined
		}
		request.onerror = () => {
			console.error(`Cannot delete database ${databaseName}`)
			cleanup()
		}
		request.onsuccess = cleanup
	}

	open(instance: Pick<IDBInstance, "databaseName" | "databaseVersion" | "databaseUpgrade">) {
		if (this.isOpen) return
		if (this.openRequestState === "pending") return
		const request = indexedDB.open(instance.databaseName, instance.databaseVersion)
		this.openRequestState = request.readyState
		request.onsuccess = () => {
			this.db = request.result
			this.openRequestState = request.readyState
			this.eventTarget.dispatchEvent(new CustomEvent("open"))
		}
		request.onupgradeneeded = ({ oldVersion, newVersion }) => {
			if (newVersion === null) return
			for (let i = oldVersion + 1; i <= newVersion; i++) {
				instance.databaseUpgrade(request.result, newVersion)
			}
		}
	}

	addEventListener(type: IDBEventType, callback: IDBEventListenerOrEventListenerObject): void {
		this.eventTarget.addEventListener(type, callback)
	}

	removeEventListener(type: IDBEventType, callback: IDBEventListenerOrEventListenerObject): void {
		this.eventTarget.removeEventListener(type, callback)
	}
}
