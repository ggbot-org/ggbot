import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@ggbot2/binance";
import { EmailAddress, isEmailAddress } from "@ggbot2/models";
import { isLiteralType } from "@ggbot2/type-utils";

const emailKey = "email";
const gotFirstPageViewKey = "gotFirstPageView";
const doNotShowPleasePurchaseKey = "doNotShowPleasePurchase";
const binanceExchangeInfoKey = "binanceExchangeInfo";
const activeTabIdKey = (pageName: string) => `${pageName}:activeTab`;

class SessionWebStorage {
  clear() {
    window.sessionStorage.clear();
  }

  getItem(key: string) {
    return window.sessionStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  removeItem(key: string) {
    if (key === "binanceExchangeInfo")
      this.binanceExchangeInfoIsValid = undefined;

    window.sessionStorage.removeItem(key);
  }

  getActiveTabId<TabId extends string>(
    pageName: string,
    tabIds: readonly TabId[]
  ): TabId | undefined {
    const value = this.getItem(activeTabIdKey(pageName));
    if (isLiteralType<TabId>(tabIds)(value)) return value;
  }

  setActiveTabId<TabId extends string>(pageName: string, value: TabId) {
    this.setItem(activeTabIdKey(pageName), value);
  }

  /** Avoids running `isBinanceExchangeInfo` type-guard multiple times. */
  private binanceExchangeInfoIsValid: boolean | undefined;

  get binanceExchangeInfo(): BinanceExchangeInfo | undefined {
    const value = this.getItem(binanceExchangeInfoKey);
    if (value) {
      try {
        const binanceExchangeInfo = JSON.parse(value);
        if (this.binanceExchangeInfoIsValid) {
          return binanceExchangeInfo as BinanceExchangeInfo;
        }
        if (isBinanceExchangeInfo(binanceExchangeInfo)) {
          this.binanceExchangeInfoIsValid = true;
          return binanceExchangeInfo;
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          this.removeItem(binanceExchangeInfoKey);
          return;
        }
        throw error;
      }
    }
  }

  set binanceExchangeInfo(value: BinanceExchangeInfo | undefined) {
    if (value) {
      try {
        this.setItem(binanceExchangeInfoKey, JSON.stringify(value));
        this.binanceExchangeInfoIsValid = true;
      } catch (error) {
        if (error instanceof SyntaxError) return;
        throw error;
      }
    } else {
      this.removeItem(binanceExchangeInfoKey);
    }
  }

  get email(): EmailAddress | undefined {
    const value = this.getItem(emailKey);
    if (isEmailAddress(value)) return value;
  }

  set email(value: EmailAddress | undefined) {
    if (value) {
      this.setItem(emailKey, value);
    } else {
      this.removeItem(emailKey);
    }
  }

  get doNotShowPleasePurchase(): boolean {
    return Boolean(this.getItem(doNotShowPleasePurchaseKey));
  }

  set doNotShowPleasePurchase(value: boolean) {
    this.setItem(doNotShowPleasePurchaseKey, String(value));
  }

  get gotFirstPageView(): boolean {
    return Boolean(this.getItem(gotFirstPageViewKey));
  }

  set gotFirstPageView(value: boolean) {
    this.setItem(gotFirstPageViewKey, String(value));
  }
}

export const sessionWebStorage = new SessionWebStorage();
