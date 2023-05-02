import { EnvironmentVariableName } from "./environmentVariableNames.js";

export class ErrorMissingEnvironmentVariable extends Error {
  readonly variableName: EnvironmentVariableName;

  static message(
    variableName: ErrorMissingEnvironmentVariable["variableName"]
  ) {
    return `Missing environment variable ${variableName}`;
  }

  constructor(variableName: ErrorMissingEnvironmentVariable["variableName"]) {
    super(ErrorMissingEnvironmentVariable.message(variableName));
    this.variableName = variableName;
  }
}
