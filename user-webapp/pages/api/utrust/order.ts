import { mul } from "@ggbot2/arithmetic";
import { readEmailCookie } from "@ggbot2/cookies";
import { getUtrustApiKey, deployStageIsMain } from "@ggbot2/env";
import {
  __200__OK__,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __405__METHOD_NOT_ALLOWED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
import {
  PaymentProvider,
  SubscriptionPlan,
  newMonthlySubscription,
  newYearlySubscription,
} from "@ggbot2/models";
import { today } from "@ggbot2/time";
import type { NaturalNumber } from "@ggbot2/type-utils";
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

    // TODO numMonths
    // if 12 apply discount, multiply by 11
    const numMonths: NaturalNumber = 12;
    const price = "10.00";
    const numDecimals = 2;
    // TODO const total = mul(price, Math.max(numMonths, 11), numDecimals);
    const total = mul(price, Math.max(numMonths, 1), numDecimals);
    const plan: SubscriptionPlan = "basic";
    const reference = `order-${plan}`;

    const paymentProvider: PaymentProvider = "utrust";

    //
    // TODO if subscription expires in less than one Month
    // show subscribe button in Billing settings.
    //
    // TODO need also to read current subscription to get startDay
    const startDay = today();

    const purchase =
      numMonths === 12
        ? newYearlySubscription({ plan, paymentProvider, startDay })
        : newMonthlySubscription({
            plan,
            paymentProvider,
            numMonths,
            startDay,
          });

    console.log(purchase);
    // TODO store purchase
    // use CreateYearlySubscriptionPurchase and
    // CreateMonthlySubscriptionPurchase

    const order: Order = {
      reference,
      amount: {
        total,
        currency: "EUR",
      },
      return_urls: {
        return_url: returnUrl,
      },
      line_items: [
        {
          sku: purchase.id,
          name: "Subscription",
          price,
          currency: "EUR",
          quantity: numMonths,
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
