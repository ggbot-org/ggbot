import * as http from "node:http";

import {
  binanceApiDomain,
  BinanceRequestHeaders,
  isBinanceApiPrivateEndoint,
} from "@ggbot2/binance";
import { __400__BAD_REQUEST__, __404__NOT_FOUND__ } from "@ggbot2/http";

const PORT = 8080;

http
  .createServer(async (request, response) => {
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

    const targetHeaders = new Headers();
    for (const [key, value] of Object.entries(sourceHeaders)) {
      if (
        BinanceRequestHeaders.keys.includes(key) &&
        typeof value === "string"
      ) {
        targetHeaders.append(key, value);
      }
    }

    const proxiedResponse = await fetch(targetUrl, {
      headers: targetHeaders,
      method: request.method,
    });

    response.writeHead(proxiedResponse.status);
    response.end();
  })
  .listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
