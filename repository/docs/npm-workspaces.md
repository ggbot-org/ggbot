# npm workspaces

This repo uses [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

Every workspace folder has the same name as its package and is a direct child of the project root folder.
Hence every workspace folder name has lower case letters with hyphen, because it must be a valid npm name. For example: _foo-bar_.

Every workspace folder must be listed in the root _package.json_ `workspaces` attribute.

```json
  "workspaces": [
    "foo-bar",
    "another-package"
  ]
```

The root package.json can expose scripts for the workspace, for example

```jsonc
  "scripts": {
    "build:foo-bar": "npm run build --workspace foo-bar",
    "test:foo-bar": "npm run test --workspace foo-bar"
  }
```

## Folder structure

A basic workspace package is a folder with the following files:

-   .gitignore
-   package.json
-   src/index.ts
-   tsconfig.json
-   tsconfig.build.json
-   tsconfig.test.json

### .gitignore

Create a gitignore file with at least the following content

    dist/
    temp/

### package.json

This is a sample _package.json_ for a generic workspace.

```jsonc
{
	// Package name, for instance `foo-bar`, prefixed by `@workspace` project namespace.
	"name": "@workspace/foo-bar",
	"version": "0.1.0",
	// Package must be a private module.
	"private": true,
	"type": "module",
	// Package may not be consumed as a dependency: `types` and `exports` are optional
	"types": "./dist/index.d.ts",
	"exports": {
		"import": "./dist/index.js"
	},
	"scripts": {
		"build": "tsc --build",
		"cleanup": "tsc --build",
		"check_types": "tsc --noEmit",
		"test": "node --test --env-file ../.typescript.env ./src/*_test.ts"
	},
	"dependencies": {
		"@workspace/another-package": "0.0.0"
	},
	"devDependencies": {
		"@workspace/tsconfig": "0.0.0"
	}
}
```

### src/index.ts

Entry file for exports. Notice the **mandatory** `.js` extension.
Every TypeScript source file importing another file **must** explicitly set the file
extension.

```ts
export * from "./foo.js"
```

### tsconfig.json

```jsonc
{
	"compilerOptions": {
		"lib": ["dom", "es2015"],
		"module": "esnext",
		"moduleResolution": "node",
		// Specify the root folder within your source files.
		// It is set explicitly, since tsconfig.build.json set `"composite": true`
		"rootDir": "./src",
		"target": "esnext"
	},
	// Extend common set of `compilerOptions`, used to improve code quality.
	"extends": "@workspace/tsconfig",
	"include": ["./src/**/*.ts"]
}
```

### tsconfig.build.json

```jsonc
{
	"compilerOptions": {
		// Enable constraints that allow a TypeScript project to be used with project references.
		// It implies: `"declaration": true`; `"incremental": true`.
		"composite": true,

		// Go to JS file when using IDE functions like "Go to Definition" in VSCode.
		"declarationMap": true,

		"outDir": "./dist",

		// Keep .tsbuildinfo into temp/ folder.
		"tsBuildInfoFile": "temp/tsconfig.build.tsbuildinfo",

		// Disable emitting declarations that have @internal in their JSDoc comments.
		"stripInternal": true
	},
	"extends": "./tsconfig.json",
	"exclude": [
		"node_modules",

		// Exclude tests.
		"**/*_test.ts"
	]
}
```

### tsconfig.test.json

If package has no test, `tsconfig.test.json` can be omitted.

```jsonc
{
	"compilerOptions": {
		"outDir": "./temp",

		// Keep .tsbuildinfo into temp/ folder.
		"tsBuildInfoFile": "temp/tsconfig.temp.tsbuildinfo"
	},
	// Extend build config to reproduce its result:
	// notice that // `outDir` and `exclude` are overridden.
	"extends": "./tsconfig.build.json",
	"exclude": ["node_modules"]
}
```
