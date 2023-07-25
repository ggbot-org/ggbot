import { FC, useCallback, useEffect, useState } from "react";

import { _classNames } from "../components/_classNames.js";
import { DayDropdown, DayDropdownProps } from "../components/DayDropdown.js";

export type DailyIntervalClassNames = "DailyInterval";

export type DailyIntervalProps = Pick<DayDropdownProps, "min" | "max"> & {
  labelStart: DayDropdownProps["label"];
  labelEnd: DayDropdownProps["label"];
  start: DayDropdownProps["day"];
  end: DayDropdownProps["day"];
  setStart: DayDropdownProps["setDay"];
  setEnd: DayDropdownProps["setDay"];
};

export const DailyInterval: FC<DailyIntervalProps> = ({
  labelStart,
  labelEnd,
  min,
  max,
  start,
  end,
  setStart,
  setEnd,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<
    "start" | "end" | undefined
  >();

  const onClickStart = useCallback<DayDropdownProps["onClick"]>((event) => {
    event.stopPropagation();
    setActiveDropdown((activeDropdown) => {
      if (activeDropdown === "start") return undefined;
      return "start";
    });
  }, []);

  const onClickEnd = useCallback<DayDropdownProps["onClick"]>((event) => {
    event.stopPropagation();
    setActiveDropdown((activeDropdown) => {
      if (activeDropdown === "end") return undefined;
      return "end";
    });
  }, []);

  // Close dropdowns on outside click.
  useEffect(() => {
    const closeDropdowns = () => {
      setActiveDropdown(undefined);
    };
    window.addEventListener("click", closeDropdowns);
    return () => {
      window.removeEventListener("click", closeDropdowns);
    };
  }, []);

  // TODO ??
  // const onChangeStart = useCallback<DaySelectorOnChange>(
  //   (event) => {
  //     const value = event.target.value;
  //     if (!isDay(value)) return;
  //     if (value > end) return;
  //     setStart(value);
  //   },
  //   [end, setStart]
  // );

  // TODO ??
  // const onChangeEnd = useCallback<DaySelectorOnChange>(
  //   (event) => {
  //     const value = event.target.value;
  //     if (!isDay(value)) return;
  //     if (value < start) return;
  //     setEnd(value);
  //   },
  //   [start, setEnd]
  // );

  return (
    <div className={_classNames("DailyInterval")}>
      <DayDropdown
        day={start}
        isActive={activeDropdown === "start"}
        label={labelStart}
        max={end}
        min={min}
        onClick={onClickStart}
        setDay={setStart}
      />

      <DayDropdown
        day={end}
        isActive={activeDropdown === "end"}
        label={labelEnd}
        min={start}
        max={max}
        onClick={onClickEnd}
        setDay={setEnd}
      />
    </div>
  );
};
