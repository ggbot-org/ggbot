import { existsSync, mkdirSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import { dirname } from "node:path"

export const generateHtmlPage = async (
	pathname: string,
	htmlContent: string
) => {
	const dir = dirname(pathname)
	// Create directory if it does not exist.
	if (!existsSync(dir)) mkdirSync(dir)
	await writeFile(pathname, htmlContent, { encoding: "utf8" })
}
