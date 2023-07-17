import { EmailAddress, isEmailAddress } from "@ggbot2/models";

const emailKey = "email";
const gotFirstPageViewKey = "gotFirstPageView";

class SessionWebStorage {
  getItem(key: string) {
    return window.sessionStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  removeItem(key: string) {
    window.sessionStorage.removeItem(key);
  }

  get email(): EmailAddress | undefined {
    const value = this.getItem(emailKey);
    if (isEmailAddress(value)) return value;
  }

  set email(value: EmailAddress | undefined) {
    if (!value) {
      this.removeItem(emailKey);
    } else if (isEmailAddress(value)) {
      this.setItem(emailKey, value);
    }
  }

  get gotFirstPageView(): boolean {
    const value = this.getItem(gotFirstPageViewKey);
    return Boolean(value);
  }

  set gotFirstPageView(value: boolean) {
    if (value) {
      this.setItem(gotFirstPageViewKey, String(true));
    }
  }
}

export const sessionWebStorage = new SessionWebStorage();
