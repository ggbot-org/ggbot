import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@ggbot2/binance";
import { isLiteralType } from "@ggbot2/type-utils";

import { isDev } from "./isDev.js";
import { itemKey } from "./itemKeys.js";

class SessionWebStorage {
  private getItem(key: string) {
    if (isDev) console.info("web-storage", "session", "getItem", key);
    return window.sessionStorage.getItem(key);
  }

  private setItem(key: string, value: string) {
    if (isDev) console.info("web-storage", "session", "setItem", key, value);
    window.sessionStorage.setItem(key, value);
  }

  // TODO better to create removeX removeY methods so setters do not accept undefined
  private removeItem(key: string) {
    if (isDev) console.info("web-storage", "session", "removeItem", key);
    if (key === itemKey.binanceExchangeInfo())
      this.binanceExchangeInfoIsValid = undefined;

    window.sessionStorage.removeItem(key);
  }

  clear() {
    if (isDev) console.info("web-storage", "session", "clear");
    window.sessionStorage.clear();
  }

  getActiveTabId<TabId extends string>(
    pageName: string,
    tabIds: readonly TabId[]
  ): TabId | undefined {
    const value = this.getItem(itemKey.activeTabId(pageName));
    if (isLiteralType<TabId>(tabIds)(value)) return value;
  }

  setActiveTabId<TabId extends string>(pageName: string, value: TabId) {
    this.setItem(itemKey.activeTabId(pageName), value);
  }

  /** Avoids running `isBinanceExchangeInfo` type-guard multiple times. */
  private binanceExchangeInfoIsValid: boolean | undefined;

  get binanceExchangeInfo(): BinanceExchangeInfo | undefined {
    const key = itemKey.binanceExchangeInfo();
    const value = this.getItem(key);
    if (!value) return;
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
        this.removeItem(key);
        return;
      }
      throw error;
    }
  }

  set binanceExchangeInfo(value: BinanceExchangeInfo | undefined) {
    const key = itemKey.binanceExchangeInfo();
    if (!value) {
      this.removeItem(key);
      return;
    }
    try {
      this.setItem(key, JSON.stringify(value));
      this.binanceExchangeInfoIsValid = true;
    } catch (error) {
      console.error(error);
    }
  }

  get doNotShowPleaseConfigureBinance(): boolean {
    return Boolean(this.getItem(itemKey.doNotShowPleaseConfigureBinance()));
  }

  set doNotShowPleaseConfigureBinance(value: boolean) {
    this.setItem(itemKey.doNotShowPleaseConfigureBinance(), String(value));
  }

  get doNotShowPleasePurchase(): boolean {
    return Boolean(this.getItem(itemKey.doNotShowPleasePurchase()));
  }

  set doNotShowPleasePurchase(value: boolean) {
    this.setItem(itemKey.doNotShowPleasePurchase(), String(value));
  }

  get gotFirstPageView(): boolean {
    return Boolean(this.getItem(itemKey.gotFirstPageView()));
  }

  set gotFirstPageView(value: boolean) {
    this.setItem(itemKey.gotFirstPageView(), String(value));
  }
}

export const sessionWebStorage = new SessionWebStorage();
