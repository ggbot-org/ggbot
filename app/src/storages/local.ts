import { EmailAddress, isEmailAddress } from "@ggbot2/models";

class LocalStorage {
  static emailKey = "email";

  get email(): EmailAddress | undefined {
    const value = localStorage.getItem(LocalStorage.emailKey);
    if (isEmailAddress(value)) return value;
    if (value !== null) localStorage.removeItem(LocalStorage.emailKey);
  }

  set email(value: EmailAddress | undefined) {
    if (value) {
      localStorage.setItem(LocalStorage.emailKey, value);
    } else {
      localStorage.removeItem(LocalStorage.emailKey);
    }
  }
}

export const local = new LocalStorage();
