import { Handler, serve } from "https://deno.land/std@0.171.0/http/server.ts";

const port = 8080;

const handler: Handler = (request) => {
  const url = new URL(request.url);
  switch (true) {
    case url.pathname === "/":
      return new Response("OK", {
        status: 200,
      });

    default:
      return new Response("NOT FOUND", { status: 404 });
  }
};

await serve(handler, { port });
