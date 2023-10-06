import { join } from "node:path"

import write from "write-file-utf8"

import { publicDir } from "../package.js"
import { shortenedUrlContent } from "../shortenedUrlContent.js"
import { shortenedUrls } from "../shortenedUrls.js"

for (const [pathname, url] of shortenedUrls.entries())
	await write(join(publicDir, pathname), shortenedUrlContent(url))
