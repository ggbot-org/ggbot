import { getDflowBinanceDynamicNodesCatalog } from "./nodesCatalog";
import { BinanceClientMock } from "./mocks/client";
import { DflowBinanceSymbolInfo } from "./symbols";

describe("getDflowBinanceDynamicNodesCatalog", () => {
  it("creates Dflow nodes related with Binance symbols", async () => {
    const binance = new BinanceClientMock();
    const { symbols } = await binance.exchangeInfo();
    const nodesCatalog = getDflowBinanceDynamicNodesCatalog({ symbols });
    expect(Object.keys(nodesCatalog)).toEqual(
      expect.arrayContaining([
        "BNB/BTC",
        "BNB/BUSD",
        "BNB/ETH",
        "BTC/BUSD",
        "ETH/BTC",
        "ETH/BUSD",
      ])
    );
  });

  it("creates a Dflow node for a Binance symbol if it is a valid DflowBinanceSymbolInfo", async () => {
    const validSymbol: DflowBinanceSymbolInfo = {
      symbol: "AAABTC",
      status: "TRADING",
      baseAsset: "AAA",
      baseAssetPrecision: 8,
      quoteAsset: "BTC",
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      isSpotTradingAllowed: true,
    };

    const invalidSymbols: DflowBinanceSymbolInfo[] = [
      {
        symbol: "XXABUSD",
        // status is not "TRADING"
        status: "BREAK",
        baseAsset: "XXA",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        isSpotTradingAllowed: true,
      },
      {
        symbol: "XXBBUSD",
        status: "TRADING",
        baseAsset: "XXB",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        // isSpotTradingAllowed is not true
        isSpotTradingAllowed: false,
      },
      {
        symbol: "XXCBUSD",
        status: "TRADING",
        baseAsset: "XXC",
        // baseAssetPrecision is not 8
        baseAssetPrecision: 1,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        // isSpotTradingAllowed is not true
        isSpotTradingAllowed: false,
      },
      {
        symbol: "XXDYYY",
        status: "TRADING",
        baseAsset: "XXD",
        baseAssetPrecision: 8,
        // quoteAsset is not in dflowBinanceQuoteAssets list
        quoteAsset: "YYY",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        isSpotTradingAllowed: true,
      },
      {
        // symbol mismatch with baseAsset/quoteAsset
        symbol: "XXXBUSD",
        status: "TRADING",
        baseAsset: "XXE",
        baseAssetPrecision: 8,
        quoteAsset: "BUSD",
        quotePrecision: 8,
        quoteAssetPrecision: 8,
        baseCommissionPrecision: 8,
        isSpotTradingAllowed: true,
      },
    ];

    const nodesCatalog = getDflowBinanceDynamicNodesCatalog({
      symbols: [validSymbol, ...invalidSymbols],
    });

    // Valid node.
    expect(nodesCatalog["AAA/BTC"]).toBeDefined();
    // Invalid nodes.
    expect(nodesCatalog["XXA/BUSD"]).toBeUndefined();
    expect(nodesCatalog["XXB/BUSD"]).toBeUndefined();
    expect(nodesCatalog["XXC/BUSD"]).toBeUndefined();
    expect(nodesCatalog["XXD/YYYY"]).toBeUndefined();
    expect(nodesCatalog["XXE/BUSD"]).toBeUndefined();
  });
});
