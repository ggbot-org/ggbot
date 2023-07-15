import * as http from "node:http";

const PORT = 8080;

http
  .createServer(async (req, res) => {
    console.info(req.headers);
    console.info(req.url);

    res.end("ok");
  })
  .listen(PORT);
