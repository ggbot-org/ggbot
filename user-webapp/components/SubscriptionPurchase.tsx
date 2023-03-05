import {
  Box,
  Button,
  Checkmark,
  Column,
  Columns,
  Control,
  Field,
  Flex,
  InputField,
  InputOnChange,
  Message,
  SelectField,
  SelectOnChange,
  SelectProps,
  Title,
  useFormattedDate,
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
import { FC, useCallback, useContext, useMemo, useEffect, useState } from "react";
import { SubscriptionContext } from "_contexts";
import { useApiAction } from "_hooks";
import { route } from "_routing";

export const SubscriptionPurchase: FC = () => {
  const { canPurchaseSubscription, hasActiveSubscription, readSubscriptionIsPending, subscriptionEnd } =
    useContext(SubscriptionContext);

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

  const formattedNewSubscriptionEnd = useFormattedDate(newSubscriptionEnd, "day");

  const isYearlyPurchase = useMemo(
    () => (typeof numMonths === "number" && numMonths >= maxNumMonths - 1 ? true : undefined),
    [numMonths]
  );
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

  if (!canPurchaseSubscription) return null;

  return (
    <Box>
      <Title>Purchase</Title>

      {hasActiveSubscription && (
        <Message color="danger">Your subscription will expire soon, please consider renew it.</Message>
      )}

      <Message>
        <p>Price for 1 month is {formattedMonthlyPrice}.</p>

        <Flex>
          <span>
            Go for 12 months subscription and get 1 month for <em>free</em>.
          </span>

          <Checkmark ok={isYearlyPurchase} />
        </Flex>
      </Message>

      <Columns>
        <Column isNarrow>
          <InputField
            label="Num months"
            value={numMonths}
            type="number"
            onChange={onChangeNumMonths}
            min={1}
            max={12}
            step={1}
          />
        </Column>

        <Column>
          <InputField label="End day" defaultValue={formattedNewSubscriptionEnd} readOnly />
        </Column>
      </Columns>

      <SelectField
        disabled={selectCountryIsDisabled}
        label="Country"
        name="country"
        onChange={onChangeCountry}
        options={countryOptions}
        value={country}
      />

      <InputField label="Email" defaultValue={email} readOnly />

      <InputField
        label="Total price"
        defaultValue={formattedTotalPrice}
        readOnly
        color={isYearlyPurchase ? "success" : undefined}
        help={isYearlyPurchase ? <p>One month for free.</p> : <>&nbsp;</>}
      />

      <Field>
        <Control>
          <Button
            color="primary"
            disabled={purchaseIsDisabled}
            onClick={onClickPurchase}
            isLoading={purchaseIsPending}
          >
            Purchase
          </Button>
        </Control>
      </Field>
    </Box>
  );
};
