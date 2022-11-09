/** The number of milliseconds since the @link{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps|ECMAScript epoch}.*/
export type Time = number;

export const isTime = (arg: unknown): arg is Time => {
  if (typeof arg !== "number") return false;
  return arg > 0;
};
