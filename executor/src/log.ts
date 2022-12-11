import { pid } from "node:process";
import { timeToTimestamp, now } from "@ggbot2/time";

const timestamp = () => timeToTimestamp(now());

const prefix = () => ["executor", pid, timestamp()];

export const log = {
  error(arg: unknown) {
    if (arg instanceof Error) console.error(...prefix(), arg.message);
    else console.error(...prefix(), arg);
  },
  info(...args: unknown[]) {
    console.info(...prefix(), ...args);
  },
};
