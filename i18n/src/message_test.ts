import { test } from "node:test"

import { assertDeepEqual, assertEqual } from "minimal-assertion-helpers"

import { parseMessage, translateMessage } from "./message.js"

test("parseMessage", () => {
	assertDeepEqual<Parameters<typeof parseMessage>[0], ReturnType<typeof parseMessage>>(parseMessage, [
		{
			input: "",
			output: [{ kind: "messageText", value: "" }]
		},
		{
			input: "hello",
			output: [{ kind: "messageText", value: "hello" }]
		},
		{
			input: "{foo}",
			output: [{ kind: "noneArg", value: "foo" }]
		},
		{
			input: "hello {name}, howdy!?",
			output: [
				{ kind: "messageText", value: "hello " },
				{ kind: "noneArg", value: "name" },
				{ kind: "messageText", value: ", howdy!?" }
			]
		},
		{
			input: "abc {value}",
			output: [
				{ kind: "messageText", value: "abc " },
				{ kind: "noneArg", value: "value" }
			]
		},
		{
			input: "abc {value1}{value2}",
			output: [
				{ kind: "messageText", value: "abc " },
				{ kind: "noneArg", value: "value1" },
				{ kind: "noneArg", value: "value2" }
			]
		},
		{
			input: "a{b}c",
			output: [
				{ kind: "messageText", value: "a" },
				{ kind: "noneArg", value: "b" },
				{ kind: "messageText", value: "c" }
			]
		},
		{
			input: "C & C++",
			output: [{ kind: "messageText", value: "C & C++" }]
		},
	])
})

test("translateMessage", () => {
	assertEqual<Parameters<typeof translateMessage>, ReturnType<typeof translateMessage>>(
		([arg1, arg2]: Parameters<typeof translateMessage>) => translateMessage(arg1, arg2), [
			{
				input: [{}, { id: "message.not.found" }],
				output: ""
			},
			{
				input: [
					{ "menu.close": "Schließen" },
					{ id: "menu.close" }
				],
				output: "Schließen"
			},
			{
				input: [
					{ "arithmetic.operation": "a{operator}b" },
					{ id: "arithmetic.operation", values: { operator: "+" } }
				],
				output: "a+b"
			},
			{
				input: [
					{ "repeated.value": "foo bar {repeated}{repeated}" },
					{ id: "repeated.value", values: { repeated: "value" } }
				],
				output: "foo bar valuevalue"
			},
			{
				input: [
					{ "welcome.message": "Hello {name}" },
					{ id: "welcome.message", values: { name: "Ozzy" } }
				],
				output: "Hello Ozzy"
			},
			{
				input: [
					{ "missing.value": "this {param} is missing" },
					{ id: "missing.value", values: { } }
				],
				output: "this  is missing"
			},
		])
})

