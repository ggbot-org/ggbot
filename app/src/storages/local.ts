import { EmailAddress, isEmailAddress } from "@ggbot2/models";

const emailKey = "email";

class LocalStorage {
  get email(): EmailAddress | undefined {
    const value = window.localStorage.getItem(emailKey);
    if (isEmailAddress(value)) return value;
    if (value !== null) window.localStorage.removeItem(emailKey);
  }

  set email(value: EmailAddress | undefined) {
    if (value) {
      window.localStorage.setItem(emailKey, value);
    } else {
      window.localStorage.removeItem(emailKey);
    }
  }
}

export const localStorage = new LocalStorage();
