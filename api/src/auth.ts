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

export type ApiAuthEnterResponseData = {
  emailSent: boolean;
};

export const isApiAuthEnterRequestData =
  objectTypeGuard<ApiAuthEnterRequestData>(({ email }) =>
    isEmailAddress(email)
  );

export type ApiAuthVerifyRequestData = Pick<OneTimePassword, "code"> & {
  email: EmailAddress;
};

export type ApiAuthVerifyResponseData = {
  verified: boolean;
};

export const isApiAuthVerifyRequestData =
  objectTypeGuard<ApiAuthVerifyRequestData>(
    ({ code, email }) => isOneTimePasswordCode(code) && isEmailAddress(email)
  );
