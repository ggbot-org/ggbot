import { join } from "node:path"

import writeFile from "write-file-utf8"

import { publicDir } from "../package.js"
import { shortenedUrlContent } from "../shortenedUrlContent.js"
import { shortenedUrls } from "../shortenedUrls.js"

for (const [pathname, url] of shortenedUrls.entries())
	await writeFile(join(publicDir, pathname), shortenedUrlContent(url))
