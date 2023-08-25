import { EnvironmentVariableName } from "./environmentVariableNames.js"

export class ErrorMissingEnvironmentVariable extends Error {
	readonly variableName: EnvironmentVariableName
	constructor(variableName: ErrorMissingEnvironmentVariable["variableName"]) {
		super(ErrorMissingEnvironmentVariable.message(variableName))
		this.variableName = variableName
	}
	static message(
		variableName: ErrorMissingEnvironmentVariable["variableName"]
	) {
		return `Missing environment variable ${variableName}`
	}
}
