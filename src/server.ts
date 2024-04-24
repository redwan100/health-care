import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  let server: Server;
  server = app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port} ✅`);
  });

  const exitHandler = () => {
    if (server) {
      server.close();
      console.log("server is closed");
    }
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });
  process.on("unhandledRejection", (error) => {
    console.log(error);

    exitHandler();
  });
}

main();
