import { readEmailCookie } from "@ggbot2/cookies";
import { getUtrustApiKey, deployStageIsMain } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import { ApiClient, Order, Customer } from "@utrustdev/utrust-ts-library";
import type { NextApiRequest, NextApiResponse } from "next";
import { readSession, route, webappBaseUrl } from "_routing";

type RequestData = {};

const isRequestData = (_arg: unknown): _arg is RequestData => {
  return true;
};

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Handle HTTP method
    if (req.method !== "POST")
      return res.status(__405__METHOD_NOT_ALLOWED__).json({});

    const email = readEmailCookie(req.cookies);
    if (!email) return res.status(__400__BAD_REQUEST__).json({});

    const session = readSession(req.cookies);
    if (!session) return res.status(__401__UNAUTHORIZED__).json({});
    // TODO const {accountId} = session

    const apiKey = getUtrustApiKey();
    const { createOrder } = ApiClient(
      apiKey,
      deployStageIsMain ? "production" : "sandbox"
    );

    // Check ResponseData is valid
    const input = req.body;
    if (!isRequestData(input)) return res.status(__400__BAD_REQUEST__).json({});

    const returnUrl = `${webappBaseUrl}${route.settingsPage("billing")}`;

    const order: Order = {
      reference: "order-51367",
      amount: {
        total: "10.00",
        currency: "EUR",
      },
      return_urls: {
        return_url: returnUrl,
      },
      line_items: [
        {
          sku: "item-unique-id",
          name: "Donation",
          price: "10.00",
          currency: "EUR",
          quantity: 1,
        },
      ],
    };

    // TODO read email from account
    // account need to set his country in BillingSettings
    // TODO store country in accountConfig
    const customer: Customer = {
      email,
      country: "US",
    };

    const { data } = await createOrder(order, customer);

    if (data === null) return res.status(__400__BAD_REQUEST__).json({});

    const { redirectUrl } = data;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(__500__INTERNAL_SERVER_ERROR__).json({});
  }
}
