type LinkTag = { href: string }

type ScriptTag = { src: string }

/** HTML meta tags. */
export type MetaTags = {
	description: string;
	title: string;
}

type HeadTagArg = {
	meta: MetaTags;
	stylesheets: LinkTag[];
}

/** Object for importmap script. */
export type Importmap = Record<string, string>

export type BodyScripts = ScriptTag[]

type BodyTagArg = {
	/** Add a `<dir id="root"></div>`. */
	hasRootDiv?: boolean;
	scripts: BodyScripts;
	imports: Importmap;
}

export type HtmlTagArg = HeadTagArg & BodyTagArg

export declare function html(arg: Pick<HtmlTagArg, 'hasRootDiv' | 'imports' | 'scripts'>): string
