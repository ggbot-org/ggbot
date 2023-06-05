import { EmailAddress, isEmailAddress } from "@ggbot2/models";

const { getItem, setItem, removeItem } = window.localStorage;

class LocalStorage {
  static emailKey = "email";

  get email(): EmailAddress | undefined {
    const value = getItem(LocalStorage.emailKey);
    if (isEmailAddress(value)) return value;
    if (value !== null) removeItem(LocalStorage.emailKey);
  }

  set email(value: EmailAddress | undefined) {
    if (value) {
      setItem(LocalStorage.emailKey, value);
    } else {
      removeItem(LocalStorage.emailKey);
    }
  }
}

export const localStorage = new LocalStorage();
