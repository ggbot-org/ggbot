import { test } from "node:test"

import { assertEqual } from "minimal-assertion-helpers"
import { MaybeObject } from "minimal-type-guard-helpers"

import { ApiActionInput, isApiActionInput } from "./apiAction.js"

void test("isApiActionInput", () => {
	const myApiActionTypes = ["foo", "bar"] as const
	type MyApiActionType = (typeof myApiActionTypes)[number]
	type MyApiActionInput = ApiActionInput<MyApiActionType>
	const isMyApiActionInput =
		isApiActionInput<MyApiActionType>(myApiActionTypes)

	assertEqual<MaybeObject<MyApiActionInput>, boolean>(isMyApiActionInput, [
		{
			input: {
				type: "foo"
			},
			output: true
		},
		{
			input: {
				type: "bar"
			},
			output: true
		},
		{
			input: {
				type: "quz"
			},
			output: false
		},
		{
			input: {
				type: "foo",
				data: 42
			},
			output: true
		}
	])
})
