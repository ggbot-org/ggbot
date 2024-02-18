// Credits: inspired by `PackageJson` in type-fest package.

export type PackageJson = {
	name?: string
	private?: boolean
	dependencies?: Partial<Record<string, string>>
	devDependencies?: Partial<Record<string, string>>
	scripts?: Partial<Record<string, string>>
	workspaces?: string[]
}
