import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { today, dateToDay, getDate, dayToDate } from "@ggbot2/time";
import { nullId } from "./item.js";
import {
  isSubscriptionPurchase,
  newMonthlySubscription,
  newYearlySubscription,
} from "./subscriptionPurchase.js";
import { createdNow } from "./time.js";

describe("isSubscriptionPurchase", () => {
  it("validates SubscriptionPurchase", () => {
    const paymentProvider = "utrust";
    const plan = "basic";
    const startDay = today();
    const startDate = dayToDate(startDay);
    const numMonths = 3;
    const endDate = getDate(startDate).plus(numMonths).months();
    const endDay = dateToDay(endDate);
    const dayInterval = { start: startDay, end: endDay };
    const { whenCreated } = createdNow();

    [
      {
        input: newMonthlySubscription({
          plan,
          paymentProvider,
          startDay,
          numMonths: 2,
        }),
        output: true,
      },
      {
        input: newYearlySubscription({
          plan,
          paymentProvider,
          startDay,
        }),
        output: true,
      },
      {
        input: {
          id: nullId,
          plan,
          paymentProvider,
          whenCreated,
          ...dayInterval,
        },
        output: true,
      },
      {
        input: {
          id: nullId,
          plan,
          paymentProvider,
          whenCreated,
          status: "completed",
          ...dayInterval,
          info: {
            uuid: "xxx",
          },
        },
        output: true,
      },
      {
        input: {
          id: nullId,
          plan,
          paymentProvider,
          whenCreated,
          status: "completed",
          ...dayInterval,
          info: "not an object",
        },
        output: true,
      },
      {
        input: {
          id: nullId,
          plan: "not an plan",
          status: "completed",
          whenCreated,
          paymentProvider,
          ...dayInterval,
        },
        output: false,
      },
      {
        input: {
          id: nullId,
          plan,
          status: "completed",
          whenCreated: "not a timestamp",
          paymentProvider,
          ...dayInterval,
        },
        output: false,
      },
      {
        input: {
          id: nullId,
          plan,
          status: "completed",
          whenCreated,
          paymentProvider: "not a paymentProvider",
          ...dayInterval,
        },
        output: false,
      },
    ].forEach(({ input, output }) => {
      assert.equal(
        isSubscriptionPurchase(input),
        output,
        `isSubscriptionPurchase(${JSON.stringify(input)}) !== ${output}`
      );
    });
  });
});
