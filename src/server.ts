import { Server } from "http";
import app from "./app";

const port = 3000;

async function main() {
  let server: Server;
  server = app.listen(port, () => {
    console.log(`App is listening on port ${port} ✅`);
  });
}

main();
