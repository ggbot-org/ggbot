// TODO BinanceResponseHeaders
//     'x-mbx-uuid' => '0a6b0a0d-9d14-4a0a-a16c-e25f5eb0b656',
//      'x-mbx-used-weight' => '1',
//      'x-mbx-used-weight-1m' => '1',

export class BinanceRequestHeaders extends Headers {
  static apiKeyHeader = "X-MBX-APIKEY";

  static isApiKeyHeader(arg: unknown): boolean {
    if (typeof arg !== "string") return false;
    // Headers may be in lower or upper case.
    return (
      BinanceRequestHeaders.apiKeyHeader.toLowerCase() === arg.toLowerCase()
    );
  }

  set apiKey(value: string) {
    this.append(BinanceRequestHeaders.apiKeyHeader, value);
  }
}
