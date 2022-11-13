# Error handling

Place all package errors in *src/errors.ts* file and export them in
*src/index.ts*.
Create errors extending an error class, e.g. `Error` or `TypeError`.
The constructor need to call `super` passing it the error message.
Then override the `name` attribute.

```ts
export class ErrorInvalidArg extends Error {
  constructor(arg: unknown) {
    super(`Invalid arg ${arg}`);
    this.name = ErrorInvalidArg.name;
  }
}
```

In this way then the error is stringified in the stack trace it will produce
something like

```
ErrorInvalidArg: Invalid arg undefined
```

Optionally add info attributes to the class, for example

```ts
export class ErrorHttpResponse extends Error {
  status: number;
  constructor(status: number) {
    super(`${status}`);
    this.name = ErrorHttpResponse.name;
    this.status = status;
  }
}

```
