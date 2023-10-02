import { NotLiveError } from "@/interfaces/Errors";
import { Debug } from "@/services/Debug";
import { TwitchCollector } from "@/services/TwitchCollector";

const channelName = process.argv[2];
const skipAnalysis = process.argv[3] === "--skip-analysis";

if (!channelName) {
  Debug.error("No channel name provided");
  Debug.info("Usage: bun log <channel name>");
  process.exit(0);
}

const twitchCollector = new TwitchCollector(channelName);

try {
  await twitchCollector.start();
} catch (e) {
  if (e instanceof NotLiveError) {
    Debug.error(e.message);
    process.exit(0);
  }
}

Debug.info(
  `${new Date().toLocaleTimeString()} [ercount 🚨] Enter 'stop' or Ctrl+C to stop logging${
    skipAnalysis ? ":" : " and run analysis:"
  }`
);

const runAnalysis = async () => {
  if (skipAnalysis) {
    process.exit(0);
  }
  await twitchCollector.analytics.log();
};

process.on("SIGINT", async () => {
  await twitchCollector.stop();
  await runAnalysis();
  process.exit(0);
});

for await (const line of console) {
  if (line === "stop") {
    await twitchCollector.stop();
    await runAnalysis();
    break;
  }
}
