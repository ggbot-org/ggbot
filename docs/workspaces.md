# ggbot2 npm workspaces

A basic workspace package is a folder with the following content


### tsconfig.json

```jsonc
{
  "compilerOptions": {
    "esModuleInterop": true,
    "isolatedModules": true,
    "lib": ["dom", "es2015"],
    "module": "ESNext",
    "moduleResolution": "node",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true,
    "target": "ESNext"
  },
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
