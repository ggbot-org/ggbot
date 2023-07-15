import { EmailAddress, isEmailAddress } from "@ggbot2/models";
import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils";

const emailKey = "email";
const jwtKey = "jwt";

class LocalWebStorage {
  get email(): EmailAddress | undefined {
    const value = window.localStorage.getItem(emailKey);
    if (isEmailAddress(value)) return value;
  }

  set email(value: EmailAddress | undefined) {
    if (!value) {
      window.localStorage.removeItem(emailKey);
    } else if (isEmailAddress(value)) {
      window.localStorage.setItem(emailKey, value);
    }
  }

  get jwt(): NonEmptyString | undefined {
    const value = window.localStorage.getItem(jwtKey);
    if (isNonEmptyString(value)) return value;
  }

  set jwt(value: NonEmptyString | undefined) {
    if (!value) {
      window.localStorage.removeItem(jwtKey);
    } else if (isNonEmptyString(value)) {
      window.localStorage.setItem(jwtKey, value);
    }
  }
}

export const localWebStorage = new LocalWebStorage();
