export type TsconfigJson = Partial<{
	compilerOptions: Partial<{
		noEmit: boolean
		paths: { [key in string]: string[] }
	}>
}>
