export const packageScripts = ["cleanup", "dev", "lint", "start"] as const;

type PackageScript = typeof packageScripts[number];

export const packageScript: Record<PackageScript, string> = {
  cleanup: "rm -rf dist/ .next/",
  dev: "next dev",
  lint: "next lint",
  start: "next start",
};
