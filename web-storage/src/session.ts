import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@ggbot2/binance";
import {
  BinanceApiKey,
  EmailAddress,
  isBinanceApiKey,
  isEmailAddress,
} from "@ggbot2/models";
import { isLiteralType } from "@ggbot2/type-utils";

const binanceApiKeyKey = "binanceApiKey";
const emailKey = "email";
const gotFirstPageViewKey = "gotFirstPageView";
const doNotShowPleaseConfigureBinanceKey = "doNotShowPleaseConfigureBinance";
const doNotShowPleasePurchaseKey = "doNotShowPleasePurchase";
const binanceExchangeInfoKey = "binanceExchangeInfo";
const activeTabIdKey = (pageName: string) => `${pageName}:activeTab`;

class SessionWebStorage {
  private getItem(key: string) {
    return window.sessionStorage.getItem(key);
  }

  private setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  // TODO better to create removeX removeY methods so setters do not accept undefined
  private removeItem(key: string) {
    if (key === "binanceExchangeInfo")
      this.binanceExchangeInfoIsValid = undefined;

    window.sessionStorage.removeItem(key);
  }

  clear() {
    window.sessionStorage.clear();
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

  get binanceApiKey(): BinanceApiKey | undefined {
    const value = this.getItem(binanceApiKeyKey);
    if (!value) return;
    try {
      const binanceApiKey = JSON.parse(value);
      if (isBinanceApiKey(binanceApiKey)) return binanceApiKey;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.removeItem(binanceApiKeyKey);
        return;
      }
      throw error;
    }
  }

  set binanceApiKey(value: BinanceApiKey | undefined) {
    if (!value) {
      this.removeItem(binanceExchangeInfoKey);
      return;
    }
    try {
      this.setItem(binanceApiKeyKey, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  /** Avoids running `isBinanceExchangeInfo` type-guard multiple times. */
  private binanceExchangeInfoIsValid: boolean | undefined;

  get binanceExchangeInfo(): BinanceExchangeInfo | undefined {
    const value = this.getItem(binanceExchangeInfoKey);
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
        this.removeItem(binanceExchangeInfoKey);
        return;
      }
      throw error;
    }
  }

  set binanceExchangeInfo(value: BinanceExchangeInfo | undefined) {
    if (!value) {
      this.removeItem(binanceExchangeInfoKey);
      return;
    }
    try {
      this.setItem(binanceExchangeInfoKey, JSON.stringify(value));
      this.binanceExchangeInfoIsValid = true;
    } catch (error) {
      console.error(error);
    }
  }

  get email(): EmailAddress | undefined {
    const value = this.getItem(emailKey);
    if (isEmailAddress(value)) return value;
  }

  set email(value: EmailAddress | undefined) {
    if (!value) {
      this.removeItem(emailKey);
      return;
    }
    this.setItem(emailKey, value);
  }

  get doNotShowPleaseConfigureBinance(): boolean {
    return Boolean(this.getItem(doNotShowPleaseConfigureBinanceKey));
  }

  set doNotShowPleaseConfigureBinance(value: boolean) {
    this.setItem(doNotShowPleaseConfigureBinanceKey, String(value));
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
