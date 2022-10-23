export const packageScripts = [
  "build",
  "cleanup",
  "jest",
  "lint",
  "test",
  "tsc--noEmit",
] as const;

type PackageScript = typeof packageScripts[number];

export const packageScript: Record<PackageScript, string> = {
  build: "tsc --build tsconfig.build.json",
  cleanup: "rm -rf dist/",
  jest: "jest",
  lint: "eslint src",
  test: "npm run tsc--noEmit; npm run jest",
  "tsc--noEmit": "tsc --noEmit --project .",
};
