export const typeChecksNpmScriptKey = "tsc--noEmit";

export const packageScripts = [
  "build",
  "cleanup",
  "jest",
  "test",
  typeChecksNpmScriptKey,
] as const;

type PackageScript = typeof packageScripts[number];

export const packageScript: Record<PackageScript, string> = {
  build: "tsc --build tsconfig.build.json",
  cleanup: "rm -rf dist/",
  jest: "jest",
  test: "npm run tsc--noEmit; npm run jest",
  "tsc--noEmit": "tsc --noEmit --project .",
};
