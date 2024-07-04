import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { WebappApiGatewayDomain } from "./WebappApiGatewayDomain.js"

const webappApiGatewayDomain = new WebappApiGatewayDomain()
const domainName = await webappApiGatewayDomain.describe()

describe("WebappApiGatewayDomain", () => {
	test("exists", () => {
		assert.ok(domainName !== undefined)
	})

	// TODO more tests on output
	// domainNameStatus: 'AVAILABLE',
	// endpointConfiguration: { ipv6: false, types: [ 'REGIONAL' ] },
})
