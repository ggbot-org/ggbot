import { strict as assert } from "node:assert"
import { describe, test } from "node:test"

import { LoadBalancerStateEnum } from "@workspace/aws"

import { BinanceProxyLoadBalancer } from "./BinanceProxyLoadBalancer.js"

const binanceProxyLoadBalancer = new BinanceProxyLoadBalancer()
const loadBalancer = await binanceProxyLoadBalancer.describe()

describe("BinanceProxyLoadBalancer", () => {
	test("exists", async () => {
		assert.ok(loadBalancer !== undefined)
	})

	if (loadBalancer) {
		test("is active", () => {
			assert.ok(loadBalancer.State?.Code === LoadBalancerStateEnum.ACTIVE)
		})

		// TODO consider testing
		// AvailabilityZones
		// SecurityGroups
	}
})
