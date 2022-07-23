/**
 * String with format yyyy-mm-ddThh:mm:ss.lllZ
 */
export type Timestamp = string;

export type Now = () => Timestamp;

export const now: Now = () => new Date().toJSON();
