import http from "http";

import { serverHandler } from "./router.js";

const server = http.createServer();

const hostname = "127.0.0.1";
const port = 3000;

server.on("request", serverHandler);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
