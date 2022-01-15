import createDialogService from "./services/dialog";
import createLogger from "./services/logger";

const dialogService = createDialogService();
const logger = createLogger();

async function start(): Promise<void> {
  logger.info("Starting!");
  await dialogService.start();
}

start();
