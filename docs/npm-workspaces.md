# ggbot2 npm workspaces

This repo uses [npm workspaces](./tech-stack.md#npm-workspaces).

Every workspace folder has the same name as its package and is a direct child of the project root folder.
Hence every workspace folder name has lower case letters with hyphen, because it must be a valid npm name. For example: _foo-bar_.

Every workspace folder must be listed in the root _package.json_ `workspaces` attribute.

```json
  "workspaces": [
    "foo-bar",
    "another-package"
  ]
```

The root package.json exposes also scripts for the workspace, for example

```jsonc
  "scripts": {
    "build:foo-bar": "npm run build --workspace foo-bar",
    "test:foo-bar": "npm run test --workspace foo-bar"
  }
```

## Folder structure

A basic workspace package is a folder with the following files:

- .gitignore
- package.json
- src/index.ts
- tsconfig.json
- tsconfig.build.json
- tsconfig.test.json

### .gitignore

Create a gitignore file with at least the following content

```
dist/
temp/
```

### package.json

```jsonc
{
  // Package name, for instance `foo-bar`, prefixed by `@ggbot2` project namespace.
  "name": "@ggbot2/foo-bar",
  "version": "0.1.0",
  // Package must be a private module.
  "private": true,
  "type": "module",
  // Package may not be consumed as a dependency: `types` and `exports` are optional
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc --build tsconfig.build.json",
    "check_types": "tsc --noEmit --project .",
    "cleanup": "rm -rf dist/ temp/",
    "lint": "eslint --fix --ext .ts .",
    "pretest": "tsc --build tsconfig.test.json",
    "test": "node --test"
  },
  "dependencies": {
    // Dependency from another workspace package is referenced using `file:` prefix.
    "@ggbot2/another-package": "file:another-package"
  },
  "devDependencies": {
    "@ggbot2/eslint-config": "file:eslint-config",
    "@ggbot2/tsconfig": "file:tsconfig"
  },
  "eslintConfig": {
    "extends": [
      // Extend proper eslint preset,
      // may be "@ggbot2/eslint-config/react" for frontend packages.
      "@ggbot2/eslint-config"
    ]
  }
}
```

If package has no test, its `scripts` can be the following

```jsonc
{
  "scripts": {
    "build": "tsc --build tsconfig.build.json",
    "cleanup": "rm -rf dist/",
    "lint": "eslint --fix --ext .ts .",
    "test": "npm run tsc--noEmit",
    "tsc--noEmit": "tsc --noEmit --project ."
  }
}
```

### src/index.ts

Entry file for exports. Notice the **mandatory** `.js` extension.
Every TypeScript source file importing another file **must** explicitly set the file
extension.

```ts
export * from "./foo.js";
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
  "extends": "@ggbot2/tsconfig",
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
