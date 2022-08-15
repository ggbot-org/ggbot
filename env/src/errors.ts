import type { EnvironmentVariable } from "./environmentVariable.js";

export class ErrorInvalidEnvironmentVariable extends Error {
  constructor({ name, value }: { name: EnvironmentVariable; value: unknown }) {
    super(`Invalid environment variable ${name} ${value}`);
  }
}
