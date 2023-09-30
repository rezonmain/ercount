import { TwitchCollector } from "./services/TwitchCollector";

const twitchCollector = new TwitchCollector("paymoneywubby");
twitchCollector.start();

setInterval(() => {
  console.clear();
  console.log(twitchCollector.stats);
}, 5000);
