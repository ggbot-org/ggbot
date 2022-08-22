export class ErrorInvalidName extends Error {
  constructor(value: unknown) {
    super(`Invalid name ${value}`);
  }
}

export class ErrorNameToLong extends Error {
  constructor(value: string) {
    super(`Name to long, length is ${value.length}`);
  }
}
