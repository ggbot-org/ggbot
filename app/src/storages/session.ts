const hasSessionKey = "hasSession";

class SessionStorage {
  get hasSession(): boolean | undefined {
    const value = window.sessionStorage.getItem(hasSessionKey);
    if (value) return true;
    if (value !== null) window.sessionStorage.removeItem(hasSessionKey);
  }

  set hasSession(value: boolean | undefined) {
    if (value) {
      window.sessionStorage.setItem(hasSessionKey, String(true));
    } else {
      window.sessionStorage.removeItem(hasSessionKey);
    }
  }
}

export const sessionStorage = new SessionStorage();