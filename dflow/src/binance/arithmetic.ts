/**
Most of the Binance symbols has precision 8. Others are edge case markets.
In `binance.exchangeInfo()`` response, there are over 2000 symbols with values
```json
{
  "baseAssetPrecision": 8,
  "baseCommissionPrecision": 8,
  "quoteAssetPrecision": 8,
  "quoteCommissionPrecision": 8,
  "quotePrecision": 8,
}
```
*/
export const dflowBinancePrecision = 8;
