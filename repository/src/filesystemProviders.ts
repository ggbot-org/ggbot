export type DirectoryProvider = {
	pathname: string
}

export type FileProvider = {
	directoryPathname: DirectoryProvider["pathname"]
	filename: string
}
