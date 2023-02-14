import {
  Button,
  Checkmark,
  DateTime,
  InputField,
  InputOnChange,
  OutputField,
  Pill,
  Section,
  SelectField,
  SelectOnChange,
  SelectProps,
} from "@ggbot2/design";
import {
  AllowedCountryIsoCode2,
  isAccount,
  isAllowedCountryIsoCode2,
  monthlyPrice,
  monthlyPriceCurrency,
  totalPurchase,
  purchaseMaxNumMonths as maxNumMonths,
} from "@ggbot2/models";
import { getTime, now } from "@ggbot2/time";
import { isMaybeObject, isNaturalNumber } from "@ggbot2/type-utils";
import { countries } from "country-isocode2/en";
import { FC, ReactNode, useCallback, useMemo, useEffect, useState } from "react";
import { useApiAction, useSubscription } from "_hooks";
import { route } from "_routing";

export const BillingSettings: FC = () => {
  const endDayLabel = "end day";

  const {
    canPurchaseSubscription,
    hasActiveSubscription,
    readSubscriptionIsPending,
    subscriptionEnd,
    subscriptionPlan,
  } = useSubscription();

  const [readAccount, { data: account }] = useApiAction.ReadAccount();
  const [setAccountCountry] = useApiAction.SetAccountCountry();

  const [purchaseIsPending, setPurchaseIsPending] = useState(false);
  const [formattedMonthlyPrice, setFormattedMonthlyPrice] = useState("");
  const [formattedTotalPrice, setFormattedTotalPrice] = useState("");
  const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("");
  const minNumMonths = 1;
  const defaultNumMonths = 6;
  const [numMonths, setNumMonths] = useState<number | undefined>(defaultNumMonths);

  const { countryOptions, email, selectCountryIsDisabled } = useMemo<{
    countryOptions: SelectProps["options"];
    email: string;
    selectCountryIsDisabled: boolean;
  }>(() => {
    const allowedCountryOptions = Object.entries(countries)
      .filter(([isoCode2]) => isAllowedCountryIsoCode2(isoCode2))
      .map(([isoCode2, country]) => ({
        value: isoCode2,
        label: country,
      }));
    if (!isAccount(account))
      return {
        countryOptions: [{ value: "", label: "" }],
        email: "",
        selectCountryIsDisabled: true,
      };
    return {
      countryOptions: account.country
        ? allowedCountryOptions
        : [{ value: "", label: "-- your country --" }, ...allowedCountryOptions],
      email: account.email,
      selectCountryIsDisabled: false,
    };
  }, [account]);

  const subscriptionInfo = useMemo<{ label: string; value: ReactNode }[]>(
    () =>
      [
        {
          label: "plan",
          value: subscriptionPlan ?? "",
        },
        {
          label: endDayLabel,
          value: subscriptionEnd && <DateTime format="day" value={subscriptionEnd} />,
        },
      ].map(({ value, ...rest }) => ({
        value: value ? value : <>&nbsp;</>,
        ...rest,
      })),
    [subscriptionEnd, subscriptionPlan]
  );

  const purchaseIsDisabled = useMemo(() => {
    if (!country) return true;
    if (!isNaturalNumber(numMonths)) return true;
    if (numMonths < minNumMonths) return true;
    if (numMonths > maxNumMonths) return true;
    return false;
  }, [country, numMonths]);

  const newSubscriptionEnd = useMemo(() => {
    if (readSubscriptionIsPending) return;
    if (!isNaturalNumber(numMonths)) return;
    const start = subscriptionEnd ? getTime(subscriptionEnd).plus(1).days() : now();
    return getTime(start)
      .plus(numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths)
      .months();
  }, [numMonths, readSubscriptionIsPending, subscriptionEnd]);

  const onChangeNumMonths = useCallback<InputOnChange>(
    (event) => {
      const value = event.target.value;
      if (value === "") {
        setNumMonths(undefined);
        return;
      }
      const num = Number(value);
      if (num >= minNumMonths && num <= maxNumMonths) setNumMonths(num);
    },
    [setNumMonths]
  );

  const onChangeCountry = useCallback<SelectOnChange>(
    (event) => {
      const country = event.target.value;
      if (isAllowedCountryIsoCode2(country)) setCountry(country);
    },
    [setCountry]
  );

  const onClickPurchase = useCallback(async () => {
    if (purchaseIsDisabled) return;
    if (purchaseIsPending) return;
    setPurchaseIsPending(true);
    try {
      const response = await fetch(route.apiPurchaseOrder(), {
        body: JSON.stringify({ country, email, numMonths }),
        credentials: "include",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        if (isMaybeObject<{ redirectUrl: string }>(data)) {
          const { redirectUrl } = data;
          if (typeof redirectUrl === "string") window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error(error);
      setPurchaseIsPending(false);
    }
  }, [country, email, purchaseIsDisabled, purchaseIsPending, numMonths]);

  useEffect(() => {
    if (!isAccount(account)) return;
    if (account.country) setCountry(account.country);
  }, [account, setCountry]);

  useEffect(() => {
    if (!isAccount(account)) return;
    if (!country) return;
    if (account.country !== country) {
      setAccountCountry({ country });
    }
  }, [account, country, setAccountCountry]);

  useEffect(() => {
    const controller = readAccount({});
    return () => {
      controller.abort();
    };
  }, [readAccount]);

  useEffect(() => {
    const { format } = new Intl.NumberFormat(window.navigator.language, {
      style: "currency",
      currency: monthlyPriceCurrency,
    });
    if (!formattedMonthlyPrice) setFormattedMonthlyPrice(format(monthlyPrice));
    if (numMonths) setFormattedTotalPrice(format(totalPurchase(numMonths)));
  }, [formattedMonthlyPrice, numMonths]);

  return (
    <>
      {hasActiveSubscription && (
        <Section
          header={
            <div className="inline-flex items-center gap-4">
              <span>Subscription</span>
              <div>
                <Pill color="primary">active</Pill>
              </div>
            </div>
          }
        >
          <div>
            {subscriptionInfo.map(({ label, value }, i) => (
              <OutputField key={i} label={label}>
                {value}
              </OutputField>
            ))}
          </div>
        </Section>
      )}

      {canPurchaseSubscription && (
        <Section header="Subscribe">
          {hasActiveSubscription && <p>Your subscription will expire soon, please consider renew it.</p>}

          <p>Price for 1 month is {formattedMonthlyPrice}.</p>

          <div className="text-lg flex gap-1 my-2">
            <div>
              Go for 12 months subscription and get 1 month for <em>free</em>.
            </div>
            <Checkmark
              ok={typeof numMonths === "number" && numMonths >= maxNumMonths - 1 ? true : undefined}
            />
          </div>

          <InputField
            label="num months"
            value={numMonths}
            type="number"
            onChange={onChangeNumMonths}
            min={1}
            max={12}
            step={1}
          />

          <OutputField label={endDayLabel}>
            <DateTime format="day" value={newSubscriptionEnd} />
          </OutputField>

          <SelectField
            disabled={selectCountryIsDisabled}
            label="country"
            name="country"
            onChange={onChangeCountry}
            options={countryOptions}
            value={country}
          />

          <OutputField label="email">{email}</OutputField>

          <OutputField label="Total price">{formattedTotalPrice}</OutputField>

          <menu>
            <li>
              <Button
                disabled={purchaseIsDisabled}
                onClick={onClickPurchase}
                isSpinning={purchaseIsPending}
              >
                Purchase
              </Button>
            </li>
          </menu>
        </Section>
      )}
    </>
  );
};
