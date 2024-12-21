import { build, BuildOptions } from 'esbuild'

export type BrowserBundleArg = Pick<BuildOptions, 'entryPoints' | 'outfile'>

export declare function browserBundle(arg: BrowserBundleArg): ReturnType<typeof build>
