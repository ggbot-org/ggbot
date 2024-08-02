import { ENV } from "@workspace/env"
import { WebappURLs } from "@workspace/locators"
import { dayToDate, today } from "minimal-time-helpers"
import writeFile from "write-file-utf8"

import { sitemap as filePath } from "../package.js"

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()

const webapp = new WebappURLs(DEPLOY_STAGE, ENV.DNS_DOMAIN())
const lastmod = dayToDate(today()).toISOString()

const urls = [
	new URL(webapp.baseURL),
	webapp.strategy(),
	webapp.privacy,
	webapp.terms
]

function urlset(
	urls: Array<{
		loc: string
		lastmod: string
	}>
) {
	return [
		'<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map(({ loc, lastmod }) => [
			"  <url>",
			`    <loc>${loc}</loc>`,
			`    <lastmod>${lastmod}</lastmod>`,
			"  </url>"
		].join("\n")
		),
		"</urlset>"
	].join("\n")
}

const content = `<?xml version="1.0" encoding="UTF-8"?>
${urlset(urls.map((url) => ({ loc: url.href, lastmod })))}
`

if (DEPLOY_STAGE !== "local") await writeFile(filePath, content)
