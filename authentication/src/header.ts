import { ENV } from "@ggbot2/env";
// @ts-ignore
import jsonwebtoken from "jsonwebtoken";

import { ErrorUnauthorizedAuthenticationHeader } from "./errors.js";

/**
 * @throws {@link ErrorUnauthorizedAuthenticationHeader}
 * @throws {@link ErrorMissingEnvironmentVariable}
 */
export const verifyAuthenticationHeader = (headerContent: unknown) => {
  if (typeof headerContent !== "string")
    throw new ErrorUnauthorizedAuthenticationHeader();

  const token = headerContent.substring("BEARER ".length);
  if (token.length === 0) throw new ErrorUnauthorizedAuthenticationHeader();

  try {
    const decoded = jsonwebtoken.verify(token, ENV.JWT_SECRET);
    return decoded;
  } catch (_ignore) {
    throw new ErrorUnauthorizedAuthenticationHeader();
  }
};
