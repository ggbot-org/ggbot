# Error handling

Place all package errors in *src/errors.ts* file and export them in
*src/index.ts*.

## How to define an error

Create an error extending the `Error` class.

```ts
export class ErrorInvalidArg extends Error {
  static message = "Invalid argument";
  constructor() {
    super(ErrorInvalidArg.message);
  }
}
```

It is not worth to extend other error classes, (e.g. `TypeError`, `RangeError`)
as they are used to categorize [errors thrown by JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors) and extending them would pollute what consumers expect to be on that list.

In most cases it is handy for the consumer that the class name is prefixed with `Error`.

The constructor need to call `super` first, passing it the error message.

The error message is a *static string*, not a *template literal*, in
order to be able to use [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).

When the error is stringified in the stack trace it will produce something like

```
Error: Invalid argument
```

Error message is defined as a *static attribute*, it can be used to recognize
the error in some contexts, for example when testing.

Optionally add info attributes to the class, for example

```ts
export class ErrorHttpResponse extends Error {
  static message = "HTTP response failure";
  readonly status: number;
  constructor(status: number) {
    super(ErrorHttpResponse.message);
    this.status = status;
  }
}
```

## How to catch errors

Using `if` instead of `switch` looks better when using TypeScript.
Notice also that the correct type for the catched error is `unknown`.

```ts
try {
  // code
  throw new MyError();
} catch (error) {
  if (error instanceof MyError) {
    // handle it
  }
  // otherwise
  throw error
}
```

However, using `error instanceof MyError` can be done only if the error instance
was created in the same JavaScript context that catches it. This could be not
the case, not only in client-server model but also when using threads (e.g. *Web
Workers*). An error should also be serializable into JSON.

```ts
export class MyError extends Error {
  static message = "Something went wrong";

  readonly bar: boolean;
  readonly whenCreated: number;

  static isMyErrorData (arg: unknown): arg is MyErrorData  {
    if (!arg || typeof arg !== "object") return false
    const { bar, whenCreated } = arg as Partial<MyErrorData>
    return typeof bar === "boolean" && typeof whenCreated === "number" && whenCreated > 0;
  }

  constructor({ bar }: Pick<MyError, "bar">) {
    super(MyError.message);
    this.bar = bar;
    this.whenCreated = new Date().getTime();
  }

  toJSON() {
    return JSON.stringify({
      error: {
        name: MyError.name,
        data: {
          bar: this.bar,
          whenCreated: this.whenCreated
        }
      }
    })
  }
}

export type MyErrorData = Pick<MyError, "bar" | "whenCreated">;
```
