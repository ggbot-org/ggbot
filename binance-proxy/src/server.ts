import * as http from "node:http";

const PORT = 8080;

http
  .createServer(async (req, res) => {
    console.log(req.headers);
    console.log(req.url);

    res.end("ok");
  })
  .listen(PORT);
