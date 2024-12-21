import { WorkerName } from './workers'

export declare const nodeModulesDir: string
export declare const monorepoDir: string

export declare const publicDir: string
export declare const typesDir: string
export declare const workspaceDir: string

/**
 * Info to generate importmap script to share JS modules across apps.
 * The key is the import name, will be marked as "external" in esbuild config to be excluded from the JS bundles.
 */
export declare const importmapConfig: Record<
	string,
	{
		/** Path to source module directory, relative to node_modules folder. */
		sourceDir: string[];
		/** Original filename as found in source directory. */
		sourceFile: string;
		/** Path to public module directory, relative to webapp public folder. */
		targetDir: string[];
		/** The `sourceFile` name may differ from original `targetFile` name to have better DX, for example when looking at Network tab in browser dev tools. */
		targetFile: string;
		/** Optional source map filename, must be same as linked in module file last line comment. */
		sourceMap?: string;
	}
>

type AppName = 'admin' | 'design' | 'landing' | 'strategy' | 'user'

type EcmaScriptName = AppName | WorkerName

export declare const webappEcmaScriptsConfig: Record<
	EcmaScriptName,
	{
		entryPoint: string;
		jsPath: string[];
	}
>
