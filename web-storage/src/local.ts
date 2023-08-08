import { isStrategy, Strategy } from "@ggbot2/models";
import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils";

const jwtKey = "jwt";
const strategyKey = (id: Strategy["id"]) => `strategy:${id}`;

class LocalWebStorage {
  private getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  private setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  private removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
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

  getStrategy(strategyId: Strategy["id"]): Strategy | undefined {
    const key = strategyKey(strategyId);
    const value = this.getItem(key);
    if (value) {
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
  }

  setStrategy(strategy: Strategy) {
    this.setItem(strategyKey(strategy.id), JSON.stringify(strategy));
  }

  removeStrategy(strategyId: Strategy["id"]) {
    this.removeItem(strategyKey(strategyId));
  }
}

export const localWebStorage = new LocalWebStorage();
