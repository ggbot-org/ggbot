# Error handling

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

It is handy for the consumer that the class name is prefixed with `Error`.
However break rules when it makes sense, for instance:

```ts
export class InternalServerError extends Error {
  constructor() {
    super("500");
  }
}
```

The constructor need to call `super` first, passing it the error message.

Error `message` is defined as a *static attribute* or a *static method*, it can be used to recognize the error in some contexts, for example when testing.


```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";

class ErrorInvalidDate extends Error {
  static message = "Invalid Date";
  constructor() {
    super(ErrorInvalidDate.message);
  }
}

const truncateDate = (arg: Date) {
  if (arg.toString() === "Invalid Date") throw new ErrorInvalidDate();
  return arg.toJSON().substring(0, 10);
}

describe("truncateDate", () => {
  it("throws ErrorInvalidDate", () => {
    assert.throws(
      () => {
        truncateDate(new Date("0000-00-00"));
      },
      {
        name: "Error",
        message: ErrorInvalidDate.message
      }
    );
  });
});
```

Optionally add info attributes to the class, for example

```ts
export class ErrorHTTP extends Error {
  static message(status: ErrorHTTP["status"]) {
    return `Server responded with ${status}`;
  }
  readonly status: number;
  constructor(status: ErrorHTTP["status"]) {
    super(ErrorHttp.message(status));
    this.status = status;
  }
}
```

Notice some info could be not defined or `unknown`.

```ts
export class ErrorItemNotFound extends Error {
  static message(type: ErrorItemNotFound["type"]) {
    return `${type} not found`;
  }
  id?: unknown
  type: "User" | "Project" | "Transaction"
  constructor({ id, type }) {
    super(ErrorItemNotFound.message(type));
    this.id = id;
    this.type = type;
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
Workers*).
An error should also be serializable into JSON, in the following example the
`toObject()` method return something that can be serialized.

```ts
export class MyError extends Error {
  static message = "Something went wrong";

  readonly bar: boolean;
  readonly quz: number;
  readonly whenCreated: number;

  static isMyErrorData (arg: unknown): arg is MyErrorData  {
    if (!arg || typeof arg !== "object") return false
    const { bar, whenCreated } = arg as Partial<MyErrorData>
    return typeof bar === "boolean" && typeof whenCreated === "number" && whenCreated > 0;
  }

  constructor({ bar, quz }: Pick<MyError, "bar" | "quz">) {
    super(MyError.message);
    this.bar = bar;
    this.quz = quz
    this.whenCreated = new Date().getTime();
  }

  toObject() {
    return {
      name: MyError.name,
      data: {
        bar: this.bar,
        quz: this.quz,
        whenCreated: this.whenCreated
      }
    }
  }
}

export type MyErrorData = Pick<MyError, "bar" | "whenCreated">;
```