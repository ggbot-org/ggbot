import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils";

const jwtKey = "jwt";

class LocalWebStorage {
  getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  get jwt(): NonEmptyString | undefined {
    const value = this.getItem(jwtKey);
    if (isNonEmptyString(value)) return value;
  }

  set jwt(value: NonEmptyString | undefined) {
    if (!value) {
      this.removeItem(jwtKey);
    } else if (isNonEmptyString(value)) {
      this.setItem(jwtKey, value);
    }
  }
}

export const localWebStorage = new LocalWebStorage();
