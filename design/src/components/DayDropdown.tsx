import { FC, useId } from "react";
import { FormattedDate } from "react-intl";
import {
  Control,
  Dropdown,
  DropdownMenu,
  DropdownProps,
  DropdownTrigger,
  Field,
  Label,
} from "trunx";

import { _classNames } from "../components/_classNames.js";
import { Calendar, CalendarProps } from "../components/Calendar.js";
import { dayFormat } from "../i18n/formats.js";

export type DayDropdownProps = Required<
  Pick<DropdownProps, "isActive" | "onClick">
> &
  Pick<CalendarProps, "day" | "setDay" | "min" | "max"> & {
    label: string;
  };

export const DayDropdown: FC<DayDropdownProps> = ({
  day,
  isActive,
  label,
  onClick,
  setDay,
  min,
  max,
}) => {
  const id = useId();

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Control>
        <Dropdown isActive={isActive} onClick={onClick}>
          <DropdownTrigger>
            <FormattedDate value={day} {...dayFormat} />
          </DropdownTrigger>

          <DropdownMenu>
            <Calendar day={day} setDay={setDay} min={min} max={max} />
          </DropdownMenu>
        </Dropdown>
      </Control>
    </Field>
  );
};
