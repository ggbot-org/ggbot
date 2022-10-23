# ggbot2 npm workspaces

This repo uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

Every workspace folder has the same name as its package and is a direct child of the project root folder.
Hence every workspace folder name has lower case letters with hyphen, as a valid npm name. For example: _foo-bar_.

Every workspace folder must be listed in the root *package.json* `workspaces` attribute.

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
    "prebuild:foo-bar": "npm run build:another-package && npm run build:yet-another-package",
    "test:foo-bar": "npm run test --workspace foo-bar"
  }
```

## Folder structure

A basic workspace package is a folder with the following files:

* .eslintrc.json
* .gitignore
* jest.config.cjs
* package.json
* src/index.ts
* tsconfig.json
* tsconfig.build.json

### .eslintrc.json

Configure [eslint](https://eslint.org/) when it makes sense.

```json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-warning-comments": "error"
  }
}
```

### .gitignore

Create a gitignore file with at least the following content

```
dist/
```

### jest.config.cjs

Configure [jest] with the following:

```js
const path = require("path");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  moduleNameMapper: {
    "(.+)\\.js": "$1",
    "@ggbot2/(.*)": path.resolve(__dirname, "../$1/src/index.ts"),
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
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
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc --build tsconfig.build.json",
    "lint": "eslint src",
    "jest": "jest",
    "test": "npm run tsc--noEmit; npm run jest",
    "tsc--noEmit": "tsc --noEmit --project ."
  },
  "dependencies": {
    // Dependency from another workspace package is referenced using `file:` prefix.
    "@ggbot2/another-package": "file:another-package"
  },
  "devDependencies": {
    // The "@ggobt2/dev" package adds a list of development dependencies.
    "@ggobt2/dev": "file:dev"
  }
}
```

### src/index.ts

Entry file for exports. Notice the **mandatory** `.js` extension.

```ts
export * from "./foo.js";
```

### tsconfig.json

```jsonc
{
  "compilerOptions": {
    "esModuleInterop": true,
    "lib": ["dom", "es2015"],
    "module": "esnext",
    "moduleResolution": "node",
    "target": "esnext"
  },
  // Extend common set of `compilerOptions`, used to improve code quality.
  "extends": "../tsconfig.common.json",
  "include": ["./src/**/*.ts"]
}
```

### tsconfig.build.json

```jsonc
{
  "compilerOptions": {
    "declaration": true,
    // Go to JS file when using IDE functions like "Go to Definition" in VSCode.
    "declarationMap": true,
    "incremental": true,
    "outDir": "./dist"
  },
  "extends": "./tsconfig.json",
  "exclude": [
    "node_modules",
    // Exclude tests.
    "**/*.spec.ts"
  ]
}
```

[jest]: https://jestjs.io/ "Jest"
