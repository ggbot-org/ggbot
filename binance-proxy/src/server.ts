import { createServer } from "node:http";

import {
  binanceApiDomain,
  BinanceRequestHeaders,
  isBinanceApiPrivateEndoint,
} from "@ggbot2/binance";
import { isDev } from "@ggbot2/env";
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@ggbot2/http";

const PORT = 3000;

createServer(async (request, response) => {
  const { headers: sourceHeaders, url: sourceUrl } = request;

  if (typeof sourceUrl !== "string") {
    response.writeHead(__400__BAD_REQUEST__);
    response.end();
    return;
  }

  if (isDev) console.info("sourceUrl", sourceUrl);

  if (sourceUrl === "/health-check") {
    response.end("OK");
    return;
  }

  if (sourceUrl === "/robots.txt") {
    response.end("User-agent: *\nDisallow: /");
    return;
  }

  const targetUrl = new URL(sourceUrl, `https://${binanceApiDomain}`);

  if (!isBinanceApiPrivateEndoint(targetUrl.pathname)) {
    if (isDev) console.info(__400__BAD_REQUEST__, targetUrl.pathname);
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

  if (!proxiedResponse.ok) {
    if (isDev) console.info(proxiedResponse.status);
    response.end(proxiedResponse.statusText);
    return;
  }

  const data = await proxiedResponse.json();
  if (isDev) console.info(data);
  const json = JSON.stringify(data);
  response.end(json);
}).listen(PORT, () => {
  if (isDev) console.info(`Server running on port ${PORT}`);
});
