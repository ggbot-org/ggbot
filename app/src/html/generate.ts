import { writeFile } from "node:fs/promises"
import { dirname } from "node:path"

import { createDir } from "@workspace/package"

export const generateHtmlPage = async (
	pathname: string,
	htmlContent: string
) => {
	createDir(dirname(pathname))
	await writeFile(pathname, htmlContent, { encoding: "utf8" })
}
