import { Section, SelectField, SelectProps } from "@ggbot2/ui-components";
import { countries } from "country-isocode2/en";
import { FC, useMemo } from "react";

export const BillingSettings: FC = () => {
  const countryOptions = useMemo<SelectProps["options"]>(
    () =>
      Object.entries(countries).map(([isoCode2, country]) => ({
        value: isoCode2,
        label: country,
      })),
    []
  );
  return (
    <Section header="subscribe">
      <SelectField label="country" name="country" options={countryOptions} />
    </Section>
  );
};
