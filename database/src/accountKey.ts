import type { AccountKey } from "@ggbot2/models";

export const accountKeyToDirname = ({ accountId }: AccountKey) =>
  `accountId=${accountId}`;
