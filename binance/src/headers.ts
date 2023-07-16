// TODO BinanceResponseHeaders
//     'x-mbx-uuid' => '0a6b0a0d-9d14-4a0a-a16c-e25f5eb0b656',
//      'x-mbx-used-weight' => '1',
//      'x-mbx-used-weight-1m' => '1',

export class BinanceRequestHeaders extends Headers {
  static apiKeyHeaderKey = "X-MBX-APIKEY";

  static initialHeaders = {
    "Content-Type": "application/json",
    "User-Agent": "ggbot2.com",
  };

  static keys = [
    BinanceRequestHeaders.apiKeyHeaderKey,
    ...Object.keys(BinanceRequestHeaders.initialHeaders),
  ];

  constructor() {
    super(BinanceRequestHeaders.initialHeaders);
  }

  set apiKey(value: string) {
    this.append(BinanceRequestHeaders.apiKeyHeaderKey, value);
  }
}
