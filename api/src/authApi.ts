import { objectTypeGuard } from "@ggbot2/type-utils";
import {
  EmailAddress,
  OneTimePassword,
  isEmailAddress,
  isOneTimePasswordCode,
} from "@ggbot2/models";

export type ApiAuthEnterRequestData = {
  email: EmailAddress;
};

export const isApiAuthEnterRequestData =
  objectTypeGuard<ApiAuthEnterRequestData>(({ email }) =>
    isEmailAddress(email)
  );

export type ApiAuthEnterResponseData = {
  emailSent: boolean;
};

export const isApiAuthEnterResponseData =
  objectTypeGuard<ApiAuthEnterResponseData>(
    ({ emailSent }) => typeof emailSent === "boolean"
  );

export type ApiAuthVerifyRequestData = Pick<OneTimePassword, "code"> & {
  email: EmailAddress;
};

export const isApiAuthVerifyRequestData =
  objectTypeGuard<ApiAuthVerifyRequestData>(
    ({ code, email }) => isOneTimePasswordCode(code) && isEmailAddress(email)
  );

export type ApiAuthVerifyResponseData = {
  verified: boolean;
};

export const isApiAuthVerifyResponseData =
  objectTypeGuard<ApiAuthVerifyResponseData>(
    ({ verified }) => typeof verified === "boolean"
  );

export type ApiAuthVerifyResponse = {
  data: ApiAuthVerifyResponseData;
};

export const isApiAuthVerifyResponse = objectTypeGuard<ApiAuthVerifyResponse>(
  ({ data }) => isApiAuthEnterResponseData(data)
);
