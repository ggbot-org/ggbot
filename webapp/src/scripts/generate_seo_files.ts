import { join } from 'node:path'

import { ENV } from '@workspace/env'
import { FQDN, WebappBaseURL, webappDirname, WebappURLs } from '@workspace/locators'
import { dayToDate, today } from 'minimal-time-helpers'
import writeFile from 'write-file-utf8'

import { publicDir } from '../package.js'

const DEPLOY_STAGE = ENV.DEPLOY_STAGE()

const webappBaseUrl = new WebappBaseURL(new FQDN(DEPLOY_STAGE, ENV.DNS_DOMAIN()))
const webapp = new WebappURLs(webappBaseUrl)
const lastmod = dayToDate(today()).toISOString()

const sitemapUrls = [
	new URL(webapp.baseURL),
	webapp.strategy(),
	webapp.privacy,
	webapp.terms
]

// All webapp directories content should not be exposed.
function robotsDisallow(dirnames: string[]) {
	return dirnames.map((dirname) => `Disallow: /${dirname}/`).join('\n')
}

function sitemapUrlset(
	urls: Array<{
		loc: string
		lastmod: string
	}>
) {
	return [
		'<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map(({ loc, lastmod }) => [
			'  <url>',
			`    <loc>${loc}</loc>`,
			`    <lastmod>${lastmod}</lastmod>`,
			'  </url>'
		].join('\n')
		),
		'</urlset>'
	].join('\n')
}

const sitemapFilename = 'sitemap.xml'

const robotsContent = `# https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /
${robotsDisallow(Object.values(webappDirname))}

Sitemap: ${new URL(sitemapFilename, webappBaseUrl)}`

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
${sitemapUrlset(sitemapUrls.map((url) => ({ loc: url.href, lastmod })))}
`

// Only generate SEO files for production.
if (DEPLOY_STAGE === 'main') {
	await writeFile(join(publicDir, 'robots.txt'), robotsContent)
	await writeFile(join(publicDir, 'sitemap.xml'), sitemapContent)
}
