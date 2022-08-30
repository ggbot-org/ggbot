import { getDflowBinanceDynamicNodesCatalog } from "./nodesCatalog";
import { BinanceClientMock } from "./mocks/client";

describe("getDflowBinanceDynamicNodesCatalog", () => {
  it("creates a Dflow node for every Binance symbol", async () => {
    const binance = new BinanceClientMock();
    const nodesCatalog = await getDflowBinanceDynamicNodesCatalog({ binance });
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
});
