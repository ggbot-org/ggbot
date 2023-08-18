import { existsSync, mkdirSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import { dirname } from "node:path"

export const generateHtmlPage = async (
	pathname: string,
	htmlContent: string
) => {
	// Create directory if it does not exist.
	const dirPathname = dirname(pathname)
	if (!existsSync(dirPathname)) mkdirSync(dirPathname)
	// Write content to file.
	await writeFile(pathname, htmlContent, { encoding: "utf8" })
}
