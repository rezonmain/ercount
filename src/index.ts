import { NotLiveError } from "./interfaces/Errors";
import { TwitchCollector } from "./services/TwitchCollector";

const twitchCollector = new TwitchCollector("paymoneywubby");

try {
  await twitchCollector.start();
} catch (e) {
  if (e instanceof NotLiveError) {
    console.error(e.message);
    process.exit(0);
  }
}

for await (const line of console) {
  if (line === "stop") {
    twitchCollector.stop();
    break;
  }
}
