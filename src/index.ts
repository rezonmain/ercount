import { NotLiveError } from "./interfaces/Errors";
import { TwitchCollector } from "./services/TwitchCollector";

const channelName = process.argv[2];
const twitchCollector = new TwitchCollector(channelName);

try {
  await twitchCollector.start();
} catch (e) {
  if (e instanceof NotLiveError) {
    console.error(e.message);
    process.exit(0);
  }
}

process.on("SIGINT", async () => {
  await twitchCollector.stop();
  process.exit(0);
});

for await (const line of console) {
  if (line === "stop") {
    await twitchCollector.stop();
    break;
  }
}

await twitchCollector.analytics.calculate();
console.log("chatters", twitchCollector.analytics.chatters);
console.log("views", twitchCollector.analytics.viewCount);
console.log("duration", twitchCollector.analytics.durationSeconds);
