import { strict as assert } from "node:assert"
import { describe, it } from "node:test"

import { htmlPageContent } from "./pageContent.js"

describe("htmlPageContent", () => {
	it("works", () => {
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width" />
<title>page title</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="root"></div>
<script type="module" src="app.js"></script>
</body>
</html>`

		assert.equal(
			htmlPageContent({
				hasRootDiv: true,
				meta: {
					title: "page title"
				},
				stylesheets: [
					{
						href: "style.css"
					}
				],
				scripts: [
					{
						src: "app.js"
					}
				]
			}),
			html
		)
	})
})
