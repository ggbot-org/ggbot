# NextJS API handler

Use the following template

```ts
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__
} from "@ggbot2/http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

// Type input data
type RequestData = {};

type ResponseData = {
  ok: boolean
};

// Also create a type guard for input data
function isRequestData (value: unknown): value is RequestData {
  if (typeof value !== 'object' || value === null) return false
  // ... validation code
}

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Handle HTTP method
    if (req.method !== "POST") return res.status(__405__METHOD_NOT_ALLOWED__);

    // Check ResponseData is valid
    const input = req.body;
    if (!isRequestData(input)) return res.status(__400__BAD_REQUEST__)

    // ... other code

    // Return status
    res.status(__200__OK__).json({ ok: true });
  } catch (error) {
    // Handle known errors
    if (error instanceof SomeError) {
      return res.status(__400__BAD_REQUEST__).json({});
    }

    // Fallback to generic error
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
```