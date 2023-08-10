import { createServer } from "node:http";

import {
  binanceApiDomain,
  BinanceRequestHeaders,
  isBinanceApiPrivateEndoint,
} from "@ggbot2/binance";
import { ENV } from "@ggbot2/env";
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@ggbot2/http";

const proxyUrl = new URL(ENV.BINANCE_PROXY_BASE_URL());
const PORT = proxyUrl.port;
const ELASTIC_IP = proxyUrl.hostname;

// TODO get Elastic IP from proxyUrl.hostname and attach it to this instance.

createServer(async (request, response) => {
  const { headers: sourceHeaders, url: sourceUrl } = request;

  if (typeof sourceUrl !== "string") {
    response.writeHead(__400__BAD_REQUEST__);
    response.end();
    return;
  }

  if (sourceUrl === "/robots.txt") {
    response.end("User-agent: *\nDisallow: /");
    return;
  }

  const targetUrl = new URL(sourceUrl, `https://${binanceApiDomain}`);

  if (!isBinanceApiPrivateEndoint(targetUrl.pathname)) {
    response.writeHead(__404__NOT_FOUND__);
    response.end();
    return;
  }

  const targetHeaders = new Headers({
    "User-agent": "ggbot2.com",
  });
  for (const [key, value] of Object.entries(sourceHeaders))
    if (BinanceRequestHeaders.isApiKeyHeader(key) && typeof value === "string")
      targetHeaders.append(key, value);

  const proxiedResponse = await fetch(targetUrl, {
    headers: targetHeaders,
    method: request.method,
  });

  response.writeHead(proxiedResponse.status);
  response.end();
}).listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
  console.info(`Elastic IP is ${ELASTIC_IP}`);
});
