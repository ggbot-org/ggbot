const titleTag = "<title>&lrm;</title>"
const redirectTag = (target: URL) =>
	`<meta http-equiv="refresh" content="0; url=${target.href}"/>`
const faviconTag = '<link rel="icon" href="data:;base64,=">'

export const shortenedUrlContent = (target: URL) =>
	[
		"<html><head>",
		titleTag,
		faviconTag,
		redirectTag(target),
		"</head></html>"
	].join("")
