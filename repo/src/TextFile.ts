export type TextFile = {
	dirPathname: string
	filename: string
	read: () => Promise<void>
}
