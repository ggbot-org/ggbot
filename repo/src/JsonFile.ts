export type JsonFile = {
	dirPathname: string
	filename: string
	read: () => Promise<void>
}
