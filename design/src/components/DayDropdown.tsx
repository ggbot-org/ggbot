import { FC, useCallback, useId } from "react";
import { FormattedDate } from "react-intl";
import {
  Control,
  Dropdown,
  DropdownMenu,
  DropdownProps,
  DropdownTrigger,
  Field,
} from "trunx";

import { _classNames } from "../components/_classNames.js";
import { Calendar, CalendarProps } from "../components/Calendar.js";
import { Label } from "../components/Label.js";
import { dayFormat } from "../i18n/formats.js";

export type DayDropdownProps = Required<
  Pick<DropdownProps, "isActive" | "onClick">
> &
  Pick<CalendarProps, "day" | "setDay" | "min" | "max"> & {
    label: string;
  } & { close: () => void };

export const DayDropdown: FC<DayDropdownProps> = ({
  close,
  day,
  isActive,
  label,
  onClick,
  setDay: _setDay,
  min,
  max,
}) => {
  const id = useId();

  const setDay = useCallback<DayDropdownProps["setDay"]>(
    (day) => {
      _setDay(day);
      close();
    },
    [close, _setDay]
  );

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
