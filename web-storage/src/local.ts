import { isStrategy, Strategy } from "@ggbot2/models";
import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils";

import { isDev } from "./isDev.js";
import { itemKey } from "./itemKeys.js";

class LocalWebStorage {
  private getItem(key: string) {
    if (isDev) console.info("web-storage", "local", "getItem", key);
    return window.localStorage.getItem(key);
  }

  private setItem(key: string, value: string) {
    if (isDev) console.info("web-storage", "local", "setItem", key, value);
    window.localStorage.setItem(key, value);
  }

  private removeItem(key: string) {
    if (isDev) console.info("web-storage", "local", "removeItem", key);
    window.localStorage.removeItem(key);
  }

  clear() {
    if (isDev) console.info("web-storage", "local", "clear");
    window.localStorage.clear();
  }

  get jwt(): NonEmptyString | undefined {
    const value = this.getItem(itemKey.jwt());
    if (isNonEmptyString(value)) return value;
  }

  set jwt(value: NonEmptyString | undefined) {
    // TODO better to create removeX removeY methods so setters do not accept undefined
    if (!value) {
      this.removeItem(itemKey.jwt());
      return;
    }
    if (isNonEmptyString(value)) this.setItem(itemKey.jwt(), value);
  }

  getStrategy(strategyId: Strategy["id"]): Strategy | undefined {
    const key = itemKey.strategy(strategyId);
    const value = this.getItem(key);
    if (!value) return;
    try {
      const strategy = JSON.parse(value);
      if (isStrategy(strategy)) return strategy;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.removeItem(key);
        return;
      }
      throw error;
    }
  }

  setStrategy(strategy: Strategy) {
    this.setItem(itemKey.strategy(strategy.id), JSON.stringify(strategy));
  }

  removeStrategy(strategyId: Strategy["id"]) {
    this.removeItem(itemKey.strategy(strategyId));
  }
}

export const localWebStorage = new LocalWebStorage();
