import type { NextApiRequest, NextApiResponse } from "next";
import { JsonObject } from "type-fest";

type ApiActionInput<T = string> = {
  type: T;
};

type ApiActionOutput = JsonObject;

export default async function apiActionHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiActionOutput>
) {
  try {
    if (req.method !== "POST") return res.status(405);

    const input: ApiActionInput = req.body;

    switch (input.type) {
      default: {
        res.status(200).json({});
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
}
