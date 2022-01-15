import repl from "repl";
import { client as spoonacularClient } from "../src/clients/spoonacular";
import { dialogService } from "../src/services/dialog";

// open the repl session
const replServer = repl.start({
  prompt: `recipe-finder (${process.env.ENVIRONMENT}) >`,
});

// attach app modules to the repl context
replServer.context.clients = {
  spoonacularClient,
};
replServer.context.services = {
  dialogService,
};

/* eslint-disable no-console */
replServer.on("exit", () => {
  console.log('Received "exit" event from repl!');
  process.exit();
});
