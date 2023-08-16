export const packageDirnames = ["public", "src"] as const
export type PackageDirname = (typeof packageDirnames)[number]
