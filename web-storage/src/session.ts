import { BinanceExchangeInfo, isBinanceExchangeInfo } from "@ggbot2/binance";
import { EmailAddress, isEmailAddress } from "@ggbot2/models";

const emailKey = "email";
const gotFirstPageViewKey = "gotFirstPageView";
const binanceExchangeInfoKey = "binanceExchangeInfo";

const keys = [emailKey, gotFirstPageViewKey, binanceExchangeInfoKey] as const;
type Key = (typeof keys)[number];

class SessionWebStorage {
  getItem(key: Key) {
    return window.sessionStorage.getItem(key);
  }

  setItem(key: Key, value: string) {
    window.sessionStorage.setItem(key, value);
  }

  removeItem(key: Key) {
    if (key === "binanceExchangeInfo")
      this.binanceExchangeInfoIsValid = undefined;

    window.sessionStorage.removeItem(key);
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
