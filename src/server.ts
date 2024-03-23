import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  let server: Server;
  server = app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port} ✅`);
  });
}

main();
