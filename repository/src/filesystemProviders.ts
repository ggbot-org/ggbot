export type DirectoryProvider = {
	pathname: string
	read(): Promise<void>
}

export type FileProvider = {
	directoryPathname: DirectoryProvider['pathname']
	filename: string
	read(): Promise<void>
}
