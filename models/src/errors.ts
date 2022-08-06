export class ErrorInvalidName extends Error {
  constructor(name: unknown) {
    super(`Invalid name ${name}`);
  }
}

export class ErrorNameToLong extends Error {
  constructor(name: string) {
    super(`Name to long, lenght is ${name.length}`);
  }
}
