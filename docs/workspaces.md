# ggbot2 npm workspaces

A basic workspace package is a folder with the following content


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
